import Link from "next/link";
import { Download, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrackedLink } from "@/components/tracked-link";
import { navLinks, profile } from "@/lib/portfolio-data";

/**
 * Shared site chrome for both the homepage and the project case-study pages.
 *
 * The section links are in-page anchors (`#about`, `#projects`, …), so on any
 * route other than `/` they have to be prefixed to land back on the homepage
 * first — hence `hrefPrefix`.
 */
export function SiteHeader({ hrefPrefix = "" }: { hrefPrefix?: string }) {
  const links = navLinks.map((link) => ({ ...link, href: `${hrefPrefix}${link.href}` }));

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" aria-label={`${profile.name} — home`}>
            <Logo />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6" role="navigation" aria-label="Sections">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <TrackedLink
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.name} on GitHub`}
                event="click"
                params={{ outbound: true, link_domain: "github.com", location: "header" }}
              >
                <GithubIcon className="h-5 w-5" />
              </TrackedLink>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <TrackedLink
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.name} on LinkedIn`}
                event="click"
                params={{ outbound: true, link_domain: "linkedin.com", location: "header" }}
              >
                <LinkedinIcon className="h-5 w-5" />
              </TrackedLink>
            </Button>
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              {/*
                `resume_download`, not `file_download` — GA4 enhanced measurement
                already fires `file_download` automatically for .pdf, and reusing
                the name would double-count every click.
              */}
              <TrackedLink
                href={profile.resume}
                download
                event="resume_download"
                params={{ location: "header" }}
              >
                <Download className="mr-2 h-4 w-4" /> Resume
              </TrackedLink>
            </Button>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <nav className="flex flex-col gap-5 mt-8 px-4" aria-label="Mobile">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator />
                  <Button className="w-full" asChild>
                    <TrackedLink
                      href={profile.resume}
                      download
                      event="resume_download"
                      params={{ location: "mobile_menu" }}
                    >
                      <Download className="mr-2 h-4 w-4" /> Resume
                    </TrackedLink>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
