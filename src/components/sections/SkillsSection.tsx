"use client";

import React, { useEffect, useRef } from "react";
import {
  Code,
  Layers,
  Database,
  Terminal,
  Cpu,
  Sparkles,
  GitBranch,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData, SkillCategory } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Icon mapping for each category
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
      className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#201C19]/95 border-t border-[#C96F3B]/15 overflow-hidden"
    >
      {/* Background ambient gradient */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-[#C96F3B]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          number="ACT 02 / TOOLKIT"
          kanjiSubtitle="技術と知識体系"
          title="Instruments of Creation"
          highlightWord="Creation"
          description="A balanced stack centered on expressive user interfaces, strict typing, and maintainable architectures. Designed without false percentage meters."
        />

        {/* Editorial Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {portfolioData.skillCategories.map((category: SkillCategory, index: number) => (
            <div
              key={category.title}
              className={`rounded-2xl p-6 sm:p-7 glass-panel border border-[#C96F3B]/25 hover:border-[#F0A352]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#C96F3B]/15 group flex flex-col justify-between ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-[#392820]/80 border border-[#C96F3B]/30 group-hover:border-[#F0A352]/50 transition-colors">
                    {getCategoryIcon(index)}
                  </div>
                  <span className="text-xs font-serif text-[#F0A352]/75">
                    {category.japaneseSubtitle}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5EFE5] mb-4 group-hover:text-[#F0A352] transition-colors">
                  {category.title}
                </h3>

                {/* Skill Items with Context Descriptions */}
                <ul className="space-y-3.5 mb-6">
                  {category.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-[#201C19]/60 border border-[#C96F3B]/10 hover:border-[#C96F3B]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs sm:text-sm text-[#F5EFE5] font-medium">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#F0A352]/80 uppercase">
                          Active
                        </span>
                      </div>
                      {skill.description && (
                        <p className="text-xs text-[#F5EFE5]/60 mt-1 font-sans font-light leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#C96F3B]/15 flex items-center justify-between text-[11px] font-mono text-[#F5EFE5]/40">
                <span>0{index + 1} // FOCUS</span>
                <span className="group-hover:text-[#F0A352] transition-colors">Editable Data</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
