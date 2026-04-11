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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-animate={animation}
      data-delay={delay}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
