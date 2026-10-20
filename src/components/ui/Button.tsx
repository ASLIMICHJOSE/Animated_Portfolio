"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "amber";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  external = false,
  icon,
  ariaLabel,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C96F3B]/50 active:scale-[0.98] select-none group";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs tracking-wider uppercase gap-2",
    md: "px-6 py-3 text-sm tracking-wide gap-2.5",
    lg: "px-8 py-3.5 text-base tracking-wide gap-3",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#C96F3B] to-[#9E472D] text-[#F5EFE5] hover:brightness-110 shadow-lg shadow-[#C96F3B]/25 hover:shadow-[#C96F3B]/40 border border-[#F0A352]/30",
    amber:
      "bg-gradient-to-r from-[#F0A352] to-[#C96F3B] text-[#201C19] font-semibold hover:brightness-105 shadow-lg shadow-[#F0A352]/20 border border-[#F5EFE5]/40",
    outline:
      "bg-[#201C19]/60 backdrop-blur-md text-[#F5EFE5] border border-[#C96F3B]/40 hover:border-[#F0A352] hover:bg-[#392820]/80 hover:text-white shadow-sm",
    ghost:
      "bg-transparent text-[#F5EFE5]/85 hover:text-[#F0A352] hover:bg-[#F5EFE5]/5",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          aria-label={ariaLabel}
        >
          {children}
          {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} aria-label={ariaLabel}>
        {children}
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </button>
  );
}
