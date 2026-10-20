"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { portfolioData, Project } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";
import { Info } from "lucide-react";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
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
      // Parallax scroll on anime waterfront background
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

      // Staggered Cards Entrance
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 55, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 78%",
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
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex items-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Autumn Waterfront Skyline Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/projects-autumn-waterfront.jpg"
          alt="Cinematic anime sunset riverfront with bridges and sparkling autumn reflections"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.72] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Sunset Lighting & Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/65 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(240,163,82,0.18)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#C96F3B]/15 blur-[140px] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Projects Showcase */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <SectionHeading
          number="ACT 03 / PORTFOLIO"
          kanjiSubtitle="制作実績と実験"
          title="Curated Works & Prototypes"
          highlightWord="Works"
          description="A selection of interactive sample projects demonstrating fluid motion choreography, modular Next.js architecture, and cinematic autumn aesthetics."
        />

        {/* Centralized Data Notice Banner */}
        <div className="mb-10 p-4 rounded-xl glass-panel-warm border border-[#C96F3B]/35 flex items-start gap-3 text-xs sm:text-sm text-[#F5EFE5]/85 max-w-2xl mx-auto shadow-xl">
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
              className={`px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C96F3B] ${
                selectedCategory === cat
                  ? "bg-[#C96F3B] text-[#F5EFE5] font-semibold shadow-lg shadow-[#C96F3B]/30 scale-105"
                  : "bg-[#392820]/80 text-[#F5EFE5]/75 hover:text-[#F0A352] hover:bg-[#392820] border border-[#C96F3B]/30 backdrop-blur-md"
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
