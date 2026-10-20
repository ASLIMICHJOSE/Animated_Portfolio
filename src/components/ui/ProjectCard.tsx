"use client";

import React from "react";
import Image from "next/image";
import { Project } from "@/data/portfolio";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      tabIndex={0}
      aria-label={`Project: ${project.title}`}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-[#C96F3B]/25 hover:border-[#F0A352]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#C96F3B]/20 flex flex-col focus:outline-none focus:ring-2 focus:ring-[#F0A352]"
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#201C19] via-[#201C19]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-radial from-transparent to-[#201C19]/60" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#201C19]/80 backdrop-blur-md text-[#F0A352] border border-[#C96F3B]/30 flex items-center gap-1.5 shadow-sm">
            <span className="text-[10px]">0{index + 1}</span>
            <span className="text-[#F5EFE5]/40">•</span>
            <span>{project.category}</span>
          </span>


        </div>

        {/* Subtle Golden Sheen Hover Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-750 pointer-events-none bg-gradient-to-tr from-transparent via-[#F0A352]/10 to-transparent" />
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10 bg-[#201C19]/90 backdrop-blur-sm">
        <div>
          {/* Title & Year */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5EFE5] group-hover:text-[#F0A352] transition-colors duration-300">
              {project.title}
            </h3>
            <span className="text-xs font-mono text-[#F5EFE5]/40">{project.year}</span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#F5EFE5]/75 font-sans leading-relaxed mb-6 font-light">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-6" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-[#F5EFE5]/85 bg-[#392820]/80 border border-[#C96F3B]/20 group-hover:border-[#C96F3B]/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-between pt-4 border-t border-[#C96F3B]/15">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5EFE5]/70 hover:text-[#F0A352] transition-colors px-2.5 py-1 rounded-md hover:bg-[#392820]"
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F0A352] hover:text-[#F5EFE5] bg-[#C96F3B]/20 hover:bg-[#C96F3B] px-3 py-1.5 rounded-full border border-[#C96F3B]/40 transition-all duration-300 shadow-sm"
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
