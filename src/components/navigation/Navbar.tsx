"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Send } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["hero", "about", "skills", "projects", "journey", "contact"];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Intro", href: "#hero", id: "hero", label: "01" },
    { name: "About", href: "#about", id: "about", label: "02" },
    { name: "Skills", href: "#skills", id: "skills", label: "03" },
    { name: "Projects", href: "#projects", id: "projects", label: "04" },
    { name: "Journey", href: "#journey", id: "journey", label: "05" },
    { name: "Contact", href: "#contact", id: "contact", label: "06" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 sm:py-5 px-4 sm:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Monogram */}
        <Link
          href="#hero"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C96F3B] rounded-full p-1"
          aria-label="Asli Mich Jose portfolio home"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C96F3B] to-[#392820] border border-[#F0A352]/40 flex items-center justify-center shadow-md shadow-[#C96F3B]/20 transition-transform duration-300 group-hover:scale-105">
            <span className="font-serif font-bold text-sm tracking-wider text-[#F5EFE5]">AMJ</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif font-bold text-sm text-[#F5EFE5] tracking-wide group-hover:text-[#F0A352] transition-colors">
              ASLI MICH JOSE
            </span>
            <span className="text-[10px] font-mono text-[#F0A352]/80 tracking-widest uppercase">
              Creative Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Pill */}
        <nav
          className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-500 ${
            scrolled
              ? "bg-[#201C19]/85 backdrop-blur-xl border border-[#C96F3B]/30 shadow-xl shadow-black/40"
              : "bg-[#201C19]/50 backdrop-blur-md border border-[#F5EFE5]/10"
          }`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 group ${
                  isActive
                    ? "text-[#F5EFE5] bg-[#C96F3B]/35 border border-[#C96F3B]/50 font-medium"
                    : "text-[#F5EFE5]/75 hover:text-[#F0A352] hover:bg-[#392820]/40"
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F0A352]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA and Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-[#F5EFE5] bg-gradient-to-r from-[#C96F3B] to-[#9E472D] hover:brightness-110 border border-[#F0A352]/40 shadow-md shadow-[#C96F3B]/20 transition-all duration-300 active:scale-95"
          >
            <span>Connect</span>
            <Send className="w-3 h-3" />
          </a>

          {/* Mobile menu trigger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-[#201C19]/80 backdrop-blur-md border border-[#C96F3B]/30 text-[#F5EFE5] hover:text-[#F0A352] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F3B]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[#201C19]/95 backdrop-blur-2xl pointer-events-auto flex flex-col justify-between p-8 animate-in fade-in duration-300"
          style={{ top: "0px", height: "100vh" }}
        >
          <div className="flex items-center justify-between border-b border-[#C96F3B]/20 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C96F3B] flex items-center justify-center text-xs font-serif font-bold">
                AMJ
              </div>
              <span className="font-serif font-bold text-sm tracking-wide">
                ASLI MICH JOSE
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border border-[#C96F3B]/30 text-[#F5EFE5]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-5 py-8" aria-label="Mobile Navigation">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-[#C96F3B]/10 text-lg font-serif tracking-wide text-[#F5EFE5] hover:text-[#F0A352] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#F0A352]">0{index + 1}</span>
                  <span>{link.name}</span>
                </div>
                <span className="text-xs font-mono text-[#F0A352]/70 uppercase">Chapter 0{index + 1}</span>
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-[#C96F3B]/20 flex flex-col gap-4">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center rounded-full text-sm font-medium tracking-wide bg-gradient-to-r from-[#C96F3B] to-[#9E472D] text-[#F5EFE5] shadow-lg shadow-[#C96F3B]/30"
            >
              Get In Touch
            </a>
            <p className="text-xs text-center text-[#F5EFE5]/50 font-mono">
              Cinematic Developer Experience
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
