import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader hrefPrefix="/" />

      <main className="flex-1 flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">404</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Project not found</h1>
          <p className="mt-4 text-muted-foreground">
            There&apos;s no case study at this address. It may have been renamed, or the project
            never had a write-up.
          </p>
          <Button className="mt-8" asChild>
            <Link href="/#projects">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to all projects
            </Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
