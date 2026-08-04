import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";

import { cn } from "@/lib/utils";
import { profile, type Project } from "@/lib/portfolio-data";

/**
 * The visual strip on a project card, and the hero image on its case-study page.
 *
 * Client and in-house work has no public screenshot to show, so `image: null`
 * falls through to a branded gradient placeholder rather than an empty box or a
 * broken `<img>`. Kept in one component so the card and the detail page can
 * never drift apart on that fallback.
 */
export function ProjectMedia({
  project,
  className,
  linkToCaseStudy = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  project: Project;
  className?: string;
  /** Wrap the media in a link to `/projects/<slug>` when a case study exists. */
  linkToCaseStudy?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const media = project.image ? (
    <div className={cn("relative h-48 shrink-0", className)}>
      <Image
        src={project.image}
        alt={`Screenshot of ${project.title} — ${project.stacks
          .slice(0, 3)
          .join(", ")} project by ${profile.name}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    </div>
  ) : (
    <div
      className={cn(
        "relative h-48 shrink-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center",
        className,
      )}
    >
      <div className="text-center px-4">
        <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground/80">{project.title}</p>
        <p className="text-xs text-muted-foreground mt-1">Client / Private Project</p>
      </div>
    </div>
  );

  if (linkToCaseStudy && project.caseStudy) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden
        className="block focus:outline-none"
      >
        {media}
      </Link>
    );
  }

  return media;
}
