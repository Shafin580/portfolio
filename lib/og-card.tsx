import { ImageResponse } from "next/og";
import { LOGO_DATA_URI } from "@/lib/logo-svg";
import { SITE_URL } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Fetch a real Inter face so the card matches the site's typography.
 * `next/font` cannot be used inside ImageResponse, and satori rejects woff2 —
 * so this asks Google Fonts with a legacy UA to get a plain TTF back.
 * Any failure falls through to ImageResponse's bundled default font rather
 * than failing the build.
 */
async function loadInter(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
      next: { revalidate: false },
    }).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/** Trim to `max` characters without splitting a word, adding an ellipsis. */
function clampWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

export interface OgCard {
  /** Big line — a name or a project title. */
  title: string;
  /** Accent line under the title. */
  subtitle: string;
  /** Muted supporting sentence. */
  body: string;
  /** Pill row along the bottom. */
  chips: readonly string[];
  /** Small label above the title, e.g. "Case study". Omitted when absent. */
  eyebrow?: string;
}

/**
 * The single OG card renderer. Both the root card and every project card go
 * through here so a design change lands in one place.
 */
export async function renderOgCard({ title, subtitle, body, chips, eyebrow }: OgCard) {
  const [regular, bold] = await Promise.all([loadInter(400), loadInter(700)]);

  const fonts = [
    regular && { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[];

  // Long project titles have to shrink or they overflow the 1200px card.
  const titleSize = title.length > 26 ? 62 : title.length > 18 ? 72 : 82;

  // 630px is a hard ceiling and satori does not reflow — an over-long body or a
  // seventh chip silently pushes the pill row off the bottom of the card. Cut on
  // a word boundary so the card never ends mid-word.
  const clampedBody = clampWords(body, 150);
  const clampedChips = chips.slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0f1c",
          fontFamily: fonts.length ? "Inter" : undefined,
          position: "relative",
        }}
      >
        {/* Ambient glow, echoing the hero section */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(37,99,235,0.45) 0%, rgba(10,15,28,0) 70%)",
            display: "flex",
          }}
        />

        {/* Header: mark + domain */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* satori renders plain <img> only — next/image does not exist inside
              an ImageResponse. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 26, color: "#94a3b8", letterSpacing: -0.2 }}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#60a5fa",
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              color: "#60a5fa",
              letterSpacing: -1,
              lineHeight: 1.15,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 25,
              color: "#94a3b8",
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            {clampedBody}
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", gap: 12 }}>
          {clampedChips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 9999,
                border: "1px solid rgba(96,165,250,0.35)",
                background: "rgba(37,99,235,0.14)",
                color: "#bfdbfe",
                fontSize: 24,
                whiteSpace: "nowrap",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
