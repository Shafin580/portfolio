import { ImageResponse } from "next/og";
import { LOGO_DATA_URI } from "@/lib/logo-svg";
import { profile } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HIGHLIGHTS = ["Next.js", "TypeScript", "Laravel", "Docker", "AWS"];

/**
 * Fetch a real Inter face so the card matches the site's typography.
 * `next/font` cannot be used inside ImageResponse, and satori rejects woff2 —
 * so this asks Google Fonts with a legacy UA to get a plain TTF back.
 * Any failure falls through to ImageResponse's bundled default font rather
 * than failing the build.
 */
async function loadInter(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/4.0" }, next: { revalidate: false } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([loadInter(400), loadInter(700)]);

  const fonts = [
    regular && { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[];

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
          <img src={LOGO_DATA_URI} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 26, color: "#94a3b8", letterSpacing: -0.2 }}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {/* Name + title + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: -2.5,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              color: "#60a5fa",
              letterSpacing: -1,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#94a3b8",
              maxWidth: 900,
              lineHeight: 1.45,
            }}
          >
            {`${profile.yearsExperience} years building scalable web applications and cloud-native systems · ${profile.locality}, ${profile.countryName}`}
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", gap: 14 }}>
          {HIGHLIGHTS.map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 9999,
                border: "1px solid rgba(96,165,250,0.35)",
                background: "rgba(37,99,235,0.14)",
                color: "#bfdbfe",
                fontSize: 25,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
