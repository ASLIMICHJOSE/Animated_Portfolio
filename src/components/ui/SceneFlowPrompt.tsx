"use client";

import React from "react";
import { Compass, ArrowDown } from "lucide-react";

interface SceneFlowPromptProps {
  targetId: string;
  chapterNumber: string;
  destinationName: string;
  japaneseDestination: string;
}

export default function SceneFlowPrompt({
  targetId,
  chapterNumber,
  destinationName,
  japaneseDestination,
}: SceneFlowPromptProps) {
  const handleFlowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (!element) return;

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(element, {
        offset: -20,
        duration: 1.6,
      });
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-20 flex justify-center w-full">
      <a
        href={`#${targetId}`}
        onClick={handleFlowClick}
        className="group relative inline-flex items-center gap-3.5 px-6 py-3 rounded-full bg-[#201C19]/80 hover:bg-[#392820]/90 border border-[#C96F3B]/35 hover:border-[#F0A352] backdrop-blur-xl shadow-xl shadow-black/40 text-xs font-mono text-[#F5EFE5] transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F0A352]"
        aria-label={`Flow to ${destinationName}`}
      >
        {/* Animated Compass Icon */}
        <div className="w-6 h-6 rounded-full bg-[#C96F3B]/20 border border-[#F0A352]/40 flex items-center justify-center text-[#F0A352] group-hover:rotate-45 transition-transform duration-500">
          <Compass className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#F0A352] font-semibold">{chapterNumber}</span>
          <span className="text-[#F5EFE5]/40">•</span>
          <span className="group-hover:text-[#F0A352] transition-colors font-medium">
            Flow to {destinationName}
          </span>
          <span className="text-[10px] font-serif text-[#F0A352]/70 ml-1">
            {japaneseDestination}
          </span>
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-[#F0A352] group-hover:translate-y-1 transition-transform duration-300" />

        {/* Ambient subtle glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#F0A352]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </a>
    </div>
  );
}
