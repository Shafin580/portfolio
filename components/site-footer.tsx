import { TrackedLink } from "@/components/tracked-link";
import { profile } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

/**
 * Google's Preferred Sources deeplink.
 *
 * Per Google's own documentation the feature needs no structured data, meta tag,
 * or Search Console setting; the only two implementations offered are this URL and
 * a button script served from `news.google.com`. The script is deliberately not
 * used — it adds a fourth third-party origin to every page load and needs its
 * theme kept in sync with `next-themes`, to surface a badge in Top Stories and AI
 * Overviews, placements a portfolio will effectively never occupy.
 *
 * Only domain- and subdomain-level sites are eligible, which this origin is.
 */
const PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${new URL(SITE_URL).hostname}`;

/** Shared footer for the homepage and the project case-study pages. */
export function SiteFooter() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <TrackedLink
              href={PREFERRED_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              event="click"
              params={{ outbound: true, method: "preferred_source" }}
            >
              Follow on Google
            </TrackedLink>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Available for new opportunities
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
