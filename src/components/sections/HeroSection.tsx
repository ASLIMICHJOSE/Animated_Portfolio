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

      // Scroll-triggered Layered Parallax
      if (containerRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 22,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(foliageRef.current, {
          yPercent: -18,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(contentRef.current, {
          yPercent: 35,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#201C19]"
    >
      {/* Layer 0: Anime Autumn City Backdrop */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
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
        className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-24 pb-16 will-change-transform flex flex-col items-center justify-center"
      >
        {/* Badge */}
        <div ref={subtitleRef} className="mb-6 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#201C19]/80 border border-[#C96F3B]/40 backdrop-blur-md shadow-lg shadow-black/30">
            <Sparkles className="w-3.5 h-3.5 text-[#F0A352] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#F0A352] uppercase">
              Creative Engineering & UI/UX
            </span>
            <span className="text-[#F5EFE5]/40 text-xs">•</span>
            <span className="text-xs font-mono text-[#F5EFE5]/85 uppercase tracking-wider">
              Autumn Journey
            </span>
          </div>
        </div>

        {/* Main Monolithic Identity */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-[#F5EFE5] tracking-tight leading-[1.05] mb-6 drop-shadow-2xl"
        >
          <span>{portfolioData.personal.name}</span>
        </h1>

        {/* Cinematic Subtitle & Statement */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#F5EFE5]/90 font-serif font-normal max-w-3xl mb-4 leading-relaxed">
          {portfolioData.personal.title}
        </p>

        <p className="text-sm sm:text-base text-[#F5EFE5]/75 font-sans font-light max-w-2xl mb-10 leading-relaxed">
          {portfolioData.personal.tagline}
        </p>

        {/* Call to Actions */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            href="#projects"
            variant="primary"
            size="lg"
            icon={<FolderGit2 className="w-4 h-4" />}
            ariaLabel="Explore featured projects"
          >
            Explore Projects
          </Button>

          <Button
            href="#contact"
            variant="outline"
            size="lg"
            icon={<Mail className="w-4 h-4" />}
            ariaLabel="Get in touch with Asli Mich Jose"
          >
            Connect With Me
          </Button>
        </div>

        {/* Subtle Tech Stack Footer */}
        <div className="mt-12 inline-flex items-center gap-6 text-xs font-mono text-[#F5EFE5]/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-emerald-400 font-medium">Available for Opportunities</span>
          </span>
          <span className="hidden sm:inline text-[#F5EFE5]/30">|</span>
          <span className="hidden sm:inline">TypeScript • React • Next.js • Three.js • GSAP</span>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 flex flex-col items-center gap-2 pointer-events-none opacity-70">
          <span className="text-[10px] font-mono tracking-widest text-[#F0A352] uppercase">
            Scroll to Journey
          </span>
          <ArrowDown className="w-4 h-4 text-[#F0A352] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
