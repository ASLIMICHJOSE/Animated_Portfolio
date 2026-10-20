"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Code,
  Layers,
  Database,
  Terminal,
  GitBranch,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData, SkillCategory } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Parallax scroll on anime pavilion background
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

      // 2. Individual Flow Discovery for Skill Cards
      const cards = cardsRef.current?.querySelectorAll(".skill-discovery-card");
      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 55, scale: 0.94, rotateX: 6 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Layers className="w-5 h-5 text-[#F0A352]" />;
      case 1:
        return <Code className="w-5 h-5 text-[#C96F3B]" />;
      case 2:
        return <Terminal className="w-5 h-5 text-[#777957]" />;
      case 3:
        return <Database className="w-5 h-5 text-[#9E472D]" />;
      default:
        return <GitBranch className="w-5 h-5 text-[#F0A352]" />;
    }
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex items-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Observatory Pavilion Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/skills-autumn-pavilion.jpg"
          alt="Modern architectural observatory terrace overlooking fiery autumn foliage"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.72] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Sunset Lighting & Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/65 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(240,163,82,0.2)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C96F3B]/15 blur-[140px] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Skills Architecture */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <SectionHeading
          number="ACT 02 / TOOLKIT"
          categoryLabel="Core Capabilities"
          title="Instruments of Creation"
          highlightWord="Creation"
          description="A balanced stack centered on expressive user interfaces, strict typing, and maintainable architectures. Designed without false percentage meters."
        />

        {/* Editorial Categories Grid with Individual Flow Discovery */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {portfolioData.skillCategories.map((category: SkillCategory, index: number) => (
            <div
              key={category.title}
              className={`skill-discovery-card rounded-2xl p-6 sm:p-8 glass-panel border border-[#C96F3B]/30 hover:border-[#F0A352] transition-all duration-500 hover:shadow-2xl hover:shadow-[#C96F3B]/25 group flex flex-col justify-between backdrop-blur-xl relative overflow-hidden ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Top Flow Discovery Border Flare */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#392820]/90 border border-[#C96F3B]/40 group-hover:border-[#F0A352] group-hover:scale-105 transition-all duration-300">
                    {getCategoryIcon(index)}
                  </div>
                  <span className="text-xs font-mono text-[#F0A352] tracking-wider uppercase">
                    {category.subtitle}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#F5EFE5] mb-4 group-hover:text-[#F0A352] transition-colors">
                  {category.title}
                </h3>

                {/* Skill Items */}
                <ul className="space-y-3 mb-6">
                  {category.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="p-3 rounded-xl bg-[#201C19]/80 border border-[#C96F3B]/15 hover:border-[#F0A352]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-[#F5EFE5] font-medium">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#F0A352] tracking-wider uppercase">
                          Active
                        </span>
                      </div>
                      {skill.description && (
                        <p className="text-xs text-[#F5EFE5]/65 mt-1 font-sans font-light leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#C96F3B]/20 flex items-center justify-between text-xs font-mono text-[#F5EFE5]/50">
                <span>Domain 0{index + 1}</span>
                <span className="text-[#F0A352]/75">{category.skills.length} Technologies</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
