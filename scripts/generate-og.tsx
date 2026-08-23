/**
 * Build-time social-card and touch-icon renderer.
 *
 * Why this exists rather than the Next metadata-image file convention: every
 * `opengraph-image.tsx` / `apple-icon.tsx` route keeps `next/og` in the server module
 * graph, and OpenNext bundles route handlers into the Worker whether or not they are
 * prerendered. That drags `resvg.wasm` (~1.3 MB raw), `yoga.wasm`, a font blob and their
 * JS glue into a compiled script that has a 3 MiB gzipped ceiling on Cloudflare's free
 * plan — measured at 3,970,828 bytes before this script existed, against a 3,145,728
 * limit.
 *
 * These cards are identical on every request, so rendering them once at build time into
 * `public/og/` is strictly better: static assets are served from Cloudflare's asset store
 * and do not count against the script limit.
 *
 * Run via `pnpm og`. Both `build` and `build:cf` run it first.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { caseStudyProjects, profile } from "../lib/portfolio-data";
import { LOGO_DATA_URI } from "../lib/logo-svg";
import { OG_SIZE, renderOgCard } from "../lib/og-card";

const OUT_DIR = path.join(process.cwd(), "public", "og");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const HIGHLIGHTS = ["Next.js", "TypeScript", "Laravel", "Docker", "AWS"];

async function write(target: string, response: Response) {
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
  console.log(`  ${path.relative(process.cwd(), target)}  ${(buffer.length / 1024).toFixed(0)} KB`);
}

/**
 * iOS masks touch icons to its own rounded square, so this renders the mark on an opaque,
 * slightly inset canvas rather than reusing the SVG directly.
 */
function appleIcon() {
  const size = { width: 180, height: 180 };
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2563eb",
      }}
    >
      {/* satori renders plain <img> only. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DATA_URI} width={180} height={180} alt="" />
    </div>,
    size,
  );
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Rendering social cards at ${OG_SIZE.width}x${OG_SIZE.height}…`);

  await write(
    path.join(OUT_DIR, "root.png"),
    await renderOgCard({
      title: profile.name,
      subtitle: profile.title,
      body: `${profile.yearsExperience} years building scalable web applications and cloud-native systems · ${profile.locality}, ${profile.countryName}`,
      chips: HIGHLIGHTS,
    }),
  );

  for (const project of caseStudyProjects) {
    const study = project.caseStudy!;
    await write(
      path.join(OUT_DIR, `${project.slug}.png`),
      await renderOgCard({
        eyebrow: "Case study",
        title: project.title,
        subtitle: study.client ?? `${profile.employer} · in-house`,
        body: project.description,
        chips: project.stacks.slice(0, 5),
      }),
    );
  }

  await write(path.join(PUBLIC_DIR, "apple-icon.png"), appleIcon());

  console.log(`Done — ${caseStudyProjects.length + 2} images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
