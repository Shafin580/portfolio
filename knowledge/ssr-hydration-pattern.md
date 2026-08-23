# SSR + TanStack Query Hydration Pattern

## What this is

A server component prefetches a query on the server, dehydrates the TanStack Query cache, and hands it to the client via `<HydrationBoundary>`. The existing client `useQuery` hook reads from the hydrated cache and renders with data on first paint — no loading spinner, no client round-trip.

This is classic SSR + streaming. **Not** PPR (`cacheComponents`) — that's a separate future migration.

## When to apply this

- Deep-linked, per-entity authenticated routes where first paint matters (details pages, dashboards, profiles, reports).
- The route already renders a client component that fetches its primary data via `useQuery`.

## When NOT to apply this

- Real-time surfaces (live feeds, approval inboxes, activity streams) — the initial HTML would be stale within seconds.
- Pages whose default view is "the user picks a filter" — initial data is thrown away on first interaction.
- Lists whose queryKey depends on client-only state (zustand filters, local searchParams parsing).

## The pattern (copy-paste)

```tsx
// page.tsx (server component — do not add "use client")
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { QUERY_KEYS } from "@/config/query.config";
import { getSession } from "@/lib/auth"; // read session from cookies/headers, server-side
import { getProjectDetails } from "@/services/api"; // same fetcher the client uses
import ProjectClient from "./Components/Project.Client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id); // decrypt/decode first if your route ids are encoded

  // 1. Auth gate first (keeps the redirect short if unauthorized)
  const session = await getSession();
  if (!session) redirect("/login");
  // ... permission check → return <PermissionDenied /> if no access

  // 2. Server-side QueryClient (throwaway, GC'd after request)
  const queryClient = new QueryClient();
  const token = session.token as string | undefined;

  // 3. Prefetch the same query the client useQuery runs.
  //    queryKey AND queryFn return shape MUST match the client exactly,
  //    otherwise hydration is a no-op and the client re-fetches.
  if (token) {
    const authToken = token; // narrow for the async closure
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PROJECTS.DETAIL().key, projectId],
      queryFn: async () => {
        const response = await getProjectDetails({ token: authToken, id: projectId });
        return response.results;
      }
    });
  }

  // 4. Wrap the client tree. dehydrate() must be called at render time, not earlier.
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectClient id={projectId} />
    </HydrationBoundary>
  );
}
```

## Rules to get hydration right

1. **QueryKey parity is everything.** `[QUERY_KEYS.X.Y().key, projectId]` on the server must deep-equal the client's key. Mismatched keys = silent no-op (client refetches, you get zero benefit).
2. **QueryFn return shape must match.** If the client's queryFn returns `response.results`, the server's must too. Don't return the raw response on one side and the unwrapped `.results` on the other.
3. **`dehydrate()` is called inline in JSX** (`state={dehydrate(queryClient)}`), not stored in a variable before the render. This preserves latest cache state.
4. **Narrow nullable tokens** into a local `const` inside the guard block before referencing in async closures. TypeScript's closure narrowing is unreliable across versions.
5. **Do the auth gate BEFORE the prefetch.** Read the session server-side from cookies/headers and permission-check first — no point spending a round-trip on someone who'll see `<PermissionDenied />` or get redirected.
6. **Don't `"use client"` the page.tsx.** Keep the page as a server component; the interactive parts are in the imported `*.Client.tsx` children.

## Verification checklist

After converting a route:

- `pnpm build` (or `npx next build`) — the route should still build (it'll be `ƒ Dynamic` in the route table; that's correct for SSR).
- Browser DevTools → Network → first request to the route: the entity data is present in the initial HTML response (search for a known value in the response body). No `XHR` request for the prefetched query on first paint.
- React Query DevTools (in dev): the query shows `dataUpdatedAt` from a few ms ago and status `success` on mount, not `loading` → `success`.
- Auth regression: logged-out visit to the route still redirects. The auth gate runs on the server.

## Note on API wrappers and the client provider

If your API wrapper routes through a Next.js rewrite/proxy, server-side prefetches loop back through your own server — use a direct backend URL in server-side fetchers to avoid that extra hop.

The client `QueryClientProvider` runs only on the client; it is not itself the client side of the hydration boundary. Hydration works because the provider's `QueryClient` is the one that merges dehydrated state via `<HydrationBoundary>`.
