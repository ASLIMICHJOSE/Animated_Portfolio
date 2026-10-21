"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import ProjectCard from "@/components/ui/ProjectCard";
import { portfolioData, Project } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";
import {
  ArrowUpRight,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Activity,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const cardsStageRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Detail panel refs for 3D card-origin unfold animation
  const dossierRef = useRef<HTMLElement | null>(null);
  const laserSeamRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const projects = portfolioData.projects;
  const total = projects.length;

  // 1. Scroll-Trigger Stacking Timeline
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      return;
    }

    const { gsap, ScrollTrigger } = initGSAP();
    const section = sectionRef.current;
    const cardsStage = cardsStageRef.current;
    if (!section || !cardsStage) return;

    const ctx = gsap.context(() => {
      // Parallax background drift
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const cards = cardsStage.querySelectorAll<HTMLElement>(".stacked-project-card");
      if (!cards || cards.length === 0) return;

      // TAB_OFFSET ensures when cards stack, every card's top tab (42px) remains visible & touchable!
      const TAB_OFFSET = 42;

      // Initial State: Card 0 sits at y: 0. Cards 1..N start below viewport
      cards.forEach((card, i) => {
        gsap.set(card, {
          transformOrigin: "top center",
        });
        if (i === 0) {
          gsap.set(card, {
            yPercent: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          });
        } else {
          gsap.set(card, {
            yPercent: 120,
            y: i * TAB_OFFSET,
            scale: 1,
            opacity: 1,
          });
        }
      });

      // Pin distance calibrated for smooth 5-card progression
      const pinDistance = Math.round(window.innerHeight * (total * 0.95));

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "projects-scroll-pin",
          trigger: section,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          scrub: 0.7, // Silky Lenis momentum scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const currentStep = Math.min(
              total - 1,
              Math.floor(self.progress * total)
            );
            setActiveIndex(currentStep);
          },
        },
      });

      // Stacking sequence: Each card glides up to its designated y: i * TAB_OFFSET
      // All prior cards j < i remain visible with their top tab exposed at j * TAB_OFFSET!
      for (let i = 1; i < total; i++) {
        const card = cards[i];
        const stepTime = (i - 1) * 1.5;

        // Card i slides up smoothly into position at y: i * TAB_OFFSET
        tl.to(
          card,
          {
            yPercent: 0,
            y: i * TAB_OFFSET,
            scale: 1,
            ease: "power2.inOut",
            duration: 1.0,
          },
          stepTime
        );

        // Preceding cards scale subtly from top center & dim, preserving top tabs
        for (let j = 0; j < i; j++) {
          const priorCard = cards[j];
          const priorOverlay = priorCard.querySelector(".card-dim-overlay");
          const depth = i - j;

          const backScale = Math.max(0.92, 1 - depth * 0.02);
          const targetDim = Math.min(0.65, depth * 0.22);

          tl.to(
            priorCard,
            {
              scale: backScale,
              ease: "power2.inOut",
              duration: 1.0,
            },
            stepTime
          );

          if (priorOverlay) {
            tl.to(
              priorOverlay,
              {
                opacity: targetDim,
                ease: "power2.inOut",
                duration: 1.0,
              },
              stepTime
            );
          }
        }

        // Brief reading hold between stacks
        if (i < total - 1) {
          tl.to({}, { duration: 0.35 });
        }
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [total]);

  // 2. Dynamic 3D Card-Origin Unfolding Animation for Project Details
  useEffect(() => {
    if (!selectedProject || !dossierRef.current) return;

    const { gsap } = initGSAP();
    const dossier = dossierRef.current;
    const laserSeam = laserSeamRef.current;

    // Laser Seam Energy Pulse
    if (laserSeam) {
      gsap.fromTo(
        laserSeam,
        { scaleY: 0, opacity: 1 },
        { scaleY: 1, opacity: 0.85, duration: 0.35, ease: "power2.out" }
      );
    }

    // Physical 3D Unfold from Card Origin (Transform origin at left center)
    gsap.fromTo(
      dossier,
      {
        transformOrigin: "left center",
        scaleX: 0,
        rotateY: -55,
        skewY: 2,
        x: -40,
        opacity: 0.2,
        filter: "brightness(1.8) contrast(1.2)",
      },
      {
        scaleX: 1,
        rotateY: 0,
        skewY: 0,
        x: 0,
        opacity: 1,
        filter: "brightness(1) contrast(1)",
        duration: 0.65,
        ease: "back.out(1.15)", // Punchy mechanical latch
      }
    );

    // Stagger inner architectural specs from left
    const items = dossier.querySelectorAll<HTMLElement>(".dossier-spec-item");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    }
  }, [selectedProject?.id]);

  // 3. Close Handler with reverse mechanical 3D fold-in
  const handleCloseDossier = useCallback(() => {
    if (!dossierRef.current) {
      setSelectedProject(null);
      return;
    }
    const { gsap } = initGSAP();
    gsap.to(dossierRef.current, {
      transformOrigin: "left center",
      scaleX: 0,
      rotateY: -45,
      skewY: -2,
      x: -30,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setSelectedProject(null);
      },
    });
  }, []);

  // Keyboard navigation & ESC listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseDossier();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseDossier]);

  // Next / Previous Project cycling within Dossier
  const currentProjectIdx = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handlePrevProject = () => {
    if (currentProjectIdx === -1) return;
    const prevIdx = (currentProjectIdx - 1 + total) % total;
    setSelectedProject(projects[prevIdx]);
  };

  const handleNextProject = () => {
    if (currentProjectIdx === -1) return;
    const nextIdx = (currentProjectIdx + 1) % total;
    setSelectedProject(projects[nextIdx]);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#201C19] flex flex-col justify-between pt-16 sm:pt-20 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 select-none"
    >
      {/* Background Anime Autumn Waterfront Skyline */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/projects-autumn-waterfront.jpg"
          alt="Sunset riverfront reflections"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.55] contrast-[1.1]"
        />
      </div>

      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/70 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(240,163,82,0.14)_0%,transparent_65%)] pointer-events-none" />

      {/* 1. MINIMAL EDITORIAL HEADER (Reduced, bold, Lenis.dev inspired) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-end justify-between border-b border-[#C96F3B]/25 pb-3">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#F0A352] uppercase font-semibold block mb-0.5">
            Act 03 // Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#F5EFE5] leading-none uppercase">
            PROJECTS<span className="text-[#F0A352]">.</span>
          </h2>
        </div>

        {/* Dynamic Project Tab Indicators: Shows all 5 projects & highlights active */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px]">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                aria-label={`Inspect ${p.title}`}
                className={`px-2 py-0.5 rounded-full transition-all border ${
                  selectedProject?.id === p.id
                    ? "bg-[#F0A352] text-[#181310] font-bold border-[#F0A352]"
                    : activeIndex === idx
                    ? "bg-[#F0A352]/20 text-[#F0A352] border-[#F0A352]/50"
                    : "bg-[#181310]/60 text-[#F5EFE5]/50 border-white/10 hover:text-[#F5EFE5] hover:border-[#F0A352]/40"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          {/* Minimal Progress & Index Tracker */}
          <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs text-[#F5EFE5]/70">
            <span className="text-[#FFE8B8] font-bold">
              0{activeIndex + 1} <span className="text-[#F5EFE5]/30">/</span> 0{total}
            </span>
            <div className="w-16 sm:w-24 h-[2px] bg-[#2D1E16] rounded-full overflow-hidden border border-[#C96F3B]/25">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#C96F3B] to-[#F0A352] w-full origin-left will-change-transform"
                style={{ transform: "scaleX(0.2)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTER STAGE: Lenis.dev Signature Overlapping Stacked Cards + Right-side Unfold Dossier */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex items-center justify-center my-auto overflow-visible">
        {reducedMotion ? (
          // Accessible fallback for prefers-reduced-motion
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full py-6">
            {projects.map((project: Project, index: number) => (
              <div key={project.id} className="h-[460px]">
                <ProjectCard
                  project={project}
                  index={index}
                  totalProjects={total}
                  isSelected={selectedProject?.id === project.id}
                  onSelectProject={setSelectedProject}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center gap-4 lg:gap-6">
            {/* The Stacked Card Deck: Slides slightly left on desktop when details are opened */}
            <div
              className={`relative h-[66vh] sm:h-[70vh] md:h-[72vh] max-h-[660px] min-h-[460px] transition-all duration-500 ease-out ${
                selectedProject
                  ? "w-full lg:w-[46%] xl:w-[44%] shrink-0"
                  : "w-full max-w-4xl"
              }`}
            >
              <div
                ref={cardsStageRef}
                className="relative w-full h-full flex items-start justify-center"
                style={{ perspective: "1600px" }}
              >
                {projects.map((project: Project, index: number) => (
                  <div
                    key={project.id}
                    className="stacked-project-card absolute top-0 left-0 right-0 h-[calc(100%-170px)] min-h-[380px] max-h-[490px] flex items-center justify-center will-change-transform"
                    style={{ zIndex: (index + 1) * 10 }}
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      totalProjects={total}
                      isSelected={selectedProject?.id === project.id}
                      onSelectProject={(p) => setSelectedProject(p)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. RIGHT SIDE: PHYSICAL 3D UNFOLDING PROJECT DOSSIER */}
            {selectedProject && (
              <div className="fixed lg:relative inset-4 sm:inset-6 lg:inset-auto z-50 lg:z-30 w-auto lg:w-[54%] xl:w-[56%] h-[90vh] lg:h-[72vh] max-h-[660px] min-h-[460px] flex items-center justify-center pointer-events-auto">
                {/* Backdrop on mobile screens */}
                <div
                  onClick={handleCloseDossier}
                  className="lg:hidden absolute inset-0 bg-[#0E0C0A]/85 backdrop-blur-md -m-10"
                />

                {/* Laser Hinge Seam (Vertical Energy Flare connecting card to dossier) */}
                <div
                  ref={laserSeamRef}
                  className="hidden lg:block absolute -left-3 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-[#F0A352] to-transparent origin-top shadow-[0_0_12px_#F0A352] z-40 pointer-events-none"
                />

                {/* Dossier Card Container (3D Unfolding Canvas) */}
                <aside
                  ref={dossierRef}
                  aria-label={`Detailed specifications for ${selectedProject.title}`}
                  className="relative w-full h-full rounded-3xl overflow-hidden glass-panel border border-[#F0A352]/50 bg-[#161210]/95 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between p-5 sm:p-7 z-30"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Glowing Top Amber Edge */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-80" />

                  {/* Header: Identity, Breadcrumb & Close Controls */}
                  <div className="dossier-spec-item flex items-center justify-between border-b border-[#C96F3B]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#F0A352] text-[#181310]">
                        0{currentProjectIdx + 1} // 0{total}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#F0A352] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse inline-block" />
                        Live Dossier
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Previous / Next Switcher */}
                      <div className="flex items-center border border-[#C96F3B]/35 rounded-full overflow-hidden bg-[#201C19]/80 mr-1 sm:mr-2">
                        <button
                          onClick={handlePrevProject}
                          aria-label="Previous exhibit"
                          className="px-2 py-1 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#281F1B] transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] font-mono text-[#F5EFE5]/40 px-1">|</span>
                        <button
                          onClick={handleNextProject}
                          aria-label="Next exhibit"
                          className="px-2 py-1 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#281F1B] transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={handleCloseDossier}
                        aria-label="Close project dossier"
                        className="group/close p-1.5 sm:p-2 rounded-full bg-[#201C19] border border-[#C96F3B]/35 text-[#F5EFE5]/70 hover:text-[#181310] hover:bg-[#F0A352] hover:border-[#F0A352] transition-all shadow-sm"
                      >
                        <X className="w-4 h-4 transition-transform group-hover/close:rotate-90" />
                      </button>
                    </div>
                  </div>

                  {/* Body: High-Impact Visual Preview & Architecture Highlights */}
                  <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-[#C96F3B]/30">
                    {/* Title & Metadata */}
                    <div className="dossier-spec-item">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#FFE8B8]/75 uppercase px-2 py-0.5 rounded bg-[#2D1E16] border border-[#C96F3B]/25">
                          {selectedProject.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#F0A352] px-2 py-0.5 rounded bg-[#F0A352]/10 border border-[#F0A352]/30">
                          {selectedProject.role || "Lead Creative Technologist"}
                        </span>
                        <span className="text-[10px] font-mono text-[#F5EFE5]/50 ml-auto">
                          {selectedProject.year}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F5EFE5] tracking-tight">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F5EFE5]/85 font-sans font-light leading-relaxed mt-1.5">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Performance Impact Metrics (Grid of 3 cybernetic chips) */}
                    {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                      <div className="dossier-spec-item grid grid-cols-3 gap-2">
                        {selectedProject.metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="p-2 sm:p-2.5 rounded-xl bg-[#201C19]/90 border border-[#C96F3B]/30 flex flex-col justify-center text-center group/metric hover:border-[#F0A352] transition-colors"
                          >
                            <span className="text-xs sm:text-base font-mono font-bold text-[#F0A352] tracking-tight">
                              {metric.value}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-[#F5EFE5]/60 uppercase tracking-wider mt-0.5">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Architecture & Engineering Highlights */}
                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                      <div className="dossier-spec-item p-3 sm:p-3.5 rounded-2xl bg-[#201C19]/70 border border-[#C96F3B]/25">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F0A352] flex items-center gap-1.5 mb-2">
                          <Cpu className="w-3 h-3 text-[#F0A352]" />
                          Architecture Highlights
                        </span>
                        <ul className="space-y-1.5">
                          {selectedProject.highlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] sm:text-xs text-[#F5EFE5]/85 flex items-start gap-2 leading-relaxed"
                            >
                              <span className="text-[#F0A352] mt-0.5 text-xs">◆</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="dossier-spec-item">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5EFE5]/50 block mb-1.5">
                        Integrated Technologies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono text-[#F5EFE5] bg-[#281F1B] border border-[#C96F3B]/30 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="dossier-spec-item flex items-center justify-between gap-3 pt-3 border-t border-[#C96F3B]/30">
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5EFE5]/80 hover:text-[#F0A352] px-3.5 py-2 rounded-xl bg-[#201C19] border border-[#C96F3B]/30 hover:border-[#F0A352] transition-colors shadow-sm"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Inspect Repo</span>
                      </a>
                    )}

                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#181310] bg-gradient-to-r from-[#F0A352] to-[#FFE8B8] hover:brightness-110 px-5 py-2 rounded-full transition-all duration-300 shadow-md shadow-[#F0A352]/25 ml-auto"
                      >
                        <span>Launch Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MINIMAL BOTTOM BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#F5EFE5]/40 pt-2 border-t border-[#C96F3B]/15">
        <span className="text-[#F0A352]/75">
          0{total} Architectural Exhibits // Staggered Lenis Cascade
        </span>
        <span className="tracking-wider hidden sm:inline">
          Click any card tab to deploy specs
        </span>
      </div>
    </section>
  );
}
