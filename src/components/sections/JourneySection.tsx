"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData, JourneyMilestone } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  Clock,
  Radio,
} from "lucide-react";

interface JourneyTiltCardProps {
  item: JourneyMilestone;
  index: number;
  isActive: boolean;
  totalMilestones: number;
}

function JourneyTiltCard({
  item,
  index,
  isActive,
  totalMilestones,
}: JourneyTiltCardProps) {
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

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: tilt.isHovered ? "transform 0.08s ease-out" : "transform 0.45s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`p-6 sm:p-8 rounded-3xl glass-panel border transition-all duration-300 group backdrop-blur-xl relative overflow-hidden bg-[#181310]/94 cursor-pointer select-none ${
        isActive
          ? "border-[#F0A352] shadow-[0_20px_50px_rgba(0,0,0,0.9)] ring-1 ring-[#F0A352]/40"
          : "border-[#C96F3B]/35 hover:border-[#F0A352] hover:shadow-2xl hover:shadow-[#C96F3B]/25"
      }`}
    >
      {/* Dynamic Amber Spotlight Glare on Tilt */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.22) 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Top Amber Energy Flare Streak */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent transition-opacity duration-500 z-20 ${
          isActive || tilt.isHovered ? "opacity-100" : "opacity-40 group-hover:opacity-100"
        }`}
      />

      {/* Station Badge & Era Header */}
      <div className="flex items-center justify-between mb-3.5 relative z-20">
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
            isActive || tilt.isHovered
              ? "bg-[#F0A352] text-[#181310] font-bold border-[#F0A352] shadow-sm"
              : "bg-[#392820] text-[#F0A352] border-[#C96F3B]/35"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-[#181310] animate-ping" : "bg-[#F0A352]"
            }`}
          />
          <span>{item.period}</span>
        </span>

        <span className="text-[11px] font-mono text-[#F5EFE5]/50 uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[#F0A352]" />
          Station 0{index + 1}
        </span>
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors mb-1 tracking-tight relative z-20">
        {item.title}
      </h3>

      <h4 className="text-xs sm:text-sm font-sans font-medium text-[#C96F3B] mb-4 relative z-20">
        {item.subtitle}
      </h4>

      <p className="text-xs sm:text-sm text-[#F5EFE5]/85 font-sans font-light leading-relaxed mb-5 relative z-20">
        {item.description}
      </p>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3.5 border-t border-[#C96F3B]/25 relative z-20">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#201C19]/90 text-[#F5EFE5]/85 border border-[#C96F3B]/25 group-hover:border-[#F0A352]/50 hover:!border-[#F0A352] hover:text-[#FFE8B8] transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-3 border-t border-[#C96F3B]/15 flex items-center justify-between text-[10px] font-mono text-[#F5EFE5]/50 relative z-20">
        <span className="flex items-center gap-1.5 text-[#F0A352]">
          <CheckCircle2 className="w-3 h-3" />
          <span>
            {index === totalMilestones - 1
              ? "Active Horizon"
              : "Milestone Verified"}
          </span>
        </span>
        <span className="text-[#FFE8B8]/70">Chapter 0{index + 1}</span>
      </div>
    </div>
  );
}

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const streamLineRef = useRef<HTMLDivElement | null>(null);
  const beaconRef = useRef<HTMLDivElement | null>(null);

  const [activeStation, setActiveStation] = useState<number>(0);

  const milestones = portfolioData.journey;
  const totalMilestones = milestones.length;

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const streamLine = streamLineRef.current;
    const beacon = beaconRef.current;
    if (!section || !timeline) return;

    const ctx = gsap.context(() => {
      // 1. Silky Parallax Background Drift
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 16,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.0,
          },
        });
      }

      // 2. Central Active Flow Stream Conduit with Moving Beacon
      if (streamLine && beacon) {
        const streamTl = gsap.timeline({
          scrollTrigger: {
            trigger: timeline,
            start: "top 75%",
            end: "bottom 80%",
            scrub: 1.0,
          },
        });

        // Scale vertical energy beam
        streamTl.fromTo(
          streamLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
          },
          0
        );

        // Move the glowing railway beacon down the track simultaneously
        streamTl.fromTo(
          beacon,
          { top: "0%", opacity: 0.4 },
          {
            top: "100%",
            opacity: 1,
            ease: "none",
          },
          0
        );
      }

      // 3. Fluid 3D Milestone Discovery & Active Station Illuminations
      const milestoneCards = timeline.querySelectorAll<HTMLElement>(".milestone-card");
      if (milestoneCards && milestoneCards.length > 0) {
        milestoneCards.forEach((card, index) => {
          const isEven = index % 2 === 0;
          const contentBox = card.querySelector<HTMLElement>(".milestone-content");
          const centerNode = card.querySelector<HTMLElement>(".milestone-node");
          const nodePulse = card.querySelector<HTMLElement>(".milestone-node-pulse");

          // 3D Perspective Card Entrance
          if (contentBox) {
            gsap.fromTo(
              contentBox,
              {
                opacity: 0,
                x: isEven ? 55 : -55,
                rotateY: isEven ? -16 : 16,
                scale: 0.94,
                filter: "brightness(0.7)",
              },
              {
                opacity: 1,
                x: 0,
                rotateY: 0,
                scale: 1,
                filter: "brightness(1)",
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                  onEnter: () => setActiveStation(index),
                  onEnterBack: () => setActiveStation(index),
                },
              }
            );
          }

          // Node flare when stream touches it
          if (centerNode) {
            gsap.fromTo(
              centerNode,
              {
                scale: 0.7,
                borderColor: "#392820",
                boxShadow: "0 0 0px rgba(240,163,82,0)",
              },
              {
                scale: 1.15,
                borderColor: "#F0A352",
                boxShadow: "0 0 25px rgba(240,163,82,0.85)",
                duration: 0.6,
                ease: "back.out(1.8)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Active node glow expansion
          if (nodePulse) {
            gsap.fromTo(
              nodePulse,
              { opacity: 0, scale: 0.5 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
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
  }, []);

  // Smooth scroll directly to milestone station
  const scrollToStation = (index: number) => {
    if (!timelineRef.current) return;
    const cards = timelineRef.current.querySelectorAll(".milestone-card");
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden flex flex-col justify-center bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Railway Scene Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/journey-autumn-train.jpg"
          alt="Autumn railway tracks stretching into misty sunset hills"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.70] contrast-[1.08]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Sunset Lighting & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/70 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(240,163,82,0.18)_0%,transparent_65%)] pointer-events-none" />

      {/* Dynamic Layer 2: Editorial Journey Timeline */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <SectionHeading
          number="ACT 04 / CHRONICLE"
          categoryLabel="Milestone Timeline"
          title="The Developer Odyssey"
          highlightWord="Odyssey"
          description="A visual narrative mapping the progression from foundational curiosity to modern fullstack architecture and cinematic motion."
        />

        {/* Station Navigation Pill Bar: Interactive Quick-Jumper */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 -mt-8 sm:-mt-10 mb-12 sm:mb-16">
          {milestones.map((item, idx) => (
            <button
              key={item.period}
              onClick={() => scrollToStation(idx)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 flex items-center gap-2 border ${
                activeStation === idx
                  ? "bg-[#F0A352] text-[#181310] font-bold border-[#F0A352] shadow-[0_0_15px_rgba(240,163,82,0.4)] scale-105"
                  : "bg-[#201C19]/80 text-[#F5EFE5]/70 border-[#C96F3B]/30 hover:border-[#F0A352]/60 hover:text-[#F5EFE5]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeStation === idx
                    ? "bg-[#181310] animate-ping"
                    : "bg-[#F0A352]/60"
                }`}
              />
              <span>{item.period}</span>
            </button>
          ))}
        </div>

        {/* Timeline Container */}
        <div
          ref={timelineRef}
          className="relative mt-8 sm:mt-12"
          style={{ perspective: "1400px" }}
        >
          {/* Central Glowing Autumn Railway Conduit Track (Desktop center, Mobile left) */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-8 md:-translate-x-1/2 w-[3px] bg-[#392820]/90 rounded-full">
            {/* Railway tie hash marks along the spine for authentic train-track aesthetic */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 -ml-[4.5px] h-[1.5px] bg-[#F0A352]/40 rounded-full"
                />
              ))}
            </div>

            {/* Glowing Active Energy Stream */}
            <div
              ref={streamLineRef}
              className="w-full h-full bg-gradient-to-b from-[#F0A352] via-[#C96F3B] to-[#FFE8B8] shadow-lg shadow-[#F0A352]/60 origin-top will-change-transform"
            />

            {/* Traveling Waypoint Beacon (Rides along the track head with Lenis scroll) */}
            <div
              ref={beaconRef}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFE8B8] border-2 border-[#F0A352] shadow-[0_0_20px_#F0A352] flex items-center justify-center pointer-events-none will-change-transform z-30"
            >
              <div className="w-2 h-2 rounded-full bg-[#181310] animate-pulse" />
              <div className="absolute -inset-1 rounded-full border border-[#FFE8B8]/60 animate-ping" />
            </div>
          </div>

          <div className="space-y-12 sm:space-y-16 pl-14 md:pl-0">
            {milestones.map((item: JourneyMilestone, index: number) => {
              const isEven = index % 2 === 0;
              const isActive = activeStation === index;

              return (
                <div
                  key={item.period}
                  className={`milestone-card relative flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card with 3D Entrance Wrapper + Inner Interactive Tilt Card */}
                  <div className="milestone-content w-full md:w-[calc(50%-2.5rem)] will-change-transform">
                    <JourneyTiltCard
                      item={item}
                      index={index}
                      isActive={isActive}
                      totalMilestones={totalMilestones}
                    />
                  </div>

                  {/* Center Node / Lantern Point (Desktop center, Mobile hidden since rail is left) */}
                  <div className="milestone-node hidden md:flex relative z-10 w-12 h-12 rounded-full bg-[#181310] border-2 border-[#392820] items-center justify-center shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="milestone-node-pulse w-4 h-4 rounded-full bg-gradient-to-r from-[#F0A352] to-[#C96F3B] shadow-md shadow-[#F0A352]" />
                    <span className="absolute -inset-1.5 rounded-full border border-[#F0A352]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Spacer for symmetry on desktop */}
                  <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
