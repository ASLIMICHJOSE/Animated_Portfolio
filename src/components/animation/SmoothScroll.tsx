"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { initGSAP } from "@/lib/animations";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // If user prefers reduced motion, do not initialize smooth momentum scrolling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const { gsap, ScrollTrigger } = initGSAP();

    // Ultra-smooth, zero-lag linear interpolation (lerp) momentum scroll
    const lenis = new Lenis({
      lerp: 0.085, // Instantaneous, organic tracking without sluggish input delay or inertia drag
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
      infinite: false,
      autoResize: true,
    });

    window.__lenis = lenis;

    // Direct synchronization: link Lenis to ScrollTrigger update
    lenis.on("scroll", ScrollTrigger.update);

    // Direct integration with GSAP ticker (Zero out-of-phase jitter or frame drops)
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Intelligent lag smoothing: absorbs momentary GPU/CPU micro-stalls without jumping
    gsap.ticker.lagSmoothing(500, 33);

    // Intercept in-page hash anchor clicks to smoothly scroll via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, {
            offset: -30,
            duration: 1.0,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      gsap.ticker.remove(updateTicker);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
