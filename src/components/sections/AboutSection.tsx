"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, BookOpen, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Background Cinematic Parallax
      if (bgImageRef.current && sectionRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 18,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Card & Content Entrance
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
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
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex items-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Autumn Garden Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/about-autumn-garden.jpg"
          alt="Tranquil traditional Japanese engawa overlooking an autumn maple garden"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.75] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Golden Hour Lighting & Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/60 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(240,163,82,0.18)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#C96F3B]/15 blur-[120px] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Content with Frosted Glass Panels */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <SectionHeading
          number="ACT 01 / ESSENCE"
          kanjiSubtitle="自己紹介と理念"
          title="Bridging Narrative & Structure"
          highlightWord="Structure"
          description="Crafting digital environments that marry the emotional warmth of anime cinematography with the rigorous discipline of modern web engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Anime Visual Workspace Card */}
          <div ref={cardRef} className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/35 shadow-2xl shadow-black/70 group">
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
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#201C19]/85 backdrop-blur-md border border-[#F0A352]/40 text-xs font-mono text-[#F0A352] flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#F0A352]" />
                  <span>The Studio Space</span>
                </div>
              </div>

              {/* Floating Quote Block */}
              <div className="p-6 bg-[#201C19]/95 backdrop-blur-md border-t border-[#C96F3B]/20">
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

            {/* Glowing Accent Rim */}
            <div className="absolute -inset-2 rounded-2xl border border-[#F0A352]/20 -z-10 translate-x-3 translate-y-3 pointer-events-none" />
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col gap-7">
            {/* Bio Paragraphs */}
            <div className="space-y-4 p-6 sm:p-7 rounded-2xl glass-panel border border-[#C96F3B]/25 shadow-xl">
              {portfolioData.personal.bio.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg text-[#F5EFE5]/85 font-sans font-light leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Current Learning Goals */}
            <div className="p-6 sm:p-7 rounded-2xl glass-panel-warm border border-[#C96F3B]/30 shadow-xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#F0A352] uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Current Learning Expeditions</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portfolioData.personal.currentLearning.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-[#F5EFE5]/90 font-sans"
                  >
                    <span className="text-[#C96F3B] mt-1 text-xs">◈</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Development Interests */}
            <div className="p-5 rounded-2xl glass-panel border border-[#C96F3B]/20">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F5EFE5]/70 uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 text-[#C96F3B]" />
                <span>Areas of Creative Focus</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {portfolioData.personal.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#F5EFE5]/90 bg-[#392820]/80 border border-[#C96F3B]/35 hover:border-[#F0A352] hover:bg-[#392820] transition-colors"
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
