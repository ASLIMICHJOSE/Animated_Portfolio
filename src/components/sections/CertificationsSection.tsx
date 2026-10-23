"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioData, Certification } from "@/data/portfolio";
import { initGSAP } from "@/lib/animations";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Cloud,
  Database,
  Cpu,
  Terminal,
  BookmarkCheck,
  X,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  QrCode,
  ScanLine,
  Maximize2,
} from "lucide-react";

function getCategoryIcon(category: Certification["category"]) {
  switch (category) {
    case "Cloud & Infrastructure":
      return <Cloud className="w-4 h-4 text-[#F0A352]" />;
    case "Database & AI":
      return <Database className="w-4 h-4 text-[#C96F3B]" />;
    case "Artificial Intelligence":
      return <Cpu className="w-4 h-4 text-[#FFE8B8]" />;
    case "Software Engineering":
      return <Terminal className="w-4 h-4 text-[#F0A352]" />;
    default:
      return <Award className="w-4 h-4 text-[#F0A352]" />;
  }
}

function getIssuerColor(issuer: string) {
  if (issuer.includes("Microsoft")) {
    return "text-[#F0A352] bg-[#F0A352]/10 border-[#F0A352]/30";
  }
  if (issuer.includes("MongoDB")) {
    return "text-[#47A248] bg-[#47A248]/10 border-[#47A248]/30";
  }
  return "text-[#FFE8B8] bg-[#FFE8B8]/10 border-[#FFE8B8]/30";
}

