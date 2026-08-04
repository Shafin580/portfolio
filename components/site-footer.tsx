import { profile } from "@/lib/portfolio-data";

/** Shared footer for the homepage and the project case-study pages. */
export function SiteFooter() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Available for new opportunities
          </div>
        </div>
      </div>
    </footer>
  );
}
