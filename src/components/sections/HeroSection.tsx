"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, FolderGit2, Mail, ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { portfolioData } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const foliageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        bgImageRef.current,
        { scale: 1.15, opacity: 0.6 },
        { scale: 1.0, opacity: 1, duration: 2.2 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0 },
          "-=1.4"
        )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          ctaRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          foliageRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 0.85, scale: 1, duration: 1.6 },
          "-=1.2"
        );

      const isMobile = window.innerWidth < 768;

      // Scroll-triggered Layered Parallax (Desktop only for 120fps mobile butter smoothness)
      if (containerRef.current && !isMobile) {
        gsap.to(bgImageRef.current, {
          yPercent: 20,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        });

        gsap.to(foliageRef.current, {
          yPercent: -15,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        });

        gsap.to(contentRef.current, {
          yPercent: 30,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: 1.0,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#201C19]"
    >
      {/* Layer 0: Anime Autumn City Backdrop */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[115%] -top-[7%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/hero-autumn-city.jpg"
          alt="Cinematic anime autumn city boulevard bathed in golden hour sunlight"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.82] contrast-[1.08]"
        />
      </div>

      {/* Layer 1: Golden Hour Atmospheric Warmth & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-[#201C19]/45 to-[#201C19]/25 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,163,82,0.18)_0%,transparent_65%)] pointer-events-none" />

      {/* Layer 2: Foreground Foliage & Bokeh Frame */}
      <div
        ref={foliageRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70 will-change-transform mix-blend-screen"
      >
        <Image
          src="/images/foreground-foliage.jpg"
          alt="Foreground autumn foliage framing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-55"
        />
      </div>

      {/* Layer 3: Editorial Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 text-center pt-24 sm:pt-28 pb-14 sm:pb-16 will-change-transform flex flex-col items-center justify-center w-full"
      >
        {/* Badge */}
        <div ref={subtitleRef} className="mb-4 sm:mb-6 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#201C19]/85 border border-[#C96F3B]/40 backdrop-blur-md shadow-lg shadow-black/30">
            <Sparkles className="w-3.5 h-3.5 text-[#F0A352] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#F0A352] uppercase">
              Creative Engineering & UI/UX
            </span>
            <span className="text-[#F5EFE5]/40 text-xs hidden sm:inline">•</span>
            <span className="text-[11px] sm:text-xs font-mono text-[#F5EFE5]/85 uppercase tracking-wider hidden sm:inline">
              Autumn Journey
            </span>
          </div>
        </div>

        {/* Main Monolithic Identity */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-extrabold text-[#F5EFE5] tracking-tight leading-[1.08] mb-4 sm:mb-6 drop-shadow-2xl px-2"
        >
          <span>{portfolioData.personal.name}</span>
        </h1>

        {/* Cinematic Subtitle & Statement */}
        <p className="text-base sm:text-xl md:text-2xl text-[#F5EFE5]/90 font-serif font-normal max-w-3xl mb-3 sm:mb-4 leading-relaxed px-2">
          {portfolioData.personal.title}
        </p>

        <p className="text-xs sm:text-sm md:text-base text-[#F5EFE5]/75 font-sans font-light max-w-2xl mb-8 sm:mb-10 leading-relaxed px-2">
          {portfolioData.personal.tagline}
        </p>

        {/* Call to Actions (Full-width clean stack on mobile, horizontal row on desktop) */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Button
            href="#projects"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-h-[48px]"
            icon={<FolderGit2 className="w-4 h-4" />}
            ariaLabel="Explore featured projects"
          >
            Explore Projects
          </Button>

          <Button
            href="#contact"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-h-[48px]"
            icon={<Mail className="w-4 h-4" />}
            ariaLabel="Get in touch with Asli Mich Jose"
          >
            Connect With Me
          </Button>
        </div>

        {/* Subtle Tech Stack Footer */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono text-[#F5EFE5]/60 max-w-xl px-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-emerald-400 font-medium">Available for Opportunities</span>
          </span>
          <span className="hidden sm:inline text-[#F5EFE5]/30">|</span>
          <span className="text-center text-[10px] sm:text-xs leading-normal">
            React.js • Node.js • Express.js • MongoDB • REST APIs
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-1.5 pointer-events-none opacity-70">
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#F0A352] uppercase">
            Scroll to Journey
          </span>
          <ArrowDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#F0A352] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
