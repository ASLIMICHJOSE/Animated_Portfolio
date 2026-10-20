"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { initGSAP } from "@/lib/animations";

interface ConduitNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export default function ContinuousSectionConduit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);
  const tracerHeadRef = useRef<SVGCircleElement | null>(null);
  const tracerGlowRef = useRef<SVGCircleElement | null>(null);

  const [pathD, setPathD] = useState<string>("");
  const [nodes, setNodes] = useState<ConduitNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string>("hero");

  // Dynamically compute the unified, continuous spline through all sections
  const updatePathGeometry = useCallback(() => {
    const mainEl = document.getElementById("main-content");
    if (!mainEl) return;

    const mainRect = mainEl.getBoundingClientRect();
    const mainTop = window.scrollY + mainRect.top;
    const width = mainEl.offsetWidth;

    const getElPoint = (selector: string, relX = 0.5, relY = 0.5) => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const y = window.scrollY + r.top - mainTop + r.height * relY;
      const x = r.left - mainRect.left + r.width * relX;
      return { x, y };
    };

    // Landmark Anchors across all sections with subtle, unobtrusive alignment
    const heroPoint = getElPoint("#hero", 0.5, 0.88) || { x: width * 0.5, y: 750 };
    const aboutEntrance = getElPoint("#about", 0.38, 0.22) || { x: width * 0.38, y: 1250 };
    const aboutMid = getElPoint("#about", 0.62, 0.72) || { x: width * 0.62, y: 1800 };
    const skillsEntrance = getElPoint("#skills", 0.42, 0.28) || { x: width * 0.42, y: 2450 };
    const skillsMid = getElPoint("#skills", 0.58, 0.72) || { x: width * 0.58, y: 3100 };
    
    // Projects: Runs gently through the central gutter behind cards, never cutting over them
    const projectsEntrance = getElPoint("#projects", 0.5, 0.14) || { x: width * 0.5, y: 3800 };
    const projectsMid = getElPoint("#projects", 0.5, 0.54) || { x: width * 0.5, y: 4600 };
    const projectsExit = getElPoint("#projects", 0.5, 0.92) || { x: width * 0.5, y: 5250 };
    
    // Journey Section anchors: exactly down the center timeline axis (Straight vertical conduit)
    const journeyEntrance = getElPoint("#journey", 0.5, 0.16) || { x: width * 0.5, y: 5600 };
    const journeyMid = getElPoint("#journey", 0.5, 0.52) || { x: width * 0.5, y: 6250 };
    const journeyExit = getElPoint("#journey", 0.5, 0.88) || { x: width * 0.5, y: 6900 };

    // Contact Section anchors: sweeping poetic curve framing the sanctuary scene
    const contactSweep1 = getElPoint("#contact", 0.32, 0.2) || { x: width * 0.32, y: 7550 };
    const contactSweep2 = getElPoint("#contact", 0.68, 0.48) || { x: width * 0.68, y: 8100 };
    const contactSweep3 = getElPoint("#contact", 0.4, 0.76) || { x: width * 0.4, y: 8550 };
    const contactFooter = getElPoint("#contact", 0.5, 0.96) || { x: width * 0.5, y: 8880 };

    const points = [
      heroPoint,
      aboutEntrance,
      aboutMid,
      skillsEntrance,
      skillsMid,
      projectsEntrance,
      projectsMid,
      projectsExit,
      journeyEntrance,
      journeyMid,
      journeyExit,
      contactSweep1,
      contactSweep2,
      contactSweep3,
      contactFooter,
    ];

    // Build a seamless, organic S-curve spline joining all landmark anchors
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midY = (curr.y + next.y) / 2;
      d += ` C ${curr.x.toFixed(1)} ${midY.toFixed(1)}, ${next.x.toFixed(1)} ${midY.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }

    setPathD(d);

    // Section transition hubs on the line
    setNodes([
      { id: "hero", label: "PROLOGUE // ORIGIN", x: heroPoint.x, y: heroPoint.y },
      { id: "about", label: "ACT 01 // ESSENCE", x: aboutEntrance.x, y: aboutEntrance.y },
      { id: "skills", label: "ACT 02 // TOOLKIT", x: skillsEntrance.x, y: skillsEntrance.y },
      { id: "projects", label: "ACT 03 // SHOWCASE", x: projectsEntrance.x, y: projectsEntrance.y },
      { id: "journey", label: "ACT 04 // ODYSSEY", x: journeyEntrance.x, y: journeyEntrance.y },
      { id: "contact", label: "ACT 05 // SANCTUARY", x: contactSweep1.x, y: contactSweep1.y },
    ]);
  }, []);

  useEffect(() => {
    updatePathGeometry();
    const handleResize = () => {
      updatePathGeometry();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    const timer = setTimeout(updatePathGeometry, 600);
    const timer2 = setTimeout(updatePathGeometry, 2000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updatePathGeometry]);

  // GSAP ScrollTrigger to scrub the unbroken conduit and energy tracer
  useEffect(() => {
    if (!pathD || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const { gsap, ScrollTrigger } = initGSAP();
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength ? path.getTotalLength() : 8000;

    gsap.set([path, glowPath], {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Position tracer head immediately at initial point
    if (path.getPointAtLength) {
      const startPoint = path.getPointAtLength(0);
      if (tracerHeadRef.current) {
        tracerHeadRef.current.setAttribute("cx", String(startPoint.x));
        tracerHeadRef.current.setAttribute("cy", String(startPoint.y));
      }
      if (tracerGlowRef.current) {
        tracerGlowRef.current.setAttribute("cx", String(startPoint.x));
        tracerGlowRef.current.setAttribute("cy", String(startPoint.y));
      }
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#main-content",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const currentOffset = (1 - self.progress) * pathLength;
          path.style.strokeDashoffset = String(currentOffset);
          if (glowPath) {
            glowPath.style.strokeDashoffset = String(currentOffset);
          }

          // Move the energy tracer along the unbroken path
          if (path.getPointAtLength) {
            const point = path.getPointAtLength(pathLength - currentOffset);
            if (tracerHeadRef.current) {
              tracerHeadRef.current.setAttribute("cx", String(point.x));
              tracerHeadRef.current.setAttribute("cy", String(point.y));
            }
            if (tracerGlowRef.current) {
              tracerGlowRef.current.setAttribute("cx", String(point.x));
              tracerGlowRef.current.setAttribute("cy", String(point.y));
            }

            const sections = [
              { id: "hero", progress: 0.04 },
              { id: "about", progress: 0.18 },
              { id: "skills", progress: 0.36 },
              { id: "projects", progress: 0.56 },
              { id: "journey", progress: 0.74 },
              { id: "contact", progress: 0.92 },
            ];

            let active = sections[0].id;
            for (let i = sections.length - 1; i >= 0; i--) {
              if (self.progress >= sections[i].progress - 0.06) {
                active = sections[i].id;
                break;
              }
            }
            setActiveNodeId(active);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pathD]);

  if (!pathD) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-55"
      aria-hidden="true"
    >
      <svg className="w-full h-full overflow-visible">
        <defs>
          {/* Dim, Tasteful, Atmospheric Autumn Gradient */}
          <linearGradient id="globalConduitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C96F3B" stopOpacity="0.22" />
            <stop offset="25%" stopColor="#D97736" stopOpacity="0.38" />
            <stop offset="50%" stopColor="#C96F3B" stopOpacity="0.32" />
            <stop offset="75%" stopColor="#F0A352" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#9E472D" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* 1. Subtle Ambient Filament (Dim guide) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(201, 111, 59, 0.12)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* 2. Soft Whispering Underlay (Ultra dim glow) */}
        <path
          ref={glowPathRef}
          d={pathD}
          fill="none"
          stroke="rgba(240, 163, 82, 0.12)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 3. Core Slender Flow Stream (Clean, dim, non-distracting) */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#globalConduitGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* 4. Section Interconnection Hubs (Dim, tasteful landmarks) */}
        {nodes.map((node) => {
          const isCurrent = activeNodeId === node.id;
          return (
            <g key={node.id} className="transition-opacity duration-300">
              {/* Outer subtle halo ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? "10" : "6"}
                fill="none"
                stroke={isCurrent ? "#F0A352" : "rgba(201, 111, 59, 0.3)"}
                strokeWidth="1"
                opacity={isCurrent ? "0.55" : "0.2"}
              />

              {/* Core Hub Bead */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? "4" : "2.5"}
                fill={isCurrent ? "#FFF5E0" : "#C96F3B"}
                stroke="#F0A352"
                strokeWidth="1"
                opacity={isCurrent ? "0.85" : "0.4"}
              />

              {/* Floating Act Label (Dim text so content stays prioritized) */}
              <text
                x={node.x + 12}
                y={node.y + 3}
                fill={isCurrent ? "rgba(240, 163, 82, 0.6)" : "rgba(245, 239, 229, 0.22)"}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="normal"
                letterSpacing="1"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* 5. Gliding Energy Tracer Orb (Small, dim, non-distracting) */}
        <circle
          ref={tracerGlowRef}
          cx="-100"
          cy="-100"
          r="7"
          fill="#F0A352"
          opacity="0.18"
        />
        <circle
          ref={tracerHeadRef}
          cx="-100"
          cy="-100"
          r="3"
          fill="#FFE8B8"
          stroke="#F0A352"
          strokeWidth="1.5"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}
