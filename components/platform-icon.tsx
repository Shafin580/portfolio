import { Briefcase } from "lucide-react";

import { FiverrIcon, UpworkIcon } from "@/components/brand-icons";
import type { Platform } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

/**
 * The mark for a marketplace, sized for a square icon tile. Fiverr's only
 * published mark is a wide wordmark, so it is scaled up to stay legible inside
 * the tile; Kwork has no published mark and gets `Briefcase`.
 */
export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  if (platform === "upwork") return <UpworkIcon className={className} />;
  if (platform === "fiverr") return <FiverrIcon className={cn(className, "scale-[1.6]")} />;
  return <Briefcase className={className} aria-hidden="true" />;
}
