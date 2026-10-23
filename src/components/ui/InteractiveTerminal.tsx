"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  X,
  CornerDownLeft,
  Sparkles,
  Wind,
  Volume2,
  VolumeX,
  Code2,
  FolderGit2,
  Mail,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { soundEngine } from "@/lib/soundEngine";

interface CommandOutput {
  id: string;
  type: "user" | "system" | "error" | "success";
  text: string;
  actions?: { label: string; action: () => void }[];
}

export default function InteractiveTerminal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: "welcome",
      type: "system",
      text: "AMJ Autumn Terminal v2.4 initialized. Type 'help' to inspect commands or tap quick pills below.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      soundEngine.playChime(659.25);
    }
  }, [isOpen]);

  // Auto-scroll outputs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs]);

  // Execute terminal command
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    soundEngine.playClick();

    // Add to user history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const userEntry: CommandOutput = {
      id: String(Date.now()),
      type: "user",
      text: `asli@mich-jose:~$ ${trimmed}`,
    };

    const parts = trimmed.toLowerCase().split(" ");
    const command = parts[0];
    const arg = parts.slice(1).join(" ");

    let responseEntry: CommandOutput;

    switch (command) {
      case "help":
        responseEntry = {
          id: String(Date.now() + 1),
          type: "system",
          text: `AVAILABLE COMMANDS:
• projects [query]  - Search and inspect projects (e.g. 'projects ai', 'projects ecommerce')
• skills            - Inspect all 5 engineering domains & core technologies
• gust | wind       - Unleash an autumn leaf whirlwind across the screen
• sound | audio     - Toggle ambient procedurally synthesized autumn audio
• contact           - Display direct communication channels & phone
• about             - Display identity, background & engineering focus
• clear             - Clean terminal history
• exit              - Close command center`,
        };
        break;

      case "projects":
        const filteredProjects = arg
          ? portfolioData.projects.filter(
              (p) =>
                p.title.toLowerCase().includes(arg) ||
                p.category.toLowerCase().includes(arg) ||
                p.techStack.some((t) => t.toLowerCase().includes(arg))
            )
          : portfolioData.projects;

        if (filteredProjects.length === 0) {
          responseEntry = {
            id: String(Date.now() + 1),
            type: "error",
            text: `No projects found matching "${arg}". Try 'projects' to list all.`,
          };
        } else {
          responseEntry = {
            id: String(Date.now() + 1),
            type: "success",
            text: `Found ${filteredProjects.length} curated exhibit(s):`,
            actions: filteredProjects.map((p) => ({
              label: `0${portfolioData.projects.indexOf(p) + 1} // ${p.title}`,
              action: () => {
                onClose();
                const el = document.getElementById("projects");
                el?.scrollIntoView({ behavior: "smooth" });
              },
            })),
          };
        }
        break;

      case "skills":
        responseEntry = {
          id: String(Date.now() + 1),
          type: "system",
          text: `CORE CAPABILITY ARCHITECTURE:
• Frontend Development: React.js, Next.js, TypeScript, Tailwind CSS, GSAP
• Backend & Systems: Node.js, Express.js, REST APIs, Supabase
• AI & Machine Learning: MongoDB Vector Search, Retrieval-Augmented Generation, AI Agents
• Database & Cloud: MongoDB, PostgreSQL, Microsoft Azure Cloud (AZ-900)
• Tools & Engineering: Git, GitHub, Turbopack, Agile Workflows`,
          actions: [
            {
              label: "Explore Skills Showcase ↗",
              action: () => {
                onClose();
                document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
              },
            },
          ],
        };
        break;

      case "gust":
      case "wind":
        window.dispatchEvent(new CustomEvent("summon-gust"));
        soundEngine.playWhirlwind();
        responseEntry = {
          id: String(Date.now() + 1),
          type: "success",
          text: "🍂 Autumn Whirlwind summoned! Maple leaves and stardust swirling across the viewport.",
        };
        break;

      case "sound":
      case "audio":
        const isMuted = soundEngine.toggleMute();
        responseEntry = {
          id: String(Date.now() + 1),
          type: isMuted ? "system" : "success",
          text: isMuted
            ? "🔇 Ambient Autumn Audio: Muted"
            : "🎵 Ambient Autumn Audio: Playing (procedural wind rustle & pentatonic chime active)",
        };
        break;

      case "contact":
        responseEntry = {
          id: String(Date.now() + 1),
          type: "success",
          text: `COMMUNICATION CHANNELS:
• Email: ${portfolioData.socials.email}
• Phone: ${portfolioData.socials.phone}
• GitHub: ${portfolioData.socials.github}
• LinkedIn: ${portfolioData.socials.linkedin}`,
          actions: [
            {
              label: "Jump to Contact Section",
              action: () => {
                onClose();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              },
            },
          ],
        };
        break;

      case "about":
        responseEntry = {
          id: String(Date.now() + 1),
          type: "system",
          text: `${portfolioData.personal.name}
${portfolioData.personal.title}
${portfolioData.personal.tagline}`,
          actions: [
            {
              label: "Read Full Bio",
              action: () => {
                onClose();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              },
            },
          ],
        };
        break;

      case "clear":
        setOutputs([]);
        setInput("");
        return;

      case "exit":
      case "quit":
        onClose();
        setInput("");
        return;

      default:
        responseEntry = {
          id: String(Date.now() + 1),
          type: "error",
          text: `Command not recognized: '${command}'. Type 'help' for options.`,
        };
        break;
    }

    setOutputs((prev) => [...prev, userEntry, responseEntry]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Command Center"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Background click to dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Terminal Window Canvas */}
      <div className="relative w-full sm:max-w-3xl h-[88vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl overflow-hidden glass-panel border border-[#F0A352]/40 bg-[#161210]/98 shadow-2xl flex flex-col justify-between">
        {/* Top Amber Flare */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent shadow-sm shadow-[#F0A352]" />

        {/* Window Title Bar */}
        <div className="px-5 py-3.5 border-b border-[#C96F3B]/30 bg-[#1F1814] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#C96F3B] inline-block opacity-80" />
              <span className="w-3 h-3 rounded-full bg-[#F0A352] inline-block opacity-80" />
              <span className="w-3 h-3 rounded-full bg-[#34D399] inline-block opacity-80" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-[#C96F3B]/30">
              <TerminalIcon className="w-4 h-4 text-[#F0A352]" />
              <span className="text-xs font-mono font-bold text-[#F5EFE5] tracking-wider">
                AMJ COMMAND CENTER // CLI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] font-mono text-[#F5EFE5]/50">
              ESC to exit
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#201C19] border border-[#C96F3B]/35 text-[#F5EFE5]/70 hover:text-[#181310] hover:bg-[#F0A352] transition-colors"
              aria-label="Close command terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick-Tap Action Pills for Touch / Fast Navigation */}
        <div className="px-4 py-2 border-b border-[#C96F3B]/20 bg-[#181310] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { label: "help", icon: <HelpCircle className="w-3 h-3" /> },
            { label: "projects", icon: <FolderGit2 className="w-3 h-3" /> },
            { label: "skills", icon: <Code2 className="w-3 h-3" /> },
            { label: "gust", icon: <Wind className="w-3 h-3 text-[#F0A352]" /> },
            { label: "sound", icon: <Volume2 className="w-3 h-3" /> },
            { label: "contact", icon: <Mail className="w-3 h-3" /> },
            { label: "clear", icon: <Trash2 className="w-3 h-3" /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => executeCommand(label)}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#201C19] text-[#F5EFE5]/80 hover:text-[#F0A352] hover:bg-[#2E2018] border border-[#C96F3B]/25 flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Terminal Output Log */}
        <div
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto space-y-3 font-mono text-xs text-[#F5EFE5]/90 scrollbar-thin scrollbar-thumb-[#C96F3B]/30"
        >
          {outputs.map((out) => (
            <div key={out.id} className="leading-relaxed whitespace-pre-wrap">
              {out.type === "user" && (
                <span className="text-[#F0A352] font-semibold">{out.text}</span>
              )}
              {out.type === "system" && (
                <span className="text-[#F5EFE5]/85">{out.text}</span>
              )}
              {out.type === "success" && (
                <span className="text-[#34D399] font-medium">{out.text}</span>
              )}
              {out.type === "error" && (
                <span className="text-[#FF6B6B] font-medium">{out.text}</span>
              )}

              {out.actions && out.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-1">
                  {out.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={act.action}
                      className="px-3 py-1.5 rounded-lg bg-[#281F1B] hover:bg-[#F0A352] text-[#F5EFE5] hover:text-[#181310] border border-[#C96F3B]/40 hover:border-[#F0A352] transition-all text-xs font-bold"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#C96F3B]/30 bg-[#1D1714] flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-mono font-bold text-[#F0A352] shrink-0 pl-1">
            amj@portfolio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. 'help', 'projects', 'gust')..."
            className="flex-1 bg-transparent text-[#F5EFE5] text-xs sm:text-sm font-mono outline-none placeholder:text-[#F5EFE5]/35"
          />
          <button
            onClick={() => executeCommand(input)}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-[#F0A352] text-[#181310] disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all shrink-0"
            aria-label="Send terminal command"
          >
            <CornerDownLeft className="w-4 h-4 font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
