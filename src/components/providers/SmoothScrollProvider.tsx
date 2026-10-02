"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      gestureOrientation: "vertical",
      autoRaf: false,
      anchors: true,
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis-enabled");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis-enabled");
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.resize();
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return <>{children}</>;
}
