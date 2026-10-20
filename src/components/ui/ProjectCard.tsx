"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Project } from "@/data/portfolio";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt rotation (-7° to +7°)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
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

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      aria-label={`Project: ${project.title}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-discovery-card group relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/30 hover:border-[#F0A352] flex flex-col focus:outline-none focus:ring-2 focus:ring-[#F0A352] will-change-transform"
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
      {/* Specular 3D Holographic Glare Layer */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.22) 0%, rgba(255, 232, 184, 0.08) 35%, transparent 65%)`,
          }}
        />
      )}

      {/* Discovery Node Beacon (Smooth non-flickering glowing aura) */}
      <div className="absolute top-0 left-6 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#F0A352] opacity-40 scale-125" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0A352] shadow-sm shadow-[#F0A352]" />
        </div>
      </div>

      {/* Top Border Flow Light Flare */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Visual Header / Image Container */}
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#201C19]">
        <Image
          src={project.image}
          alt={`Preview of ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-focus:scale-108"
        />

        {/* Ambient Gradient Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-[#201C19]/35 to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#201C19]/90 backdrop-blur-md text-[#F0A352] border border-[#C96F3B]/40 flex items-center gap-1.5 shadow-md">
            <span className="text-[10px] font-bold">PROJECT 0{index + 1}</span>
            <span className="text-[#F5EFE5]/40">•</span>
            <span>{project.category}</span>
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#392820]/95 text-[#F5EFE5]/85 border border-[#C96F3B]/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#F0A352]" />
            <span>Featured</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10 bg-[#201C19]/95 backdrop-blur-md">
        <div>
          {/* Title & Year */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors duration-300">
              {project.title}
            </h3>
            <span className="text-xs font-mono text-[#F0A352]/80">{project.year}</span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#F5EFE5]/80 font-sans leading-relaxed mb-6 font-light">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-6" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-[#F5EFE5]/85 bg-[#392820]/90 border border-[#C96F3B]/25 group-hover:border-[#F0A352]/50 group-hover:bg-[#4A3326] transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-between pt-4 border-t border-[#C96F3B]/20">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5EFE5]/75 hover:text-[#F0A352] transition-colors px-2.5 py-1 rounded-md hover:bg-[#392820]"
                  aria-label={`View source code for ${project.title} on GitHub`}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F0A352] hover:text-[#F5EFE5] bg-[#C96F3B]/25 hover:bg-[#C96F3B] px-3.5 py-1.5 rounded-full border border-[#C96F3B]/50 hover:border-[#F0A352] transition-all duration-300 shadow-md shadow-[#C96F3B]/20 group-hover:scale-105"
                aria-label={`View live demo of ${project.title}`}
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
