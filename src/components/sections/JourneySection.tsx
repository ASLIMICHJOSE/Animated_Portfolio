"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import SceneFlowPrompt from "@/components/ui/SceneFlowPrompt";
import { portfolioData, JourneyMilestone } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Parallax scroll on anime railway background
      if (bgImageRef.current && sectionRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 20,
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

      // Staggered Timeline Cards Entrance
      const milestones = timelineRef.current?.querySelectorAll(".milestone-card");
      if (milestones && milestones.length > 0) {
        gsap.fromTo(
          milestones,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex items-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Railway Scene Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/journey-autumn-train.jpg"
          alt="Anime autumn railway tracks stretching into misty hills"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.74] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Sunset Lighting & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/65 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(240,163,82,0.18)_0%,transparent_65%)] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Journey Timeline */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <SectionHeading
          number="ACT 04 / CHRONICLE"
          kanjiSubtitle="成長の軌跡"
          title="The Developer Odyssey"
          highlightWord="Odyssey"
          description="A visual narrative mapping the progression from foundational curiosity to modern fullstack architecture and cinematic motion."
        />

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative mt-16 sm:mt-20">
          {/* Central Glowing Autumn Railway Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#F0A352] via-[#C96F3B] to-[#392820] shadow-lg shadow-[#F0A352]/20" />

          <div className="space-y-12 sm:space-y-16">
            {portfolioData.journey.map((item: JourneyMilestone, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.period}
                  className={`milestone-card relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-[calc(50%-2.5rem)]">
                    <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-[#C96F3B]/35 hover:border-[#F0A352] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C96F3B]/20 group backdrop-blur-xl">
                      {/* Chapter Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-medium text-[#F0A352] bg-[#392820] border border-[#C96F3B]/30">
                          {item.period}
                        </span>
                        <span className="text-xs font-mono text-[#F5EFE5]/50">
                          Milestone 0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors mb-1">
                        {item.title}
                      </h3>

                      <h4 className="text-xs sm:text-sm font-sans font-medium text-[#C96F3B] mb-4">
                        {item.subtitle}
                      </h4>

                      <p className="text-sm sm:text-base text-[#F5EFE5]/80 font-sans font-light leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#C96F3B]/20">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono px-2.5 py-1 rounded bg-[#201C19]/80 text-[#F5EFE5]/85 border border-[#C96F3B]/25"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center Node / Lantern Point */}
                  <div className="hidden md:flex relative z-10 w-12 h-12 rounded-full bg-[#201C19] border-2 border-[#F0A352] items-center justify-center shadow-lg shadow-[#F0A352]/40 group">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#F0A352] to-[#C96F3B] animate-pulse" />
                  </div>

                  {/* Spacer for symmetry on desktop */}
                  <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* First-Person POV Flow Trigger to Chapter 05 */}
        <SceneFlowPrompt
          targetId="contact"
          chapterNumber="CHAPTER 05"
          destinationName="Twilight Lanterns"
          japaneseDestination="灯篭へ"
        />
      </div>
    </section>
  );
}
