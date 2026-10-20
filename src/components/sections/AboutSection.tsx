"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Compass, BookOpen, Heart, Code2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#201C19] border-t border-[#C96F3B]/15 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#C96F3B]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[#777957]/15 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          number="ACT 01 / ESSENCE"
          kanjiSubtitle="自己紹介と理念"
          title="Bridging Narrative & Structure"
          highlightWord="Structure"
          description="Crafting digital environments that marry the emotional warmth of anime cinematography with the rigorous discipline of modern web engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Anime Visual Workspace Card */}
          <div ref={cardRef} className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/30 shadow-2xl shadow-black/50 group">
              {/* Image Container */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <Image
                  src="/images/project-autumn-workspace.jpg"
                  alt="Anime aesthetic developer desk bathed in autumn golden sunlight"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-transparent to-transparent opacity-90" />

                {/* Corner Golden Crest */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#201C19]/80 backdrop-blur-md border border-[#F0A352]/30 text-xs font-mono text-[#F0A352] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>The Studio Space</span>
                </div>
              </div>

              {/* Floating Quote Block */}
              <div className="p-6 bg-[#201C19]/95 border-t border-[#C96F3B]/20">
                <blockquote className="font-serif italic text-sm sm:text-base text-[#F5EFE5]/90 mb-3 leading-relaxed">
                  &ldquo;{portfolioData.personal.philosophy}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between pt-3 border-t border-[#C96F3B]/15">
                  <span className="text-xs font-mono text-[#F0A352]">
                    — {portfolioData.personal.name}
                  </span>
                  <span className="text-xs font-serif text-[#F5EFE5]/50">
                    {portfolioData.personal.kanjiName}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle background frame shadow */}
            <div className="absolute -inset-2 rounded-2xl border border-[#F0A352]/10 -z-10 translate-x-3 translate-y-3 pointer-events-none" />
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col gap-8">
            {/* Bio Paragraphs */}
            <div className="space-y-4">
              {portfolioData.personal.bio.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg text-[#F5EFE5]/80 font-sans font-light leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Current Learning Goals */}
            <div className="p-6 sm:p-7 rounded-2xl glass-panel-warm border border-[#C96F3B]/25">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#F0A352] uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Current Learning Expeditions</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portfolioData.personal.currentLearning.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-[#F5EFE5]/85 font-sans"
                  >
                    <span className="text-[#C96F3B] mt-1 text-xs">◈</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Development Interests */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#F5EFE5]/60 uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 text-[#C96F3B]" />
                <span>Areas of Creative Focus</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {portfolioData.personal.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#F5EFE5]/90 bg-[#392820]/70 border border-[#C96F3B]/30 hover:border-[#F0A352]/50 hover:bg-[#392820] transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