function CertificationCard({
  cert,
  index,
  onInspect,
}: {
  cert: Certification;
  index: number;
  onInspect: (cert: Certification) => void;
}) {
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
      onClick={() => onInspect(cert)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1200px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
          : "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: tilt.isHovered ? "transform 0.08s ease-out" : "transform 0.45s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="cert-card relative rounded-3xl p-6 sm:p-7 glass-panel border border-[#C96F3B]/35 hover:border-[#F0A352] transition-all duration-300 bg-[#181310]/94 shadow-xl hover:shadow-[0_20px_50px_rgba(240,163,82,0.22)] flex flex-col justify-between overflow-hidden group select-none cursor-pointer"
    >
      {/* Dynamic Specular Glare on Mouse Tilt */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.25) 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Laser Scan Horizon Beam (Sweeps across card on hover) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20">
        <div
          className={`w-full h-full bg-gradient-to-r from-transparent via-[#F0A352]/20 to-transparent transition-transform duration-1000 ease-in-out ${
            tilt.isHovered ? "translate-x-full" : "-translate-x-full"
          }`}
        />
      </div>

      {/* Top glowing amber edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-20" />

      {/* Header: Issuer badge & Category */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-20">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-xl bg-[#2D1E16] border border-[#C96F3B]/40 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {getCategoryIcon(cert.category)}
          </span>
          <div>
            <span
              className={`text-[10px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded-full border inline-block mb-0.5 ${getIssuerColor(
                cert.issuer
              )}`}
            >
              {cert.issuer}
            </span>
            <span className="text-[11px] font-mono text-[#F5EFE5]/50 block">
              {cert.credentialId || cert.category}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#201C19] border border-[#C96F3B]/30 text-[#FFE8B8] flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-[#34D399]" />
          <span>{cert.period}</span>
        </span>
      </div>

      {/* Visual Certificate Preview if available */}
      {cert.image && (
        <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 border border-[#C96F3B]/30 group-hover:border-[#F0A352]/60 transition-all bg-[#0F0D0B] shadow-inner">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#181310]/90 backdrop-blur-md border border-[#F0A352]/40 text-[10px] font-mono text-[#FFE8B8] flex items-center gap-1.5 shadow-sm">
            <FileCheck className="w-3 h-3 text-[#34D399]" />
            <span>Official Credential</span>
          </div>
          <div className="absolute top-2 right-2 p-1 rounded-md bg-[#181310]/80 backdrop-blur-sm border border-[#C96F3B]/30 text-[#F0A352] opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Body: Title & Description */}
      <div className="relative z-20 my-2">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors leading-snug tracking-tight mb-2">
          {cert.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#F5EFE5]/80 font-sans font-light leading-relaxed line-clamp-3">
          {cert.description}
        </p>
      </div>

      {/* Skills Pill Tags & Footer */}
      <div className="relative z-20 pt-4 mt-auto border-t border-[#C96F3B]/25">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cert.skills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201C19] text-[#F5EFE5]/85 border border-[#C96F3B]/25 group-hover:border-[#F0A352]/40 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#F0A352]/80 pt-2 border-t border-[#C96F3B]/15">
          <span className="flex items-center gap-1.5 text-xs text-[#F0A352] group-hover:translate-x-1 transition-transform">
            <ScanLine className="w-3.5 h-3.5 text-[#F0A352]" />
            <span className="font-bold underline decoration-[#F0A352]/40 underline-offset-4">
              Inspect Certificate
            </span>
          </span>
          <span className="text-[#FFE8B8] font-bold">0{index + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [inspectCert, setInspectCert] = useState<Certification | null>(null);

  const certifications = portfolioData.certifications;

  const categories = [
    "All",
    "Database & AI",
    "Artificial Intelligence",
    "Cloud & Infrastructure",
    "Software Engineering",
  ];

  const filteredCerts =
    activeCategory === "All"
      ? certifications
      : certifications.filter((c) => c.category === activeCategory);

  // 1. Entrance 3D Fan-out Animation
  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      // Parallax background drift
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 15,
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

      // 3D Staggered Cascade Fan-out
      const cards = grid.querySelectorAll(".cert-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 70,
            rotateX: 24,
            rotateY: (index: number) => ((index % 3) - 1) * 8,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "back.out(1.25)",
            scrollTrigger: {
              trigger: grid,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [filteredCerts.length]);

  // 2. Holographic Certificate Modal 3D Entrance Animation
  useEffect(() => {
    if (!inspectCert || !modalRef.current) return;
    const { gsap } = initGSAP();

    gsap.fromTo(
      modalRef.current,
      {
        transformOrigin: "center center",
        scale: 0.82,
        rotateX: 20,
        y: 40,
        opacity: 0.1,
        filter: "brightness(2) drop-shadow(0 0 35px rgba(240,163,82,0.8))",
      },
      {
        scale: 1,
        rotateX: 0,
        y: 0,
        opacity: 1,
        filter: "brightness(1) drop-shadow(0 30px 80px rgba(0,0,0,0.95))",
        duration: 0.6,
        ease: "back.out(1.2)",
      }
    );
  }, [inspectCert?.id]);

  // 3. Close Handler with reverse mechanical 3D fold
  const handleCloseModal = useCallback(() => {
    if (!modalRef.current) {
      setInspectCert(null);
      return;
    }
    const { gsap } = initGSAP();
    gsap.to(modalRef.current, {
      scale: 0.85,
      rotateX: -20,
      y: 30,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setInspectCert(null),
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseModal]);

  const currentIdx = inspectCert
    ? certifications.findIndex((c) => c.id === inspectCert.id)
    : -1;

  const handlePrevCert = () => {
    if (currentIdx === -1) return;
    const prev = (currentIdx - 1 + certifications.length) % certifications.length;
    setInspectCert(certifications[prev]);
  };

  const handleNextCert = () => {
    if (currentIdx === -1) return;
    const next = (currentIdx + 1) % certifications.length;
    setInspectCert(certifications[next]);
  };

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden flex flex-col justify-center bg-[#201C19]"
    >
      {/* Background Anime Autumn Scene */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
      >
        <Image
          src="/images/about-autumn-garden.jpg"
          alt="Autumn garden reflections"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.62] contrast-[1.08]"
        />
      </div>

      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#201C19] via-[#201C19]/75 to-[#201C19] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(240,163,82,0.14)_0%,transparent_65%)] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <SectionHeading
          number="ACT 05 / CREDENTIALS"
          categoryLabel="Verified Industry Competencies"
          title="Industry Certifications"
          highlightWord="Certifications"
          description="Industry-recognized accreditations spanning Microsoft Azure Cloud, MongoDB Vector Search & AI Agents, Retrieval-Augmented Generation (RAG), and Professional Software Engineering."
        />

        {/* Interactive Filter Pills (Touch scrollable on mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar -mt-6 sm:-mt-10 mb-8 sm:mb-14 px-2 py-1 max-w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 border shrink-0 min-h-[38px] ${
                activeCategory === category
                  ? "bg-[#F0A352] text-[#181310] font-bold border-[#F0A352] shadow-[0_0_15px_rgba(240,163,82,0.4)] scale-105"
                  : "bg-[#201C19]/80 text-[#F5EFE5]/70 border-[#C96F3B]/30 hover:border-[#F0A352]/60 hover:text-[#F5EFE5]"
              }`}
            >
              <span>{category}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">
                (
                {category === "All"
                  ? certifications.length
                  : certifications.filter((c) => c.category === category).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Certification Cards Grid with 3D Tilt & Click to Inspect */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          style={{ perspective: "1600px" }}
        >
          {filteredCerts.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              onInspect={setInspectCert}
            />
          ))}
        </div>

        {/* Bottom Verification Banner */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-2xl glass-panel-warm border border-[#C96F3B]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F5EFE5]/75">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 rounded-xl bg-[#2D1E16] border border-[#F0A352]/40 text-[#F0A352]">
              <BookmarkCheck className="w-5 h-5 text-[#F0A352]" />
            </div>
            <div>
              <span className="font-bold text-[#F5EFE5] block text-sm">
                Verified Credentials Portfolio
              </span>
              <span className="text-[#F0A352]">
                Issued by Microsoft, MongoDB University &amp; LinkedIn Learning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#FFE8B8]/80">
            <span>● 7 Professional Accreditations</span>
            <span>● Cloud · AI · Databases</span>
          </div>
        </div>
      </div>

      {/* 4. HOLOGRAPHIC CERTIFICATE INSPECTOR MODAL (Interactive 3D Vault) */}
      {inspectCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0E0C0A]/85 backdrop-blur-xl">
          <div
            onClick={handleCloseModal}
            className="absolute inset-0 pointer-events-auto"
          />

          <div
            ref={modalRef}
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden glass-panel border border-[#F0A352]/60 bg-[#161210]/95 shadow-[0_30px_90px_rgba(0,0,0,0.95)] z-20 flex flex-col max-h-[90vh] pointer-events-auto"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Top Amber Energy Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent shadow-[0_0_15px_#F0A352]" />

            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#C96F3B]/30 bg-[#1D1714]">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F0A352] text-[#181310]">
                  0{currentIdx + 1} / 0{certifications.length}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#F0A352] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                  Official Credential Dossier
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Switcher */}
                <div className="flex items-center border border-[#C96F3B]/35 rounded-full overflow-hidden bg-[#201C19] mr-2">
                  <button
                    onClick={handlePrevCert}
                    aria-label="Previous certificate"
                    className="p-1.5 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#281F1B] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono text-[#F5EFE5]/40 px-1">|</span>
                  <button
                    onClick={handleNextCert}
                    aria-label="Next certificate"
                    className="p-1.5 text-[#F5EFE5]/70 hover:text-[#F0A352] hover:bg-[#281F1B] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  aria-label="Close certificate inspector"
                  className="p-2 rounded-full bg-[#201C19] border border-[#C96F3B]/35 text-[#F5EFE5]/70 hover:text-[#181310] hover:bg-[#F0A352] transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: The Certificate Document Canvas */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#C96F3B]/30">
              {inspectCert.image ? (
                /* Real Certificate Document Viewer */
                <div className="space-y-5">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#C96F3B]/50 bg-[#0C0A09] shadow-2xl group">
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[460px] overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-[#181310] to-[#0E0C0A]">
                      <Image
                        src={inspectCert.image}
                        alt={inspectCert.title}
                        width={900}
                        height={650}
                        className="w-full h-full object-contain rounded-lg drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                        priority
                      />
                    </div>

                    {/* Holographic Laser Horizon Line */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-b from-transparent via-[#F0A352]/10 to-transparent animate-pulse" />
                    </div>
                  </div>

                  {/* Document Verification & Action Bar */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-[#C96F3B]/35 bg-[#181310]/95 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono shadow-md">
                    <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className="p-2.5 rounded-xl bg-[#2D1E16] border border-[#F0A352]/40 text-[#34D399] shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#34D399]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#F5EFE5] text-sm">
                            {inspectCert.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-bold">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-[#F5EFE5]/70 space-y-0.5">
                          <p>
                            <span className="text-[#F0A352]">Credential ID:</span>{" "}
                            {inspectCert.credentialId}
                            {inspectCert.issueDate && ` · Date: ${inspectCert.issueDate}`}
                          </p>
                          {inspectCert.signee && (
                            <p className="text-[10px] text-[#FFE8B8]/80">
                              Signee: {inspectCert.signee}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {inspectCert.pdfUrl && (
                      <a
                        href={inspectCert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F0A352] text-[#181310] font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-[#FFE8B8] transition-all shadow-[0_0_20px_rgba(240,163,82,0.35)] shrink-0 hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Official PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                /* Guilloche Certificate Diploma Canvas Fallback */
                <div className="relative rounded-2xl p-6 sm:p-8 border-2 border-[#C96F3B]/40 bg-gradient-to-br from-[#1E1713] via-[#14100E] to-[#1E1713] shadow-inner text-center overflow-hidden">
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#F0A352]/60" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#F0A352]/60" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#F0A352]/60" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#F0A352]/60" />

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1E16] border border-[#F0A352]/40 text-xs font-mono text-[#F0A352] mb-3">
                    <Award className="w-3.5 h-3.5 text-[#F0A352]" />
                    <span>{inspectCert.issuer}</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#F5EFE5] tracking-tight mb-2">
                    {inspectCert.title}
                  </h4>

                  <p className="text-xs sm:text-sm font-serif italic text-[#FFE8B8] mb-4">
                    Awarded to{" "}
                    <span className="font-bold text-[#F5EFE5] not-italic">
                      ASLI MICH JOSE J
                    </span>
                  </p>

                  <p className="text-xs sm:text-sm text-[#F5EFE5]/80 font-sans font-light max-w-xl mx-auto leading-relaxed mb-6">
                    {inspectCert.description}
                  </p>

                  <div className="p-4 rounded-xl border border-dashed border-[#F0A352]/40 bg-[#181310]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2.5 text-left">
                      <FileCheck className="w-5 h-5 text-[#34D399] shrink-0" />
                      <div>
                        <span className="font-bold text-[#F5EFE5] block">
                          Verified Accreditation
                        </span>
                        <span className="text-[#F0A352] text-[11px]">
                          Official Curriculum Verified &amp; Completed
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Competencies & Details Matrix */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#F0A352] block mb-2 font-bold">
                  Accredited Competencies &amp; Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {inspectCert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-mono text-[#F5EFE5] bg-[#221B17] border border-[#C96F3B]/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-[#C96F3B]/30 bg-[#1D1714] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#F5EFE5]/70">
              <span className="text-[#F0A352] truncate max-w-full text-center sm:text-left">
                Credential ID: {inspectCert.credentialId || "AZ-900 / Official Verified"}
              </span>
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#F0A352] text-[#181310] font-bold hover:brightness-110 transition-all shadow-sm text-center min-h-[40px] flex items-center justify-center"
              >
                Close [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
