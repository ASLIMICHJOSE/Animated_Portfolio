"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ArrowUp,
  Send,
  Sparkles,
  Phone,
  FileText,
  Download,
  ExternalLink,
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

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
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
      // 1. Parallax scroll on anime twilight background
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

      // 2. Smooth Card Entrance Reveal
      if (cardRef.current && sectionRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 55, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
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

        {/* Central Contact Card with 3D Tilt */}
        <div ref={cardRef} className="w-full relative">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="p-8 sm:p-12 rounded-3xl glass-panel border border-[#C96F3B]/40 shadow-2xl shadow-black/70 relative overflow-hidden text-center"
            style={{
              transform: tilt.isHovered
                ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: tilt.isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
              boxShadow: tilt.isHovered
                ? "0 25px 50px -15px rgba(201, 111, 59, 0.4), 0 0 30px rgba(240, 163, 82, 0.2)"
                : "0 10px 25px -10px rgba(0, 0, 0, 0.7)",
            }}
          >
          {/* Specular glare */}
          {tilt.isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.2) 0%, transparent 65%)`,
              }}
            />
          )}

          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#F0A352] to-transparent shadow-lg shadow-[#F0A352]/50" />

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#392820]/90 border border-[#C96F3B]/40 text-xs font-mono text-[#F0A352] mb-8 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
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

            {portfolioData.socials.phone && (
              <Button
                href={`tel:${portfolioData.socials.phone.replace(/[^0-9+]/g, "")}`}
                variant="outline"
                size="md"
                icon={<Phone className="w-4 h-4" />}
                ariaLabel="Call Asli Mich Jose J"
              >
                {portfolioData.socials.phone}
              </Button>
            )}

            <Button
              href="/resume.pdf"
              variant="amber"
              size="md"
              external
              icon={<FileText className="w-4 h-4" />}
              ariaLabel="View Asli Mich Jose Resume PDF"
            >
              Resume [PDF]
            </Button>
          </div>
        </div>

        {/* Dedicated Interactive Resume Showcase Card */}
        <div className="mt-8 p-6 sm:p-7 rounded-3xl glass-panel-warm border border-[#F0A352]/45 bg-[#181310]/95 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group text-left">
          {/* Subtle Top Amber Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent shadow-[0_0_15px_#F0A352]" />

          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Miniature Document Preview with Visual Depth */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-[#C96F3B]/40 shadow-xl bg-white shrink-0 group-hover:border-[#F0A352] transition-colors block cursor-pointer"
            >
              <Image
                src="/resume/resume-preview.png"
                alt="Asli Mich Jose Resume Preview"
                fill
                sizes="120px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 px-1 py-0.5 rounded bg-[#0078D4]/90 text-[9px] font-mono text-center text-white font-bold tracking-wider">
                PDF · 2026
              </div>
            </a>

            {/* Document Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F0A352] font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F0A352]" />
                  Official Curriculum Vitae
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] font-bold">
                  Verified
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors leading-snug">
                Asli Mich Jose J — Resume
              </h4>
              <p className="text-xs text-[#F5EFE5]/70 font-sans font-light mt-1 max-w-md leading-relaxed">
                Computer Science Engineer · Frontend &amp; Full-Stack AI Developer · Experience at Admini · Microsoft &amp; MongoDB Certified.
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-[#FFE8B8]/80">
                <span>● 2 Pages</span>
                <span>● ATS Optimized</span>
                <span>● Clean Typography</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0 justify-center">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F0A352] text-[#181310] font-mono font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#FFE8B8] transition-all shadow-[0_0_25px_rgba(240,163,82,0.35)] hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>View Official Resume</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="/resume.pdf"
              download="Asli_Mich_Jose_Resume.pdf"
              title="Download Resume PDF directly"
              className="p-3 rounded-xl bg-[#201C19] border border-[#C96F3B]/40 text-[#F5EFE5]/80 hover:text-[#181310] hover:bg-[#F0A352] hover:border-[#F0A352] transition-all shadow-sm flex items-center justify-center"
              aria-label="Download Resume PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>

      {/* Footer Navigation & Copyright */}
      <footer className="relative z-10 w-full pt-16 pb-8 border-t border-[#C96F3B]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F5EFE5]/50">
        <div>
          <span>&copy; 2026 {portfolioData.personal.name}. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[#F0A352] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built with Next.js, Three.js &amp; GSAP</span>
          </span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#F5EFE5]/70 hover:text-[#F0A352] transition-colors p-1 rounded"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
