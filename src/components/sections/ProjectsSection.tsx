"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { portfolioData, Project } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";
import { Sparkles, Info } from "lucide-react";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Creative Web Experience", "Interactive Data Lab", "Editorial Platform"];

  const filteredProjects =
    selectedCategory === "All"
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#201C19] border-t border-[#C96F3B]/15 overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#C96F3B]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          number="ACT 03 / PORTFOLIO"
          kanjiSubtitle="制作実績と実験"
          title="Curated Works & Prototypes"
          highlightWord="Works"
          description="A selection of interactive sample projects demonstrating fluid motion choreography, modular Next.js architecture, and cinematic autumn aesthetics."
        />

        {/* Centralized Data Notice Banner */}
        <div className="mb-10 p-4 rounded-xl glass-panel-warm border border-[#C96F3B]/30 flex items-start gap-3 text-xs sm:text-sm text-[#F5EFE5]/80 max-w-2xl mx-auto">
          <Info className="w-4 h-4 text-[#F0A352] mt-0.5 shrink-0" />
          <p>
            <span className="text-[#F0A352] font-semibold">Note for Customization:</span> All
            project titles, links, images, and tech tags are editable directly in{" "}
            <code className="text-[#F0A352] bg-[#201C19] px-1.5 py-0.5 rounded font-mono">
              src/data/portfolio.ts
            </code>
            .
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C96F3B] ${
                selectedCategory === cat
                  ? "bg-[#C96F3B] text-[#F5EFE5] font-semibold shadow-md shadow-[#C96F3B]/30"
                  : "bg-[#392820]/60 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#392820] border border-[#C96F3B]/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project: Project, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
