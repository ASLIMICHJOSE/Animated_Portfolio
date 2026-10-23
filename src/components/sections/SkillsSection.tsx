"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Layers,
  Code,
  Terminal,
  Database,
  GitBranch,
  Cpu,
  Check,
  ChevronRight,
  Sparkles,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { portfolioData, SkillCategory } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

function getCategoryIcon(index: number) {
  switch (index) {
    case 0:
      return <Layers className="w-5 h-5 text-[#F0A352]" />;
    case 1:
      return <Code className="w-5 h-5 text-[#C96F3B]" />;
    case 2:
      return <Terminal className="w-5 h-5 text-[#777957]" />;
    case 3:
      return <Database className="w-5 h-5 text-[#9E472D]" />;
    case 4:
      return <GitBranch className="w-5 h-5 text-[#F0A352]" />;
    default:
      return <Cpu className="w-5 h-5 text-[#F0A352]" />;
  }
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackWrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);

  const categories = portfolioData.skillCategories;

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    if (!isDesktop) {
      // Mobile & tablet use smooth native touch-snap scroll without screen pinning
      return;
    }

    const section = sectionRef.current;
    const trackWrapper = trackWrapperRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Total travel distance across all cards
      const getTotalTravel = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 100);
      };

      // Calibrate pinned scroll distance so horizontal scroll matches natural vertical velocity
      const getScrollDistance = () => {
        const travel = getTotalTravel();
        return Math.max(Math.round(window.innerHeight * 2.5), Math.round(travel * 1.1));
      };

      // 1. "Before it set": Vertical scroll takes ~2 scrolls while cards slide in from the right
      if (trackWrapper) {
        gsap.fromTo(
          trackWrapper,
          { x: () => Math.round(window.innerWidth * 0.35) },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              end: "top top",
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. "Once set": Section pins at top top with silky smooth horizontal motion matching vertical scroll
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getTotalTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1.0, // Silky, momentum-matched Lenis scrub
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        }
      );

      // 3. Subtle parallax on card inner contents
      const parallaxInners = track.querySelectorAll(".card-parallax-inner");
      if (parallaxInners.length > 0) {
        gsap.fromTo(
          parallaxInners,
          { x: 25 },
          {
            x: -25,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getScrollDistance()}`,
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 4. Parallax background drift
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          x: "-6%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [categories.length]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#201C19]"
    >
      {/* Lenis.dev Top Linear Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2.5px] bg-[#201C19]/40">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[#C96F3B] via-[#F0A352] to-[#FFE8B8] origin-left shadow-sm shadow-[#F0A352] will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Showcase Stage (Responsive touch-snap on mobile, pinned horizontal runway on desktop) */}
      <div className="relative w-full min-h-screen py-24 lg:py-0 lg:h-screen overflow-hidden flex flex-col justify-center">
        {/* Dynamic Layer 0: Full-Bleed Anime Observatory Pavilion Background */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-[115%] h-full -left-[5%] pointer-events-none will-change-transform"
        >
          <Image
            src="/images/skills-autumn-pavilion.jpg"
            alt="Modern architectural observatory terrace overlooking fiery autumn foliage"
            fill
            sizes="120vw"
            priority={false}
            className="object-cover object-center brightness-[0.58] contrast-[1.12]"
          />
        </div>

        {/* Dynamic Layer 1: Atmospheric Sunset Lighting & Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/65 to-[#201C19] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(240,163,82,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C96F3B]/15 blur-[140px] pointer-events-none" />

        {/* Mobile Header (Shown on mobile screens for immediate clarity) */}
        <div className="lg:hidden relative z-20 px-4 sm:px-6 mb-6 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201C19]/90 border border-[#F0A352]/40 text-[10px] font-mono text-[#F0A352] mb-3 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#F0A352]" />
            <span className="font-bold tracking-widest uppercase">ACT 02 // CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#F5EFE5] tracking-tight leading-tight uppercase flex items-center justify-center gap-2.5">
            <span>SKILLS</span>
            <ArrowRight className="w-6 h-6 text-[#F0A352]" />
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#F5EFE5]/75 mt-2 leading-relaxed">
            Swipe sideways to explore all 5 engineering domains.
          </p>
        </div>

        {/* Center: Responsive Runway (Touch Snap on Mobile, Pinned Track on Desktop) */}
        <div className="relative z-10 w-full overflow-x-auto lg:overflow-visible no-scrollbar">
          <div ref={trackWrapperRef} className="w-full lg:w-max will-change-transform">
            <div
              ref={trackRef}
              className="flex flex-row items-stretch lg:items-center gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-8 w-full lg:w-max snap-x snap-mandatory lg:snap-none overflow-x-auto lg:overflow-visible no-scrollbar pb-6 lg:pb-0 will-change-transform"
            >
              {/* 1. BIG 'SKILLS' TITLE (Desktop Lead Banner) */}
              <div className="hidden lg:flex flex-col justify-center h-[56vh] sm:h-[62vh] min-h-[440px] max-h-[580px] shrink-0 select-none pr-4 sm:pr-8 md:pr-12 first:ml-[4vw] sm:first:ml-[6vw] lg:first:ml-[7vw]">
                <div className="card-parallax-inner flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201C19]/80 border border-[#F0A352]/40 text-[11px] font-mono text-[#F0A352] mb-4 w-fit shadow-sm backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#F0A352]" />
                    <span className="font-bold tracking-widest uppercase">SECTION 02 // CAPABILITIES</span>
                  </div>

                  {/* Title size matching ASLI MICH JOSE: text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold */}
                  <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-[#F5EFE5] tracking-tight leading-[1.05] drop-shadow-2xl flex items-center gap-3 sm:gap-5 md:gap-6 whitespace-nowrap">
                    <span>SKILLS</span>
                    <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#F0A352] shrink-0 stroke-[2.5] animate-pulse" />
                  </h2>

                  <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#FFE8B8] mt-3 font-normal">
                    Instruments of Creation
                  </p>

                  <p className="text-xs sm:text-sm font-sans text-[#F5EFE5]/75 font-light max-w-[320px] sm:max-w-sm md:max-w-md mt-4 leading-relaxed">
                    A curated technical stack centered on expressive user interfaces, strict typing, and maintainable architectures.
                  </p>

                  <div className="flex items-center gap-3 mt-6 text-xs font-mono text-[#F0A352]">
                    <span className="w-8 h-px bg-[#F0A352]/50" />
                    <span className="tracking-widest uppercase text-[11px] font-bold text-[#FFE8B8]">5 Core Domains</span>
                    <span className="text-[#F5EFE5]/40">•</span>
                    <span className="tracking-wider text-[11px] text-[#F0A352]/90 flex items-center gap-1.5">
                      <span>Explore domain cards</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F0A352]" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. DOMAIN SKILL CARDS (01 to 05, starting with Frontend Development) */}
              {categories.map((category: SkillCategory, idx: number) => {
                const isPrimary = idx === 0;
                return (
                  <div
                    key={category.title}
                    className="flex flex-col w-[86vw] sm:w-[420px] md:w-[460px] lg:w-[520px] snap-center shrink-0 select-none group"
                  >
                    <div className="relative h-[500px] sm:h-[540px] lg:h-[62vh] min-h-[460px] max-h-[580px] rounded-3xl overflow-hidden glass-panel border border-[#C96F3B]/35 group-hover:border-[#F0A352] transition-all duration-500 shadow-2xl shadow-black/70 bg-[#1A1614]/95 flex flex-col">
                      <div className="card-parallax-inner p-6 sm:p-9 flex flex-col justify-between h-full relative z-10">
                        {/* Top Row: Icon, Index & Domain Tag */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="p-3 rounded-2xl bg-[#2D1E16] border border-[#C96F3B]/40 text-[#F0A352] shadow-md group-hover:scale-105 transition-transform duration-300">
                                {getCategoryIcon(idx)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-mono text-[#F0A352] tracking-wider uppercase font-semibold">
                                  {category.subtitle}
                                </span>
                                <span className="text-xs font-mono text-[#F5EFE5]/50">
                                  {isPrimary ? "PRIMARY DOMAIN // 01" : `DOMAIN // 0${idx + 1}`}
                                </span>
                              </div>
                            </div>

                            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#201C19]/80 border border-[#C96F3B]/30 text-[#F0A352] font-semibold">
                              ● ACTIVE PRODUCTION
                            </span>
                          </div>

                          <div className="w-full h-px bg-gradient-to-r from-[#C96F3B]/30 via-[#F0A352]/20 to-transparent mb-5" />
                        </div>

                        {/* Middle: Full-Featured Skill Modules */}
                        <div className="space-y-3 my-auto overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
                          {category.skills.map((skill) => (
                            <div
                              key={skill.name}
                              className="group/pill p-3.5 rounded-2xl bg-[#201C19]/85 border border-[#C96F3B]/20 hover:border-[#F0A352] hover:bg-[#2D1E16] transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-5 h-5 rounded-lg bg-[#392820]/90 border border-[#C96F3B]/30 flex items-center justify-center text-[#F0A352]">
                                    <Check className="w-3 h-3 text-[#F0A352]" />
                                  </div>
                                  <span className="text-sm font-mono text-[#F5EFE5] font-semibold group-hover/pill:text-[#FFE8B8]">
                                    {skill.name}
                                  </span>
                                </div>

                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#2D1E16] text-[#F0A352]/80 border border-[#C96F3B]/20">
                                  Engineered
                                </span>
                              </div>

                              {skill.description && (
                                <p className="text-xs text-[#F5EFE5]/70 mt-1.5 font-sans font-light leading-relaxed pl-7">
                                  {skill.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Bottom Metric */}
                        <div className="pt-4 border-t border-[#C96F3B]/25 flex items-center justify-between text-xs font-mono text-[#F5EFE5]/60 mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#F0A352] animate-pulse" />
                            <span className="text-[#F0A352] font-medium">Standard Compliance</span>
                          </div>
                          <span className="text-[#FFE8B8] font-bold">
                            {category.skills.length} Core Modules
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-[#F0A352] text-[#201C19] flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 shadow-xl shadow-[#F0A352]/40 pointer-events-none">
                        <ArrowUpRight className="w-5 h-5 text-[#201C19]" />
                      </div>
                    </div>

                    <div className="py-4 flex flex-col items-start">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors duration-300">
                        {category.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F5EFE5]/50 mt-1.5">
                        <span>{category.subtitle}</span>
                        <span>•</span>
                        <span className="text-[#F0A352]/85 font-medium">
                          {category.skills.map((s) => s.name).join(" · ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 4. OUTRO TRANSITION CARD (Leads directly to Projects) */}
              <div className="flex flex-col w-[85vw] sm:w-[420px] lg:w-[450px] shrink-0 select-none group">
                <div className="relative h-[56vh] sm:h-[62vh] min-h-[440px] max-h-[580px] rounded-3xl overflow-hidden glass-panel-warm border border-[#F0A352]/50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/70 bg-gradient-to-br from-[#2D1E16] to-[#1A1614]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201C19]/90 border border-[#F0A352]/50 text-[10px] font-mono text-[#F0A352] mb-4 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#F0A352]" />
                      <span>TRANSITION // ACT 03</span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5EFE5] mb-3 leading-snug">
                      Systems into{" "}
                      <span className="text-[#F0A352] italic font-normal">
                        Experience
                      </span>
                    </h4>

                    <p className="text-xs sm:text-sm font-sans text-[#F5EFE5]/80 font-light leading-relaxed mb-6">
                      Skills are only validated through shipping. Witness these instruments deployed across live, production-grade digital case studies.
                    </p>

                    <div className="p-4 rounded-2xl bg-[#201C19]/80 border border-[#C96F3B]/30 mb-6">
                      <span className="text-[10px] font-mono text-[#F0A352] font-semibold block mb-1">
                        FLAGSHIP SHOWCASE:
                      </span>
                      <span className="text-sm font-serif font-bold text-[#F5EFE5] block">
                        Creative Web Experiences & Labs
                      </span>
                    </div>
                  </div>

                  <a
                    href="#projects"
                    className="inline-flex items-center justify-between w-full py-3.5 px-5 rounded-2xl bg-[#F0A352] text-[#201C19] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#F0A352]/20"
                  >
                    <span>Explore Project Exhibits</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="py-4 flex flex-col items-start">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors">
                    Act 03 // Showcase
                  </h3>
                  <span className="text-xs font-mono text-[#F5EFE5]/50 mt-1.5">
                    Creative Web Experiences & Labs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
