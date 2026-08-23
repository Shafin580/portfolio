/**
 * Canonical site origin, normalised without a trailing slash.
 *
 * Everything that builds an absolute URL (metadata, sitemap, robots, JSON-LD,
 * llms.txt) reads from here so swapping domains is a one-line change.
 * The trailing-slash strip is load-bearing: `NEXT_PUBLIC_SITE_URL` has
 * historically been set with a trailing `/`, which produced `//sitemap.xml`.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://shadev-tech.com").replace(
  /\/+$/,
  ""
);

/** Build an absolute URL from a site-root-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
