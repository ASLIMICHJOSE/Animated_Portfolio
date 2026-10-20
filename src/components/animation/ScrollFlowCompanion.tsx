"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ScrollFlowCompanion() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState<{
    act: string;
    label: string;
  }>({
    act: "PROLOGUE",
    label: "HERO SCENE",
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Determine active discovery section based on scroll
      const sections = [
        { id: "hero", act: "PROLOGUE", label: "HERO SCENE" },
        { id: "about", act: "ACT 01", label: "CREATIVE PHILOSOPHY" },
        { id: "skills", act: "ACT 02", label: "CORE CAPABILITIES" },
        { id: "projects", act: "ACT 03", label: "CURATED WORKS" },
        { id: "journey", act: "ACT 04", label: "DEVELOPER ODYSSEY" },
        { id: "contact", act: "ACT 05", label: "TWILIGHT SANCTUARY" },
      ];

      const probeY = scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && probeY >= el.offsetTop - 100) {
          setActiveStage(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <aside
      aria-label="Motion Graphics Discovery Guide"
      className="fixed bottom-5 left-5 z-40 select-none pointer-events-auto"
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-panel border border-[#C96F3B]/35 shadow-2xl backdrop-blur-xl bg-[#201C19]/85 text-[#F5EFE5]">
        {/* Pulsing Discovery Beacon */}
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0A352] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0A352] shadow-sm shadow-[#F0A352]" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#F0A352] font-semibold">
              DISCOVERY // {activeStage.act}
            </span>
            <span className="text-[9px] font-mono text-[#F5EFE5]/40">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
          <span className="text-xs font-serif font-bold text-[#F5EFE5] tracking-wide">
            {activeStage.label}
          </span>
        </div>

        {/* Animated soundwave / flow frequency bars */}
        <div className="flex items-center gap-0.5 pl-1 border-l border-[#C96F3B]/30">
          {[14, 20, 10, 18, 12].map((baseHeight, i) => (
            <span
              key={i}
              className="w-0.5 bg-[#C96F3B] rounded-full transition-all duration-200"
              style={{
                height: isScrolling
                  ? `${Math.max(6, (baseHeight * (1 + Math.sin(Date.now() * 0.01 + i))) / 2)}px`
                  : "6px",
                opacity: isScrolling ? 0.95 : 0.45,
              }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
