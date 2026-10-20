"use client";

import React, { useEffect, useRef, useState } from "react";
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

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  const getCategoryIcon = (i: number) => {
    switch (i) {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`skill-discovery-card rounded-2xl p-6 sm:p-8 glass-panel border border-[#C96F3B]/30 hover:border-[#F0A352] flex flex-col justify-between backdrop-blur-xl relative overflow-hidden will-change-transform ${
        index === 0 ? "md:col-span-2 lg:col-span-1" : ""
      }`}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: tilt.isHovered ? "transform 0.12s ease-out" : "transform 0.5s ease-out",
        boxShadow: tilt.isHovered
          ? "0 20px 40px -15px rgba(201, 111, 59, 0.35), 0 0 25px rgba(240, 163, 82, 0.15)"
          : "0 10px 25px -10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* 3D Dynamic Glare Reflection */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.2) 0%, rgba(255, 232, 184, 0.06) 40%, transparent 65%)`,
          }}
        />
      )}

      {/* Top Flow Discovery Border Flare */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-[#392820]/90 border border-[#C96F3B]/40 transition-transform duration-300 hover:scale-110">
            {getCategoryIcon(index)}
          </div>
          <span className="text-xs font-mono text-[#F0A352] tracking-wider uppercase font-semibold">
            {category.subtitle}
          </span>
        </div>

        <h3 className="text-xl font-serif font-bold text-[#F5EFE5] mb-4 hover:text-[#F0A352] transition-colors">
          {category.title}
        </h3>

        {/* Skill Items with Interactive Micro-Animations */}
        <ul className="space-y-3 mb-6">
          {category.skills.map((skill) => (
            <li
              key={skill.name}
              className="skill-item-pill p-3 rounded-xl bg-[#201C19]/85 border border-[#C96F3B]/15 hover:border-[#F0A352]/50 hover:bg-[#2D1E16] transition-all duration-300 hover:translate-x-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#F5EFE5] font-medium">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-[#F0A352] tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#392820]/80">
                  Active
                </span>
              </div>
              {skill.description && (
                <p className="text-xs text-[#F5EFE5]/70 mt-1 font-sans font-light leading-relaxed">
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
        <span className="text-[#F0A352]/80 font-semibold">{category.skills.length} Technologies</span>
      </div>
    </div>
  );
}

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

      // 2. Upgraded 3D Spatial Assembly Reveal for Skill Cards
      const cards = cardsRef.current?.querySelectorAll(".skill-discovery-card");
      if (cards && cards.length > 0) {
        cards.forEach((card, index) => {
          const pills = card.querySelectorAll(".skill-item-pill");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });

          tl.fromTo(
            card,
            { opacity: 0, y: 55, scale: 0.94, rotateX: 8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.85,
              ease: "power2.out",
            }
          );

          if (pills && pills.length > 0) {
            tl.fromTo(
              pills,
              { opacity: 0, x: -15 },
              {
                opacity: 1,
                x: 0,
                duration: 0.45,
                stagger: 0.06,
                ease: "power2.out",
              },
              "-=0.4"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

        {/* Editorial Categories Grid with Individual 3D Tilt Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {portfolioData.skillCategories.map((category: SkillCategory, index: number) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
