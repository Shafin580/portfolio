"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "scaleIn";
  delay?: 100 | 200 | 300 | 400 | 500 | 600;
}

export function AnimatedSection({
  children,
  className,
  animation = "fadeInUp",
  delay,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Someone who asked for less motion gets the finished state immediately. The CSS
    // already forces it, but adding the class keeps the DOM honest for anything reading
    // `.in-view` — and there is no reason to hold an observer open for a reveal that
    // will never animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-animate={animation} data-delay={delay} className={cn(className)}>
      {children}
    </div>
  );
}
