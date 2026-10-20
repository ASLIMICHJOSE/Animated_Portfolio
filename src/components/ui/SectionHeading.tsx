"use client";

import React from "react";

interface SectionHeadingProps {
  number: string;
  categoryLabel?: string;
  title: string;
  highlightWord?: string;
  description?: string;
  alignment?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  number,
  categoryLabel,
  title,
  highlightWord,
  description,
  alignment = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = alignment === "center";

  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0A352] to-[#C96F3B] underline decoration-[#9E472D]/50 underline-offset-8">
          {highlightWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={`mb-16 md:mb-20 ${
        isCenter ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"
      } ${className}`}
    >
      {/* Chapter Badge */}
      <div
        className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#392820]/60 border border-[#C96F3B]/30 backdrop-blur-sm text-xs font-mono tracking-widest text-[#F0A352] mb-5 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C96F3B] animate-pulse" />
        <span>{number}</span>
        {categoryLabel && (
          <>
            <span className="text-[#F5EFE5]/30">|</span>
            <span className="tracking-wider text-[#F5EFE5]/90 font-mono text-[11px] uppercase">
              {categoryLabel}
            </span>
          </>
        )}
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5EFE5] tracking-tight leading-[1.15]">
        {renderTitle()}
      </h2>

      {/* Decorative Autumn Accent Line */}
      <div
        className={`flex items-center gap-3 my-5 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C96F3B]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#F0A352]" />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C96F3B]" />
      </div>

      {/* Description */}
      {description && (
        <p className="text-base sm:text-lg text-[#F5EFE5]/75 leading-relaxed font-sans font-light">
          {description}
        </p>
      )}
    </div>
  );
}
