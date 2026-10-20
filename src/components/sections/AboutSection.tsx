"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, BookOpen, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const learningRef = useRef<HTMLDivElement | null>(null);
  const interestsRef = useRef<HTMLDivElement | null>(null);

  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Background Cinematic Parallax
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

      // 2. Smooth Progressive Card & Content Tracking Reveals
      const revealItems = [
        { el: cardRef.current, x: -40, start: "top 75%" },
        { el: bioRef.current, x: 40, start: "top 72%" },
        { el: learningRef.current, x: 35, start: "top 68%" },
        { el: interestsRef.current, x: 30, start: "top 65%" },
      ];

      revealItems.forEach(({ el, x, start }) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, x, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex items-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Autumn Garden Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/about-autumn-garden.jpg"
          alt="Tranquil traditional veranda overlooking an autumn maple garden"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.75] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Golden Hour Lighting & Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/60 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(240,163,82,0.18)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#C96F3B]/15 blur-[120px] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Content with Frosted Glass Panels */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <SectionHeading
          number="ACT 01 / ESSENCE"
          categoryLabel="Philosophy & Profile"
          title="Bridging Narrative & Structure"
          highlightWord="Structure"
          description="Crafting digital environments that marry the emotional warmth of cinematic visuals with the rigorous discipline of modern web engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Studio Workspace Card with 3D Tilt */}
          <div className="lg:col-span-5 relative">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/35 shadow-2xl shadow-black/70 group will-change-transform"
              style={{
                transform: tilt.isHovered
                  ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
                  : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                transition: tilt.isHovered ? "transform 0.12s ease-out" : "transform 0.5s ease-out",
              }}
            >
              {/* Specular glare */}
              {tilt.isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.22) 0%, transparent 65%)`,
                  }}
                />
              )}

              {/* Image Container */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <Image
                  src="/images/project-autumn-workspace.jpg"
                  alt="Developer desk bathed in autumn golden sunlight"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-transparent to-transparent opacity-90" />

                {/* Corner Crest */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#201C19]/85 backdrop-blur-md border border-[#F0A352]/40 text-xs font-mono text-[#F0A352] flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#F0A352]" />
                  <span>The Creative Studio</span>
                </div>
              </div>

              {/* Quote Block */}
              <div className="p-6 bg-[#201C19]/95 backdrop-blur-md border-t border-[#C96F3B]/20">
                <blockquote className="font-serif italic text-sm sm:text-base text-[#F5EFE5]/90 mb-3 leading-relaxed">
                  &ldquo;{portfolioData.personal.philosophy}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between pt-3 border-t border-[#C96F3B]/15">
                  <span className="text-xs font-mono text-[#F0A352]">
                    — {portfolioData.personal.name}
                  </span>
                  <span className="text-xs font-mono text-[#F5EFE5]/50 uppercase tracking-widest">
                    Perspective
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing Accent Rim */}
            <div className="absolute -inset-2 rounded-2xl border border-[#F0A352]/20 -z-10 translate-x-3 translate-y-3 pointer-events-none" />
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            {/* Bio Paragraphs */}
            <div
              ref={bioRef}
              className="space-y-4 p-6 sm:p-7 rounded-2xl glass-panel border border-[#C96F3B]/25 shadow-xl transition-all duration-300 hover:border-[#F0A352]/40"
            >
              {portfolioData.personal.bio.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg text-[#F5EFE5]/85 font-sans font-light leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Current Learning Goals */}
            <div
              ref={learningRef}
              className="p-6 sm:p-7 rounded-2xl glass-panel-warm border border-[#C96F3B]/30 shadow-xl transition-all duration-300 hover:border-[#F0A352]/50"
            >
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#F0A352] uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Current Learning Expeditions</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portfolioData.personal.currentLearning.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-[#F5EFE5]/90 font-sans"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C96F3B] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Development Interests */}
            <div
              ref={interestsRef}
              className="p-5 rounded-2xl glass-panel border border-[#C96F3B]/20 transition-all duration-300 hover:border-[#F0A352]/40"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-[#F5EFE5]/70 uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 text-[#C96F3B]" />
                <span>Areas of Creative Focus</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {portfolioData.personal.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#F5EFE5]/90 bg-[#392820]/80 border border-[#C96F3B]/35 hover:border-[#F0A352] hover:bg-[#392820] transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
