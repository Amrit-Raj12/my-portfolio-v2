"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = () => {
      const container = document.getElementById("spa-scroll");

      if (!container) {
        if (mounted) setTimeout(init, 200);
        return;
      }

      const lenis = new Lenis({
        wrapper: container,
        duration: 1.8,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 0.8,
      });

      lenisRef.current = lenis;
      lenisInstance = lenis;
      (window as any).__lenis = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
    };

    init();

    return () => {
      mounted = false;
      lenisRef.current?.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}