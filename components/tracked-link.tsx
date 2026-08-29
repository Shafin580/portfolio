"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { trackEvent } from "@/lib/analytics";

type TrackedLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** GA4 event name, e.g. `click` or `select_content`. */
  event: string;
  /** Event parameters. */
  params?: Record<string, unknown>;
};

/**
 * An anchor that reports a GA4 event before it navigates.
 *
 * Every prop is spread onto the underlying element and `ref` passes through
 * (React 19 hands it to function components as an ordinary prop), so this drops
 * into ShadCN's `<Button asChild>` — Radix `Slot` clones its single child and
 * merges props onto it.
 *
 * The click handler never calls `preventDefault`. `trackEvent` is fire-and-forget
 * and navigation proceeds exactly as it would on a bare `<a>`; a blocked or
 * failed beacon costs a data point, never the visitor's click.
 */
export function TrackedLink({ event, params, onClick, href, ...props }: TrackedLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    trackEvent(event, params);
    onClick?.(e);
  }

  // `download` and external schemes (https:, mailto:) must stay plain anchors —
  // routing a download through next/link would prefetch it and try to
  // client-navigate to a binary.
  const isRoute = !props.download && (href.startsWith("/") || href.startsWith("#"));

  if (isRoute) {
    return <Link href={href} onClick={handleClick} {...props} />;
  }

  return <a href={href} onClick={handleClick} {...props} />;
}
