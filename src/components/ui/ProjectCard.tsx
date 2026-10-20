"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Project } from "@/data/portfolio";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      tabIndex={0}
      aria-label={`Project: ${project.title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="project-discovery-card group relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/30 hover:border-[#F0A352] transition-all duration-700 hover:shadow-2xl hover:shadow-[#C96F3B]/30 flex flex-col focus:outline-none focus:ring-2 focus:ring-[#F0A352]"
      style={{ perspective: "1000px" }}
    >
      {/* Motion Graphics Discovery Stream Connector Node */}
      <div className="absolute top-0 left-6 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#F0A352] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0A352] shadow-sm shadow-[#F0A352]" />
        </div>
      </div>

      {/* Top Border Flow Light Flare (Active on discovery / hover) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Visual Header / Image Container */}
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#201C19]">
        {/* Anime project illustration */}
        <Image
          src={project.image}
          alt={`Preview of ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus:scale-105"
        />

        {/* Ambient Gradient Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-[#201C19]/35 to-transparent opacity-85 group-hover:opacity-65 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-radial from-transparent to-[#201C19]/60" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#201C19]/85 backdrop-blur-md text-[#F0A352] border border-[#C96F3B]/40 flex items-center gap-1.5 shadow-md">
            <span className="text-[10px] font-bold">DISCOVER 0{index + 1}</span>
            <span className="text-[#F5EFE5]/40">•</span>
            <span>{project.category}</span>
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#392820]/90 text-[#F5EFE5]/75 border border-[#C96F3B]/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#F0A352]" />
            <span>Active</span>
          </span>
        </div>

        {/* Subtle Golden Sheen Hover Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-[#F0A352]/15 to-transparent" />
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10 bg-[#201C19]/90 backdrop-blur-md">
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
                className="px-2.5 py-1 rounded-md text-xs font-mono text-[#F5EFE5]/85 bg-[#392820]/90 border border-[#C96F3B]/25 group-hover:border-[#C96F3B]/50 transition-colors"
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F0A352] hover:text-[#F5EFE5] bg-[#C96F3B]/25 hover:bg-[#C96F3B] px-3.5 py-1.5 rounded-full border border-[#C96F3B]/50 hover:border-[#F0A352] transition-all duration-300 shadow-md shadow-[#C96F3B]/20"
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
