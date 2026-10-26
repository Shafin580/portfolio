"use client";

import dynamic from "next/dynamic";

/**
 * Client-only entry for the hero particle network.
 *
 * `ssr: false` is what keeps three out of the Cloudflare Worker. A plain `import()`
 * inside `HeroCanvas`'s effect kept it out of the initial client chunk, but the server
 * build still compiled that branch and wrangler bundled three into the Worker (154,273
 * bytes gzipped, measured). With `ssr: false` the server never sees `hero-canvas` at all; the
 * canvas starts transparent, so there is nothing to server-render anyway.
 */
export const HeroScene = dynamic(
  () => import("@/components/hero-canvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);
