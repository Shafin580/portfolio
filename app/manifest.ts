import type { MetadataRoute } from "next";
import { profile } from "@/lib/portfolio-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.title}`,
    short_name: profile.name,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1c",
    theme_color: "#2563eb",
    icons: [
      { src: "/img/logo.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
