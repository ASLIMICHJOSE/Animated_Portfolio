"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ArrowUp,
  Send,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { portfolioData } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { gsap } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Parallax scroll on anime twilight background
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

      // Card Entrance
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 55, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(portfolioData.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-28 sm:py-36 px-6 sm:px-8 overflow-hidden flex flex-col justify-between bg-[#201C19]"
    >
      {/* Dynamic Layer 0: Full-Bleed Anime Autumn Twilight Riverside Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/contact-autumn-twilight.jpg"
          alt="Cinematic twilight riverside with warm lanterns and autumn leaves"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.76] contrast-[1.05]"
        />
      </div>

      {/* Dynamic Layer 1: Atmospheric Twilight Lighting & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-[#201C19]/65 to-[#201C19]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(240,163,82,0.18)_0%,transparent_60%)] pointer-events-none" />

      {/* Dynamic Layer 2: Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto">
        <SectionHeading
          number="ACT 05 / DESTINATION"
          categoryLabel="Connect"
          title="Weave Something Memorable"
          highlightWord="Memorable"
          description="Whether you have an ambitious digital vision, an intriguing project, or simply want to converse about cinematic web design, my inbox is always open."
        />

        {/* Central Contact Card */}
        <div
          ref={cardRef}
          className="p-8 sm:p-12 rounded-3xl glass-panel border border-[#C96F3B]/40 shadow-2xl shadow-black/70 relative overflow-hidden text-center backdrop-blur-2xl"
        >
          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#F0A352] to-transparent shadow-lg shadow-[#F0A352]/50" />

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#392820]/90 border border-[#C96F3B]/40 text-xs font-mono text-[#F0A352] mb-8 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{portfolioData.personal.availability}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5EFE5] mb-4">
            Start a Conversation
          </h3>

          <p className="text-sm sm:text-base text-[#F5EFE5]/80 font-sans font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Feel free to reach out directly via email or connect through professional networks.
          </p>

          {/* Email Interaction Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-10">
            <div className="w-full sm:w-auto flex-1 px-5 py-3 rounded-full bg-[#201C19]/90 border border-[#C96F3B]/50 text-sm font-mono text-[#F5EFE5] truncate shadow-inner">
              {portfolioData.socials.email}
            </div>

            <button
              onClick={handleCopyEmail}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-mono tracking-wider uppercase bg-[#392820] hover:bg-[#C96F3B] text-[#F5EFE5] border border-[#C96F3B]/50 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F0A352] active:scale-95 shadow-md"
              aria-label="Copy email address to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#F0A352]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Actions & Socials */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-[#C96F3B]/25">
            <Button
              href={`mailto:${portfolioData.socials.email}`}
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
              ariaLabel="Send an email to Asli Mich Jose"
            >
              Send Direct Email
            </Button>

            {portfolioData.socials.github && (
              <Button
                href={portfolioData.socials.github}
                variant="outline"
                size="md"
                external
                icon={<GithubIcon className="w-4 h-4" />}
                ariaLabel="Visit GitHub profile"
              >
                GitHub
              </Button>
            )}

            {portfolioData.socials.linkedin && (
              <Button
                href={portfolioData.socials.linkedin}
                variant="outline"
                size="md"
                external
                icon={<LinkedinIcon className="w-4 h-4" />}
                ariaLabel="Visit LinkedIn profile"
              >
                LinkedIn
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-16 mt-16 border-t border-[#C96F3B]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#F5EFE5]/60">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-sm text-[#F5EFE5]">
            ASLI MICH JOSE
          </span>
          <span>•</span>
          <span>© 2026 All Rights Reserved</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden md:inline font-mono text-[#F0A352]/80 uppercase tracking-widest text-[11px]">
            Next.js • Three.js • TypeScript • GSAP
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#392820]/80 hover:bg-[#C96F3B]/60 border border-[#C96F3B]/40 text-[#F5EFE5] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C96F3B]"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F0A352]" />
          </button>
        </div>
      </footer>
    </section>
  );
}
