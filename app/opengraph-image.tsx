import { profile } from "@/lib/portfolio-data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = `${profile.name} — ${profile.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const HIGHLIGHTS = ["Next.js", "TypeScript", "Laravel", "Docker", "AWS"];

export default async function OpengraphImage() {
  return renderOgCard({
    title: profile.name,
    subtitle: profile.title,
    body: `${profile.yearsExperience} years building scalable web applications and cloud-native systems · ${profile.locality}, ${profile.countryName}`,
    chips: HIGHLIGHTS,
  });
}
