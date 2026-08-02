import "server-only";

/**
 * Build-time liveness check for project "Live demo" links.
 *
 * Client work goes offline without warning, and a Live button that leads
 * nowhere is worse than no button at all. This pings each URL during static
 * generation and caches the verdict for a day (see `revalidate` on the page).
 *
 * Failure classification is the important part: a flaky build network must not
 * silently strip the Live button off every card, so only *definitive* signals
 * count as dead. Anything ambiguous fails open.
 */

export type LinkState = "alive" | "dead";

/** Cache lifetime for a single link verdict, in seconds. */
export const LINK_CHECK_REVALIDATE = 60 * 60 * 24;

const TIMEOUT_MS = 6000;

/** Node/undici error codes that mean the host genuinely is not there. */
const FATAL_CAUSE_CODES = new Set([
  "ENOTFOUND", // DNS has no record
  "EAI_AGAIN", // DNS lookup failed
  "ECONNREFUSED", // host up, nothing listening
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "CERT_HAS_EXPIRED",
]);

function causeCode(error: unknown): string | undefined {
  const cause = (error as { cause?: unknown } | undefined)?.cause;
  const code = (cause as { code?: unknown } | undefined)?.code;
  return typeof code === "string" ? code : undefined;
}

async function checkOne(url: string): Promise<LinkState> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // GET rather than HEAD — a large share of hosts answer HEAD with 405.
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Some hosts reject unknown agents outright.
        "user-agent":
          "Mozilla/5.0 (compatible; PortfolioLinkCheck/1.0; +https://github.com/Shafin580)",
        accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: LINK_CHECK_REVALIDATE },
    });

    return response.status >= 400 ? "dead" : "alive";
  } catch (error) {
    if (FATAL_CAUSE_CODES.has(causeCode(error) ?? "")) return "dead";
    // Timeouts, aborts, transient TLS or socket errors: fail open.
    return "alive";
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check every URL concurrently. Returns a lookup keyed by the original URL;
 * duplicates are only fetched once.
 */
export async function checkLinks(
  urls: readonly (string | null | undefined)[],
): Promise<Record<string, LinkState>> {
  const unique = [...new Set(urls.filter((u): u is string => Boolean(u)))];
  const states = await Promise.all(unique.map(checkOne));

  return Object.fromEntries(unique.map((url, i) => [url, states[i]]));
}
