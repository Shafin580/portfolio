import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * Unlike a fully static site, this one revalidates: `app/page.tsx`,
 * `app/projects/[slug]/page.tsx` and both `llms.txt` routes carry
 * `export const revalidate = 86400`, which is what keeps the live-link verdicts in
 * `lib/link-status.ts` fresh without a redeploy.
 *
 * That means an incremental cache is required, not optional. Without one every isolate
 * re-runs the link pings on a cold start and the ISR contract silently degrades to
 * per-isolate caching.
 *
 * R2 rather than KV: the entries are whole rendered payloads, KV is eventually consistent
 * across regions, and R2's read pricing suits a cache read on every cold request. The
 * bucket must be bound as `NEXT_INC_CACHE_R2_BUCKET` — the binding name is fixed by the
 * adapter, not chosen here (see `r2-incremental-cache.d.ts`).
 *
 * Revalidation also needs `WORKER_SELF_REFERENCE` in `wrangler.jsonc` so the Worker can
 * call back into itself.
 */
export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
