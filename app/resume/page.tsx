import type { Metadata } from "next";
import { Download, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { PrintButton } from "@/components/print-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { profile, resume, type ResumeBullet, type ResumeEntry } from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { buildResumeStructuredData } from "@/lib/structured-data";

const title = "Resume";
const path = "/resume";

const ogImage = {
  url: "/og/root.png",
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.title}`,
} as const;

export const metadata: Metadata = {
  title,
  description: resume.metaDescription,
  keywords: [
    "Shafin Ahmed resume",
    "Full-Stack Software Engineer resume",
    "Next.js developer CV",
    "React TypeScript developer resume",
    "Laravel developer CV",
    "software engineer Dhaka Bangladesh",
    "Shafin Ahmed CV",
    profile.name,
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: path },
  // A child `openGraph` REPLACES the layout's — restate `locale` and the rest.
  openGraph: {
    type: "profile",
    title,
    description: resume.metaDescription,
    url: absoluteUrl(path),
    siteName: `${profile.name} — ${profile.title}`,
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: resume.metaDescription,
    images: [ogImage.url],
  },
};

/** `https://www.linkedin.com/in/x/` → `linkedin.com/in/x`, the form the PDF prints. */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Bullet({ bullet }: { bullet: ResumeBullet }) {
  if (typeof bullet === "string") return <li>{bullet}</li>;

  return (
    <li>
      {bullet.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <a
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {part.text}
          </a>
        ),
      )}
    </li>
  );
}

function Entry({ entry }: { entry: ResumeEntry }) {
  return (
    <article className="break-inside-avoid">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-semibold">
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline-offset-4 hover:underline"
            >
              {entry.title}
            </a>
          ) : (
            entry.title
          )}
        </h3>
        <span className="text-muted-foreground shrink-0 text-sm">{entry.period}</span>
      </div>
      {(entry.subtitle || entry.location) && (
        <p className="text-muted-foreground text-sm">
          {[entry.subtitle, entry.location].filter(Boolean).join(" · ")}
        </p>
      )}
      {entry.stack && (
        <p className="text-muted-foreground text-sm italic">{entry.stack.join(" · ")}</p>
      )}
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {entry.bullets.map((bullet, index) => (
          <Bullet key={index} bullet={bullet} />
        ))}
      </ul>
    </article>
  );
}

function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <h2
        id={id}
        className="text-muted-foreground mb-4 border-b pb-1 text-sm font-semibold tracking-wide uppercase print:break-after-avoid"
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <>
      {/* Server-rendered on purpose — see the note in app/page.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildResumeStructuredData()) }}
      />
      <div className="bg-background min-h-screen">
        <SiteHeader hrefPrefix="/" />

        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 print:py-0">
          <div className="print:hidden">
            {/* Mirrors the BreadcrumbList node — edit the two together */}
            <BreadcrumbTrail items={[{ label: "Home", href: "/" }, { label: "Resume" }]} />
          </div>

          <header className="mt-6">
            <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-primary mt-1 text-lg font-medium">{profile.title}</p>
            <ul className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {profile.locality}, {profile.countryName}
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                <a href={`mailto:${profile.email}`} className="hover:text-foreground">
                  {profile.email}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <LinkedinIcon className="h-3.5 w-3.5" aria-hidden />
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {displayUrl(profile.linkedin)}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <GithubIcon className="h-3.5 w-3.5" aria-hidden />
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {displayUrl(profile.github)}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <Button asChild>
                <TrackedLink
                  href={profile.resume}
                  download
                  event="resume_download"
                  params={{ location: "resume_page" }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </TrackedLink>
              </Button>
              <PrintButton />
            </div>
          </header>

          <Section id="summary" heading="Professional Summary">
            <p className="text-sm leading-relaxed">{resume.summary}</p>
          </Section>

          <Section id="skills" heading="Technical Skills">
            <dl className="space-y-1.5 text-sm">
              {resume.skills.map((group) => (
                <div key={group.label} className="break-inside-avoid">
                  <dt className="inline font-semibold">{group.label}: </dt>
                  <dd className="text-muted-foreground inline">{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="experience" heading="Experience">
            <div className="space-y-6">
              {resume.experience.map((entry) => (
                <Entry key={`${entry.title}-${entry.period}`} entry={entry} />
              ))}
            </div>
          </Section>

          <Section id="projects" heading="Projects">
            <div className="space-y-6">
              {resume.projects.map((entry) => (
                <Entry key={entry.title} entry={entry} />
              ))}
            </div>
          </Section>

          <Section id="education" heading="Education">
            <div className="space-y-6">
              {resume.education.map((entry) => (
                <Entry key={entry.title} entry={entry} />
              ))}
            </div>
          </Section>

          <Section id="certifications" heading="Certifications">
            <ul className="space-y-1 text-sm">
              {resume.certifications.map((cert) => (
                <li
                  key={cert.name}
                  className="flex break-inside-avoid items-baseline justify-between gap-4"
                >
                  <span>
                    <span className="font-semibold">{cert.name}</span> – {cert.issuer},{" "}
                    {cert.location}
                  </span>
                  <span className="text-muted-foreground shrink-0">{cert.date}</span>
                </li>
              ))}
            </ul>
          </Section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
