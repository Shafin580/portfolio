"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "scaleIn";
  delay?: 100 | 200 | 300 | 400 | 500 | 600;
  as?: ElementType;
}

export function AnimatedSection({
  children,
  className,
  animation = "fadeInUp",
  delay,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);

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
    <Tag
      ref={ref}
      data-animate={animation}
      data-delay={delay}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
