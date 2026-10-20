"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData, JourneyMilestone } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const streamLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Parallax scroll on anime railway background
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

      // 2. Central Active Flow Stream Conduit
      if (streamLineRef.current && timelineRef.current) {
        gsap.fromTo(
          streamLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: "bottom 85%",
              scrub: 1,
            },
          }
        );
      }

      // 3. Fluid Milestone Discovery as the Flow Reaches Each Station
      const milestones = timelineRef.current?.querySelectorAll(".milestone-card");
      if (milestones && milestones.length > 0) {
        milestones.forEach((card, index) => {
          const isEven = index % 2 === 0;
          const contentBox = card.querySelector(".milestone-content");
          const centerNode = card.querySelector(".milestone-node");

          // Animate card content glide
          if (contentBox) {
            gsap.fromTo(
              contentBox,
              {
                opacity: 0,
                x: isEven ? 50 : -50,
                scale: 0.94,
              },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Animate node flare
          if (centerNode) {
            gsap.fromTo(
              centerNode,
              { scale: 0.5, opacity: 0.3 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.7,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });
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
          alt="Autumn railway tracks stretching into misty hills"
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
          categoryLabel="Milestone Timeline"
          title="The Developer Odyssey"
          highlightWord="Odyssey"
          description="A visual narrative mapping the progression from foundational curiosity to modern fullstack architecture and cinematic motion."
        />

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative mt-16 sm:mt-20">
          {/* Central Glowing Autumn Railway Conduit Track */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-[3px] bg-[#392820] rounded-full overflow-hidden">
            <div
              ref={streamLineRef}
              className="w-full h-full bg-gradient-to-b from-[#F0A352] via-[#C96F3B] to-[#F5EFE5] shadow-lg shadow-[#F0A352]/50 stream-glow"
            />
          </div>

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
                  {/* Content Card with Discovery Animation */}
                  <div className="milestone-content w-full md:w-[calc(50%-2.5rem)] will-change-transform">
                    <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-[#C96F3B]/35 hover:border-[#F0A352] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C96F3B]/25 group backdrop-blur-xl relative overflow-hidden">
                      {/* Top Discovery Flow Streak */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                      {/* Chapter Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-medium text-[#F0A352] bg-[#392820] border border-[#C96F3B]/30 flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F0A352] animate-pulse" />
                          <span>{item.period}</span>
                        </span>
                        <span className="text-xs font-mono text-[#F5EFE5]/50">
                          FLOW DISCOVERY 0{index + 1}
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

                  {/* Center Node / Lantern Point with Discovery Light Flare */}
                  <div className="milestone-node hidden md:flex relative z-10 w-12 h-12 rounded-full bg-[#201C19] border-2 border-[#F0A352] items-center justify-center shadow-lg shadow-[#F0A352]/50 group">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#F0A352] to-[#C96F3B] animate-pulse" />
                    <span className="absolute -inset-1 rounded-full border border-[#F0A352]/30 animate-ping opacity-40 pointer-events-none" />
                  </div>

                  {/* Spacer for symmetry on desktop */}
                  <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
