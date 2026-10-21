"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Project } from "@/data/portfolio";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
  totalProjects?: number;
  isSelected?: boolean;
  onSelectProject?: (project: Project) => void;
}

export default function ProjectCard({
  project,
  index,
  totalProjects = 5,
  isSelected = false,
  onSelectProject,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const formattedNum = `0${index + 1}`;

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      aria-label={`Project ${formattedNum}: ${project.title}`}
      onClick={() => onSelectProject?.(project)}
      className={`group relative w-full h-full rounded-3xl overflow-hidden glass-panel border flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#F0A352] bg-[#181310] transition-all duration-300 select-none cursor-pointer ${
        isSelected
          ? "border-[#F0A352] ring-2 ring-[#F0A352]/50 shadow-[0_0_40px_rgba(240,163,82,0.35)]"
          : "border-[#C96F3B]/35 hover:border-[#F0A352] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.92)]"
      }`}
    >
      {/* Background Project Image with Cinematic Gradient */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src={project.image}
          alt={`Preview of ${project.title}`}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 95vw, 85vw"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 brightness-[0.70] contrast-[1.1]"
        />
        {/* Multilayer gradient: ensures top tab and bottom text have 100% crystal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-[#181310]/65 to-[#181310]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181310]/85 via-transparent to-[#181310]/95" />
      </div>

      {/* Dim Overlay when card is stacked underneath (Controlled by GSAP) */}
      <div className="card-dim-overlay absolute inset-0 bg-[#0E0C0A] opacity-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl" />

      {/* Top Border Amber Glow Flare */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent transition-opacity duration-500 z-20 ${
          isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100"
        }`}
      />

      {/* 1. TACTILE TOP TAB HEADER: Remains permanently exposed & touchable when stacked */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectProject?.(project);
        }}
        className={`px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b transition-colors relative z-20 cursor-pointer ${
          isSelected
            ? "bg-[#281F1B] border-[#F0A352]"
            : "bg-[#1D1714]/92 backdrop-blur-md border-[#C96F3B]/30 hover:bg-[#281F1B] hover:border-[#F0A352]/60"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
              isSelected
                ? "bg-[#F0A352] text-[#181310] ring-2 ring-[#F0A352]/40"
                : "bg-[#F0A352]/20 text-[#F0A352] border border-[#F0A352]/45 group-hover:bg-[#F0A352]/30"
            }`}
          >
            {formattedNum}
          </span>
          <span className="text-xs sm:text-sm font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors truncate max-w-[130px] sm:max-w-xs">
            {project.title}
          </span>
          <span className="text-[10px] font-mono text-[#F5EFE5]/50 uppercase tracking-wider hidden md:inline">
            • {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-[#F0A352]">
          <span className="text-[11px] text-[#FFE8B8]/80 hidden sm:inline">{project.year}</span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              isSelected
                ? "bg-[#F0A352] text-[#181310] shadow-[0_0_12px_#F0A352]"
                : "bg-[#2E2018] border border-[#C96F3B]/35 text-[#F0A352] group-hover:border-[#F0A352] group-hover:bg-[#F0A352] group-hover:text-[#181310]"
            }`}
          >
            <span>{isSelected ? "Inspecting" : "Inspect"}</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 2. BOTTOM CONTENT: Clean, reduced text, bold title, tags & action links */}
      <div className="p-5 sm:p-8 relative z-20 flex flex-col justify-end">
        {/* Title */}
        <h3 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors duration-300 tracking-tight mb-2">
          {project.title}
        </h3>

        {/* Short, crisp description */}
        <p className="text-xs sm:text-sm text-[#F5EFE5]/80 font-sans font-light leading-relaxed max-w-2xl mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech tags & links row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C96F3B]/25">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-mono text-[#F5EFE5]/85 bg-[#201C19]/80 border border-[#C96F3B]/25 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5EFE5]/80 hover:text-[#F0A352] transition-colors px-3 py-1.5 rounded-lg bg-[#201C19]/80 hover:bg-[#2D1E16] border border-[#C96F3B]/25 backdrop-blur-sm"
                aria-label={`View source code for ${project.title}`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#201C19] bg-gradient-to-r from-[#F0A352] to-[#FFE8B8] hover:brightness-110 px-4 py-1.5 rounded-full transition-all duration-300 shadow-md shadow-[#F0A352]/25"
                aria-label={`View live project ${project.title}`}
              >
                <span>Live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
