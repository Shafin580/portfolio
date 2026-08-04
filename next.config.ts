import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // NOTE: do not enable `output: 'export'`. The project cards ping their live
  // URLs through ISR (see lib/link-status.ts); a static export would freeze
  // those verdicts at build time forever.
  images: {
    // Screenshots in public/img are multi-megabyte PNGs; serving them raw was
    // costing LCP, which is a ranking signal.
    formats: ["image/avif", "image/webp"],
  },
};

export default withBundleAnalyzer(nextConfig);
