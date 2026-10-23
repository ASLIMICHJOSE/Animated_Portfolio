"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Wind,
  Volume2,
  VolumeX,
  Terminal,
  Sparkles,
  Compass,
} from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";
import InteractiveTerminal from "./InteractiveTerminal";

export default function InteractiveCompanionDock() {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState<{ act: string; label: string }>({
    act: "PROLOGUE",
    label: "HERO SCENE",
  });
  const [gustCooling, setGustCooling] = useState(false);

  // Synchronize with scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);

      const sections = [
        { id: "hero", act: "PROLOGUE", label: "HERO SCENE" },
        { id: "about", act: "ACT 01", label: "ESSENCE & BIO" },
        { id: "skills", act: "ACT 02", label: "CAPABILITIES" },
        { id: "projects", act: "ACT 03", label: "SHOWCASE" },
        { id: "journey", act: "ACT 04", label: "ODYSSEY" },
        { id: "certifications", act: "ACT 05", label: "CREDENTIALS" },
        { id: "contact", act: "ACT 06", label: "SANCTUARY" },
      ];

      const probeY = scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && probeY >= el.offsetTop - 120) {
          setActiveStage(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === "Escape" && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen]);

  // Trigger Autumn Whirlwind Gust
  const triggerGust = () => {
    if (gustCooling) return;
    setGustCooling(true);
    soundEngine.playWhirlwind();
    window.dispatchEvent(new CustomEvent("summon-gust"));
    setTimeout(() => setGustCooling(false), 1400);
  };

  // Toggle Soundscape
  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioActive(!muted);
  };

  return (
    <>
      {/* Floating Interactive Companion Dock */}
      <aside
        aria-label="Interactive Experience Dock"
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 select-none pointer-events-auto"
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full glass-panel border border-[#C96F3B]/35 shadow-2xl backdrop-blur-xl bg-[#181310]/92 text-[#F5EFE5] transition-all duration-300 hover:border-[#F0A352]/60">
          {/* 1. Discovery Act Beacon */}
          <div className="flex items-center gap-2 pr-2.5 sm:pr-3 border-r border-[#C96F3B]/30">
            <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0A352] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0A352] shadow-sm shadow-[#F0A352]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#F0A352] font-semibold">
                  {activeStage.act}
                </span>
                <span className="text-[9px] font-mono text-[#F5EFE5]/40">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-serif font-bold text-[#F5EFE5] tracking-wide hidden sm:inline">
                {activeStage.label}
              </span>
            </div>
          </div>

          {/* 2. Interactive Whirlwind Gust Trigger */}
          <button
            onClick={triggerGust}
            disabled={gustCooling}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
              gustCooling
                ? "bg-[#F0A352] text-[#181310] font-bold shadow-[0_0_15px_#F0A352] scale-105"
                : "bg-[#201C19]/80 text-[#F5EFE5]/85 hover:text-[#F0A352] hover:bg-[#281F1B] border border-[#C96F3B]/25"
            }`}
            aria-label="Summon an autumn leaf whirlwind"
            title="Summon an autumn leaf whirlwind across the screen"
          >
            <Wind className={`w-3.5 h-3.5 ${gustCooling ? "animate-spin" : "text-[#F0A352]"}`} />
            <span className="text-[11px] font-semibold">Gust</span>
          </button>

          {/* 3. Ambient Audio Synthesizer Controller */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
              isAudioActive
                ? "bg-[#2D1E16] text-[#FFE8B8] border border-[#F0A352]/60 shadow-sm"
                : "bg-[#201C19]/80 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#281F1B] border border-[#C96F3B]/25"
            }`}
            aria-label={isAudioActive ? "Mute ambient autumn audio" : "Play ambient autumn audio"}
            title={isAudioActive ? "Mute ambient audio" : "Listen to ambient autumn audio"}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#F0A352]" />
                {/* Dancing Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  {[10, 14, 8, 12].map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-[#F0A352] rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#F5EFE5]/50" />
                <span className="text-[11px] hidden sm:inline">Audio</span>
              </>
            )}
          </button>

          {/* 4. Terminal Launcher Button */}
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono bg-[#281F1B] hover:bg-[#F0A352] text-[#F0A352] hover:text-[#181310] border border-[#F0A352]/40 transition-all duration-300 shadow-sm"
            aria-label="Open Command Center Terminal"
            title="Open Developer Command Terminal (Ctrl+K)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">CLI</span>
            <span className="text-[9px] opacity-60 hidden md:inline px-1 py-0.2 rounded bg-black/30">
              ⌘K
            </span>
          </button>
        </div>
      </aside>

      {/* Developer Command Center Dialog */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
}
