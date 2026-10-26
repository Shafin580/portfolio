"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { ParticleField } from "@/lib/particle-field";

const readPrimary = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const field = useRef<ParticleField | null>(null);
  const { resolvedTheme } = useTheme();

  const applyColor = useCallback(() => field.current?.setColor(readPrimary()), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Someone who asked for less motion keeps the static dot grid. Not loading three at
    // all is the point, so this returns before the dynamic import is even scheduled.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const start = async () => {
      // Dynamic on purpose: three must never land in the initial client chunk.
      let mod: typeof import("@/lib/particle-field");
      try {
        mod = await import("@/lib/particle-field");
      } catch {
        // A failed chunk load is decoration lost, not an error worth surfacing: the dot
        // grid behind the transparent canvas is already the finished fallback.
        return;
      }
      if (cancelled) return;
      const { mountParticleField } = mod;
      field.current = mountParticleField(canvas);
      applyColor();
    };

    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(start);
    } else {
      timer = setTimeout(start, 200);
    }

    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      field.current?.dispose();
      field.current = null;
    };
  }, [applyColor]);

  // The class flip changes --primary. Child effects run before the provider's, so wait a
  // frame for next-themes to have toggled the class before reading the token.
  useEffect(() => {
    const frame = requestAnimationFrame(applyColor);
    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme, applyColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 data-[ready]:opacity-100"
    />
  );
}
