"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Wind,
  Sparkles,
  Zap,
  RotateCcw,
  RotateCw,
  Compass,
  MousePointer,
  Sliders,
  X,
  ChevronRight,
  ShieldAlert,
  Power,
  RotateCcw as ResetIcon,
} from "lucide-react";

interface Leaf {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  angleSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  oscillationOffset: number;
  color: string;
  opacity: number;
  flipSpeed: number;
  flipAngle: number;
  isSettled: boolean;
  settleOffset: number;
  settleDepth: number; // Layer depth in pile
}

interface WindParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  color: string;
}

interface BlowerSparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

const AUTUMN_COLORS = [
  "#C96F3B", // Burnt orange
  "#9E472D", // Autumn rust
  "#D97736", // Amber red
  "#E89844", // Golden leaf
  "#B34D28", // Deep crimson leaf
  "#777957", // Olive green accent
  "#F0A352", // Golden highlight
  "#FFAA44", // Bright sunlit maple
];

const FULL_COVER_THRESHOLD = 20; // Number of settled leaves considered "fully covered"

export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Side Panel & Blower Deployment State
  // Kept tucked in the side panel by default unless visitor chooses to equip it!
  const [isBlowerEquipped, setIsBlowerEquipped] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Blower mechanical controls
  const [isBlowing, setIsBlowing] = useState(true);
  const [aimMode, setAimMode] = useState<"cursor" | "manual">("cursor");
  const [manualAngleDeg, setManualAngleDeg] = useState(-135); // -135° = pointing up-left
  const [isTurbo, setIsTurbo] = useState(false);
  const [piledCount, setPiledCount] = useState(0);
  const [isFullyCovered, setIsFullyCovered] = useState(false);
  const [isDraggingBlower, setIsDraggingBlower] = useState(false);

  // References for high-performance 60FPS loop
  const isBlowerEquippedRef = useRef(false);
  const isBlowingRef = useRef(true);
  const aimModeRef = useRef<"cursor" | "manual">("cursor");
  const manualAngleDegRef = useRef(-135);
  const isTurboRef = useRef(false);
  const turboTriggerRef = useRef(false);

  useEffect(() => {
    isBlowerEquippedRef.current = isBlowerEquipped;
  }, [isBlowerEquipped]);

  useEffect(() => {
    isBlowingRef.current = isBlowing;
  }, [isBlowing]);

  useEffect(() => {
    aimModeRef.current = aimMode;
  }, [aimMode]);

  useEffect(() => {
    manualAngleDegRef.current = manualAngleDeg;
  }, [manualAngleDeg]);

  useEffect(() => {
    isTurboRef.current = isTurbo;
  }, [isTurbo]);

  // Turbo burst trigger
  const triggerTurboBlast = useCallback(() => {
    turboTriggerRef.current = true;
    setIsTurbo(true);
    setTimeout(() => {
      setIsTurbo(false);
      turboTriggerRef.current = false;
    }, 1800);
  }, []);

  // Deploy blower helper (used when user opens side panel or clicks alert)
  const deployBlower = useCallback(() => {
    setIsBlowerEquipped(true);
    setIsSidePanelOpen(true);
    setIsBlowing(true);
  }, []);

  // Set angle helper
  const handleAngleChange = (deg: number) => {
    let normalized = deg % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    setManualAngleDeg(normalized);
    setAimMode("manual");
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Default dock coordinates (bottom right)
    let dockX = width - 120;
    let dockY = height - 95;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dockX = width - 120;
      dockY = height - 95;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Pointer & Mouse coordinates (normalized to viewport)
    let mouseX = width / 2;
    let mouseY = height / 3;

    // Track scroll state
    let currentScrollY = window.scrollY;
    let prevScrollY = currentScrollY;

    // Track AFK / Inactivity state
    let lastInteractionTime = Date.now();
    let isUserAfk = false;

    const registerActivity = () => {
      lastInteractionTime = Date.now();
      isUserAfk = false;
    };

    const handleScroll = () => {
      currentScrollY = window.scrollY;
      prevScrollY = currentScrollY;
      registerActivity();

      // When user scrolls down out of Hero:
      // All settled leaves dislodge smoothly and cascade down!
      if (currentScrollY > 70) {
        cascadeSettledLeaves();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Blower machine physics & transform state
    const blower = {
      x: dockX,
      y: dockY,
      targetX: dockX,
      targetY: dockY,
      vx: 0,
      vy: 0,
      angle: -Math.PI * 0.75, // pointing up-left by default
      targetAngle: -Math.PI * 0.75,
      isHeld: false,
      fanAngle: 0,
      opacity: 0, // Animates in when equipped
      radius: 45,
    };

    // Mouse & Touch handling
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      registerActivity();
      if (!isBlowerEquippedRef.current) return;

      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      // Check distance to blower for dragging
      const dist = Math.hypot(cx - blower.x, cy - blower.y);
      if (dist < 65) {
        blower.isHeld = true;
        setIsDraggingBlower(true);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      registerActivity();
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      mouseX = cx;
      mouseY = cy;

      if (blower.isHeld) {
        blower.targetX = Math.max(60, Math.min(width - 60, cx));
        blower.targetY = Math.max(60, Math.min(height - 60, cy));
      }
    };

    const handlePointerUp = () => {
      if (blower.isHeld) {
        blower.isHeld = false;
        setIsDraggingBlower(false);
      }
    };

    // Scroll wheel adjusts angle smoothly when hovered near blower or when manual
    const handleWheel = (e: WheelEvent) => {
      if (!isBlowerEquippedRef.current) return;
      const dist = Math.hypot(e.clientX - blower.x, e.clientY - blower.y);
      if (dist < 220 || aimModeRef.current === "manual") {
        const delta = e.deltaY * 0.004;
        blower.targetAngle += delta;
        const deg = Math.round((blower.targetAngle * 180) / Math.PI);
        setManualAngleDeg(deg);
        setAimMode("manual");
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Leaves creation & infinite streaming pool (Lightweight & airy count)
    const activeStreamTarget = width < 768 ? 10 : 16;
    let leafIdCounter = 0;

    const createLeaf = (initialRandomY = false): Leaf => ({
      id: leafIdCounter++,
      x: Math.random() * (width + 80) - 40,
      y: initialRandomY ? Math.random() * (height - 60) : -40 - Math.random() * 80,
      size: Math.random() * 8 + 14,
      speedX: (Math.random() - 0.5) * 1.4,
      speedY: Math.random() * 1.3 + 1.1,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.035,
      oscillationSpeed: Math.random() * 0.02 + 0.015,
      oscillationDistance: Math.random() * 25 + 15,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
      opacity: Math.random() * 0.35 + 0.65,
      flipSpeed: Math.random() * 0.035 + 0.02,
      flipAngle: Math.random() * Math.PI,
      isSettled: false,
      settleOffset: (Math.random() - 0.5) * 24,
      settleDepth: Math.floor(Math.random() * 4), // Stacking layers
    });

    // Initial leaves array
    const leaves: Leaf[] = Array.from({ length: activeStreamTarget }, () => createLeaf(true));
    const windParticles: WindParticle[] = [];
    const blowerSparkles: BlowerSparkle[] = [];

    // Cascade all settled leaves when page scrolls or user blasts them
    const cascadeSettledLeaves = () => {
      leaves.forEach((leaf) => {
        if (leaf.isSettled) {
          leaf.isSettled = false;
          leaf.speedY = Math.random() * 3.5 + 2.5; // downward burst
          leaf.speedX = (Math.random() - 0.5) * 4.0;
          leaf.angleSpeed = (Math.random() - 0.5) * 0.12;
          leaf.flipSpeed = Math.random() * 0.08 + 0.04;
        }
      });
      setPiledCount(0);
      setIsFullyCovered(false);
    };

    // Draw Maple Leaf shape
    const drawMapleLeaf = (
      context: CanvasRenderingContext2D,
      size: number,
      color: string,
      opacity: number,
      flipAngle: number
    ) => {
      context.save();
      const scaleX = Math.cos(flipAngle);
      context.scale(scaleX, 1);
      context.globalAlpha = opacity;
      context.fillStyle = color;

      context.beginPath();
      context.moveTo(0, -size);
      context.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.5, -size * 0.5, size * 0.8, -size * 0.4);
      context.bezierCurveTo(size * 0.5, -size * 0.1, size * 0.7, size * 0.3, size * 0.5, size * 0.6);
      context.bezierCurveTo(size * 0.2, size * 0.4, size * 0.1, size * 0.7, 0, size * 0.9);
      context.bezierCurveTo(-size * 0.1, size * 0.7, -size * 0.2, size * 0.4, -size * 0.5, size * 0.6);
      context.bezierCurveTo(-size * 0.7, size * 0.3, -size * 0.5, -size * 0.1, -size * 0.8, -size * 0.4);
      context.bezierCurveTo(-size * 0.5, -size * 0.5, -size * 0.3, -size * 0.8, 0, -size);
      context.closePath();
      context.fill();

      // Leaf Stem
      context.strokeStyle = "rgba(57, 40, 32, 0.6)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, size * 0.4);
      context.lineTo(0, size * 1.15);
      context.stroke();

      context.restore();
    };

    // Draw Blower Machine with glowing indicator when covered
    const drawBlower = (
      context: CanvasRenderingContext2D,
      bx: number,
      by: number,
      bAngle: number,
      fanRot: number,
      blowing: boolean,
      glowing: boolean,
      glowRatio: number,
      currentOpacity: number
    ) => {
      if (currentOpacity <= 0.01) return;

      context.save();
      context.globalAlpha = currentOpacity;
      context.translate(bx, by);

      // FULLY COVERED GLOWING INDICATOR AURA
      if (glowing || glowRatio > 0.05) {
        context.save();
        const pulse = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
        const outerRadius = 55 + pulse * 20;

        // Radiant amber/gold expanding glow ring
        const glowGrad = context.createRadialGradient(0, 0, 10, 0, 0, outerRadius);
        glowGrad.addColorStop(0, `rgba(240, 163, 82, ${0.45 * glowRatio})`);
        glowGrad.addColorStop(0.5, `rgba(255, 183, 3, ${0.28 * glowRatio * pulse})`);
        glowGrad.addColorStop(1, "rgba(201, 111, 59, 0)");

        context.beginPath();
        context.arc(0, 0, outerRadius, 0, Math.PI * 2);
        context.fillStyle = glowGrad;
        context.fill();

        // Pulsing notification beacon ring
        context.beginPath();
        context.arc(0, 0, 36 + pulse * 14, 0, Math.PI * 2);
        context.strokeStyle = `rgba(240, 163, 82, ${0.7 * glowRatio * (1 - pulse)})`;
        context.lineWidth = 2.5;
        context.stroke();
        context.restore();
      }

      context.rotate(bAngle);

      // Cast shadow
      context.save();
      context.beginPath();
      context.ellipse(0, 18, 38, 14, 0, 0, Math.PI * 2);
      context.fillStyle = "rgba(0,0,0,0.5)";
      context.fill();
      context.restore();

      // Long Tapered Air Nozzle Tube
      context.beginPath();
      context.moveTo(18, -12);
      context.lineTo(82, -6);
      context.lineTo(82, 6);
      context.lineTo(18, 12);
      context.closePath();
      const nozzleGrad = context.createLinearGradient(18, 0, 82, 0);
      nozzleGrad.addColorStop(0, "#2D1E16");
      nozzleGrad.addColorStop(0.5, "#4A3326");
      nozzleGrad.addColorStop(1, glowing ? "#D97736" : "#392820");
      context.fillStyle = nozzleGrad;
      context.fill();

      // Nozzle border with glowing outline if covered
      context.strokeStyle = glowing ? "#F0A352" : "#C96F3B";
      context.lineWidth = glowing ? 2.5 : 1.5;
      if (glowing) {
        context.shadowColor = "#F0A352";
        context.shadowBlur = 12;
      }
      context.stroke();
      context.shadowBlur = 0;

      // Brass Accent Rings
      context.beginPath();
      context.rect(48, -9, 4, 18);
      context.rect(74, -7, 5, 14);
      context.fillStyle = glowing ? "#FFE3A8" : "#F0A352";
      context.fill();

      // Cylindrical Motor Housing
      context.beginPath();
      context.ellipse(0, 0, 26, 22, 0, 0, Math.PI * 2);
      const bodyGrad = context.createRadialGradient(-6, -6, 2, 0, 0, 26);
      bodyGrad.addColorStop(0, glowing ? "#8C5432" : "#684835");
      bodyGrad.addColorStop(0.7, "#392820");
      bodyGrad.addColorStop(1, "#201C19");
      context.fillStyle = bodyGrad;
      context.fill();

      context.strokeStyle = "#F0A352";
      context.lineWidth = glowing ? 3 : 2;
      context.stroke();

      // Rotating Impeller Fan
      context.save();
      context.rotate(fanRot);
      for (let b = 0; b < 6; b++) {
        context.rotate(Math.PI / 3);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(13, 4);
        context.lineTo(15, -2);
        context.closePath();
        context.fillStyle = glowing ? "#FFAA44" : "#F0A352";
        context.fill();
      }
      context.restore();

      // Intake Grille Outer Ring
      context.beginPath();
      context.arc(0, 0, 11, 0, Math.PI * 2);
      context.strokeStyle = glowing ? "#F0A352" : "rgba(240, 163, 82, 0.7)";
      context.lineWidth = 1.5;
      context.stroke();

      // Ergonomic Rear Handle
      context.beginPath();
      context.arc(-19, -13, 15, 0, Math.PI * 1.5, true);
      context.strokeStyle = glowing ? "#E89844" : "#C96F3B";
      context.lineWidth = 5.5;
      context.lineCap = "round";
      context.stroke();

      // Active Air Blast Cone & Wind Exhaust from Nozzle
      if (blowing) {
        context.save();
        const tipX = 82;
        const coneLength = isTurboRef.current ? 280 : 190;
        const coneSpread = isTurboRef.current ? 75 : 55;

        const blastGrad = context.createRadialGradient(tipX, 0, 5, tipX + 80, 0, coneLength);
        blastGrad.addColorStop(0, glowing ? "rgba(255, 210, 120, 0.9)" : "rgba(240, 163, 82, 0.85)");
        blastGrad.addColorStop(0.3, "rgba(245, 239, 229, 0.4)");
        blastGrad.addColorStop(1, "rgba(201, 111, 59, 0)");

        context.beginPath();
        context.moveTo(tipX, -6);
        context.lineTo(tipX + coneLength, -coneSpread);
        context.lineTo(tipX + coneLength, coneSpread);
        context.lineTo(tipX, 6);
        context.closePath();
        context.fillStyle = blastGrad;
        context.fill();

        // Dynamic Wind Breeze Streaks
        context.strokeStyle = "rgba(245, 239, 229, 0.65)";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(tipX + 10, -4);
        context.quadraticCurveTo(tipX + 70, -18, tipX + coneLength * 0.8, -coneSpread * 0.55);
        context.moveTo(tipX + 10, 4);
        context.quadraticCurveTo(tipX + 70, 18, tipX + coneLength * 0.8, coneSpread * 0.55);
        context.stroke();

        context.restore();
      }

      context.restore();
    };

    let time = 0;

    // Main 60 FPS Render Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth opacity transition for blower equip state
      const targetOpacity = isBlowerEquippedRef.current ? 1 : 0;
      blower.opacity += (targetOpacity - blower.opacity) * 0.12;

      // Check AFK state: on Hero section (scrollY < 100) and inactive for > 2.5s
      const isAtHero = currentScrollY < 100;
      const inactiveMs = Date.now() - lastInteractionTime;
      isUserAfk = isAtHero && inactiveMs > 2500;

      const blowingActive =
        isBlowerEquippedRef.current &&
        (isBlowingRef.current || blower.isHeld || isTurboRef.current);

      // 1. UPDATE BLOWER ANGLE & POSITION (Only active when equipped)
      if (isBlowerEquippedRef.current) {
        if (aimModeRef.current === "cursor") {
          const dx = mouseX - blower.x;
          const dy = mouseY - blower.y;
          if (Math.hypot(dx, dy) > 25) {
            blower.targetAngle = Math.atan2(dy, dx);
          }
        } else {
          blower.targetAngle = (manualAngleDegRef.current * Math.PI) / 180;
        }

        // Smooth angle interpolation
        let angleDiff = blower.targetAngle - blower.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        blower.angle += angleDiff * 0.18;

        // Smooth Blower Position Physics
        const spring = blower.isHeld ? 0.25 : 0.08;
        const friction = blower.isHeld ? 0.75 : 0.85;

        blower.vx += (blower.targetX - blower.x) * spring;
        blower.vx *= friction;
        blower.x += blower.vx;

        blower.vy += (blower.targetY - blower.y) * spring;
        blower.vy *= friction;
        blower.y += blower.vy;

        // Fan rotation
        blower.fanAngle += blowingActive ? 0.45 : 0.06;

        // Wind & Sparkle particle generation
        const nozzleDist = 82;
        const nozzleX = blower.x + Math.cos(blower.angle) * nozzleDist;
        const nozzleY = blower.y + Math.sin(blower.angle) * nozzleDist;

        if (blowingActive && (time % 2 === 0)) {
          const spread = (Math.random() - 0.5) * 0.5;
          const pAngle = blower.angle + spread;
          const pSpeed = (isTurboRef.current ? 18 : 10) + Math.random() * 5;

          windParticles.push({
            x: nozzleX,
            y: nozzleY,
            vx: Math.cos(pAngle) * pSpeed,
            vy: Math.sin(pAngle) * pSpeed,
            life: 0,
            maxLife: Math.random() * 22 + 16,
            size: Math.random() * 2.8 + 1.6,
            alpha: 0.85,
            color: isTurboRef.current ? "#FFE8B8" : "#F5EFE5",
          });
        }
      }

      // Check current settled count
      const currentSettled = leaves.filter((l) => l.isSettled).length;
      const heroCoverRatio = Math.min(1, currentSettled / FULL_COVER_THRESHOLD);
      const isFullyCov = currentSettled >= FULL_COVER_THRESHOLD;

      // Emit glowing sparkles if hero is covered
      if (isFullyCov && isBlowerEquippedRef.current && time % 4 === 0) {
        blowerSparkles.push({
          x: blower.x + (Math.random() - 0.5) * 60,
          y: blower.y + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() * 2.5 + 1.2,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 25 + 20,
        });
      }

      // Render Wind Particles
      for (let i = windParticles.length - 1; i >= 0; i--) {
        const wp = windParticles[i];
        wp.x += wp.vx;
        wp.y += wp.vy;
        wp.life++;
        wp.alpha = (1 - wp.life / wp.maxLife) * 0.8;

        if (wp.life >= wp.maxLife) {
          windParticles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = wp.alpha;
          ctx.fillStyle = wp.color;
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, wp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render Sparkles
      for (let i = blowerSparkles.length - 1; i >= 0; i--) {
        const sp = blowerSparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life++;
        sp.alpha = 1 - sp.life / sp.maxLife;

        if (sp.life >= sp.maxLife) {
          blowerSparkles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = sp.alpha;
          ctx.fillStyle = "#FFD166";
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Ground plane for hero accumulation (stacked autumn carpet)
      const heroBaseGroundY = height - 35;
      let settledCount = 0;

      // 2. INFINITE STREAMING LEAF ENGINE:
      // Active falling leaves should NEVER run dry!
      // If leaves settle or leave screen, keep the stream count full!
      const activeFallingCount = leaves.filter((l) => !l.isSettled).length;
      if (activeFallingCount < activeStreamTarget) {
        // Spawn fresh falling leaf from the top of the scrolling viewport
        leaves.push(createLeaf(false));
      }

      // Turbo Blast pulse trigger
      if (turboTriggerRef.current) {
        leaves.forEach((leaf) => {
          leaf.isSettled = false;
          const dx = leaf.x - blower.x;
          const dy = leaf.y - blower.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const force = 28;
          leaf.speedX = (dx / dist) * force + (Math.random() - 0.5) * 8;
          leaf.speedY = (dy / dist) * force - 6; // upward lift
          leaf.angleSpeed = (Math.random() - 0.5) * 0.3;
          leaf.flipSpeed = 0.12;
        });
      }

      const windReach = isTurboRef.current ? 420 : 310;
      const nozzleDist = 82;
      const nozzleX = blower.x + Math.cos(blower.angle) * nozzleDist;
      const nozzleY = blower.y + Math.sin(blower.angle) * nozzleDist;

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // 2A. BLOWER WIND INTERACTION (when equipped & active)
        if (blowingActive) {
          const dx = leaf.x - nozzleX;
          const dy = leaf.y - nozzleY;
          const distToNozzle = Math.hypot(dx, dy);

          if (distToNozzle < windReach) {
            const angleToLeaf = Math.atan2(dy, dx);
            let relAngle = angleToLeaf - blower.angle;
            while (relAngle < -Math.PI) relAngle += Math.PI * 2;
            while (relAngle > Math.PI) relAngle -= Math.PI * 2;

            const coneWidth = isTurboRef.current ? 0.85 : 0.65;
            if (Math.abs(relAngle) < coneWidth) {
              // Inside the wind blast!
              const strength = (1 - distToNozzle / windReach) * (isTurboRef.current ? 22 : 15);
              leaf.speedX += Math.cos(blower.angle) * strength * 0.5;
              leaf.speedY += Math.sin(blower.angle) * strength * 0.5;
              leaf.angleSpeed += (Math.random() - 0.5) * 0.15;
              leaf.flipSpeed += 0.05;

              // Dislodge any settled leaf instantly!
              if (leaf.isSettled) {
                leaf.isSettled = false;
              }
            }
          }
        }

        // 2B. HERO ACCUMULATION (When idle/AFK on hero section, leaves settle and cover hero)
        if (isAtHero && !leaf.isSettled && (isUserAfk || currentSettled < FULL_COVER_THRESHOLD)) {
          // Stacking height based on depth layer to cover hero naturally
          const layerOffset = leaf.settleDepth * 28 + leaf.settleOffset;
          const targetGround = heroBaseGroundY - layerOffset;

          if (leaf.y >= targetGround && leaf.speedY > 0) {
            leaf.isSettled = true;
            leaf.y = targetGround;
            leaf.speedX = 0;
            leaf.speedY = 0;
            leaf.angleSpeed = 0;
            leaf.flipSpeed = 0;
          }
        }

        // 2C. PHYSICS UPDATE:
        if (!leaf.isSettled) {
          // Continuous fall from top of current visible screen!
          leaf.x += leaf.speedX + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.6;
          leaf.y += leaf.speedY;
          leaf.angle += leaf.angleSpeed;
          leaf.flipAngle += leaf.flipSpeed;

          // Drag air friction
          leaf.speedX *= 0.96;
          if (leaf.speedY > 2.2) {
            leaf.speedY *= 0.98; // settle back towards terminal velocity
          }
        } else {
          settledCount++;
          // Gentle idle rustle
          leaf.angle += Math.sin(time * 0.05 + leaf.id) * 0.002;
        }

        // 2D. INFINITE RESPAWN AT TOP OF SCROLLING PAGE:
        // Leaves should fall smoothly from top of scrolling page continuously, NOT end on hero!
        if (!leaf.isSettled) {
          if (leaf.y > height + 45 || leaf.x < -70 || leaf.x > width + 70) {
            // Respawn seamlessly at the top of the visible viewport!
            leaf.y = -30 - Math.random() * 50;
            leaf.x = Math.random() * (width + 60) - 30;
            leaf.speedY = Math.random() * 1.3 + 1.1;
            leaf.speedX = (Math.random() - 0.5) * 1.4;
            leaf.angle = Math.random() * Math.PI * 2;
            leaf.color = AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)];
            leaf.isSettled = false;
          }
        }

        // Draw leaf
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        drawMapleLeaf(ctx, leaf.size, leaf.color, leaf.opacity, leaf.flipAngle);
        ctx.restore();
      }

      setPiledCount(settledCount);
      const coveredNow = settledCount >= FULL_COVER_THRESHOLD;
      setIsFullyCovered(coveredNow);

      // 3. DRAW BLOWER MACHINE (Only if equipped/visible)
      if (blower.opacity > 0.01) {
        drawBlower(
          ctx,
          blower.x,
          blower.y,
          blower.angle,
          blower.fanAngle,
          blowingActive,
          coveredNow,
          heroCoverRatio,
          blower.opacity
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  return (
    <>
      {/* Interactive Physics Leaf & Wind Canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-30 w-full h-full ${
          isDraggingBlower ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ pointerEvents: isDraggingBlower ? "auto" : "none" }}
        aria-hidden="true"
      />

      {/* Sleek Side Panel Trigger Tab (Right Edge of Screen) */}
      {/* Normally unobtrusive; glows brightly with golden pulse if hero is fully covered */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto">
        <button
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className={`flex items-center gap-2 pl-3 pr-2.5 py-3 rounded-l-2xl border-y border-l shadow-2xl backdrop-blur-xl transition-all duration-300 group ${
            isFullyCovered
              ? "bg-[#2D1E16] border-[#F0A352] ring-2 ring-[#F0A352]/70 shadow-2xl shadow-[#F0A352]/60 animate-bounce"
              : isBlowerEquipped
              ? "bg-[#201C19]/90 border-[#C96F3B]/50 text-[#F5EFE5] hover:bg-[#2D1E16]"
              : "bg-[#201C19]/75 hover:bg-[#2D1E16]/95 border-[#C96F3B]/35 text-[#F5EFE5]/75 hover:text-[#F0A352]"
          }`}
          title="Open Leaf Blower Side Panel"
          aria-label="Open Leaf Blower Side Panel"
        >
          {/* Glowing Indicator Icon */}
          <div className="relative flex items-center justify-center">
            <Wind
              className={`w-4 h-4 transition-transform ${
                isFullyCovered
                  ? "text-[#F0A352] animate-spin"
                  : isBlowerEquipped
                  ? "text-[#F0A352]"
                  : "text-[#F5EFE5]/60 group-hover:text-[#F0A352] group-hover:scale-110"
              }`}
            />
            {isFullyCovered && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0A352] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0A352]" />
              </span>
            )}
          </div>

          {/* Vertical / Compact Text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-[#F0A352]">
                {isFullyCovered ? "BLOW LEAVES!" : "BLOWER"}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#F5EFE5]/50">
              {isBlowerEquipped ? "EQUIPPED" : isFullyCovered ? "HERO FULL!" : "STOWED"}
            </span>
          </div>

          <ChevronRight
            className={`w-3.5 h-3.5 text-[#F5EFE5]/40 transition-transform ${
              isSidePanelOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Slide-Out Side Panel Drawer (Right Edge) */}
      {isSidePanelOpen && (
        <aside
          aria-label="Leaf Blower Side Panel"
          className="fixed right-0 top-0 bottom-0 w-80 sm:w-88 z-50 bg-[#1A1614]/95 backdrop-blur-2xl border-l border-[#C96F3B]/35 shadow-2xl p-5 flex flex-col justify-between select-none animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#C96F3B]/25 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#C96F3B]/20 border border-[#C96F3B]/40 text-[#F0A352]">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5EFE5]">
                    Autumn Wind Toolkit
                  </h3>
                  <span className="text-[10px] font-mono text-[#F0A352]">
                    INTERACTIVE ATMOSPHERE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-1.5 rounded-lg text-[#F5EFE5]/50 hover:text-[#F5EFE5] hover:bg-[#2D1E16] transition-colors"
                aria-label="Close side panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hero Covered Alert Banner */}
            {isFullyCovered && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#C96F3B]/30 to-[#F0A352]/20 border border-[#F0A352] flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFE8B8]">
                  <Sparkles className="w-4 h-4 text-[#F0A352] animate-pulse" />
                  <span>Hero Section Fully Covered!</span>
                </div>
                <p className="text-[11px] font-sans text-[#F5EFE5]/80 leading-snug">
                  Leaves have blanketed the hero scene. Equip the blower to sweep them away!
                </p>
                <button
                  onClick={() => {
                    deployBlower();
                    triggerTurboBlast();
                  }}
                  className="mt-1 w-full py-1.5 rounded-lg bg-gradient-to-r from-[#F0A352] to-[#C96F3B] text-[#201C19] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#F0A352]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>CLEAR HERO LEAVES (TURBO)</span>
                </button>
              </div>
            )}

            {/* Blower Equip / Stow Toggle */}
            <div className="p-3.5 rounded-xl bg-[#201C19] border border-[#C96F3B]/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-semibold text-[#F5EFE5]">
                  Blower Machine
                </span>
                <span className="text-[10px] font-mono text-[#F5EFE5]/50">
                  {isBlowerEquipped
                    ? "Active on canvas (Drag or point)"
                    : "Docked inside side panel"}
                </span>
              </div>
              <button
                onClick={() => setIsBlowerEquipped(!isBlowerEquipped)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isBlowerEquipped
                    ? "bg-[#C96F3B] text-[#F5EFE5] shadow-md shadow-[#C96F3B]/40"
                    : "bg-[#2D1E16] text-[#F5EFE5]/70 hover:text-[#F0A352] border border-[#C96F3B]/30"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isBlowerEquipped ? "EQUIPPED" : "EQUIP"}</span>
              </button>
            </div>

            {/* Active Blower Controls (Only shown when equipped) */}
            {isBlowerEquipped ? (
              <div className="flex flex-col gap-3 pt-1">
                {/* Air Stream Toggle */}
                <div className="flex items-center justify-between text-xs font-mono px-1">
                  <span className="text-[#F5EFE5]/70">Air Stream Motor:</span>
                  <button
                    onClick={() => setIsBlowing(!isBlowing)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      isBlowing
                        ? "bg-[#F0A352] text-[#201C19] font-bold"
                        : "bg-[#2D1E16] text-[#F5EFE5]/60 hover:text-[#F0A352]"
                    }`}
                  >
                    {isBlowing ? "Active Blowing" : "Idle Motor"}
                  </button>
                </div>

                {/* Aim Mode Switcher */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-[#F5EFE5]/60">
                    Trajectory Aim Mode:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#151210] rounded-lg">
                    <button
                      onClick={() => setAimMode("cursor")}
                      className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                        aimMode === "cursor"
                          ? "bg-[#C96F3B] text-[#F5EFE5] shadow-sm shadow-[#C96F3B]/40"
                          : "text-[#F5EFE5]/60 hover:text-[#F0A352]"
                      }`}
                    >
                      <MousePointer className="w-3 h-3" />
                      <span>Aim to Cursor</span>
                    </button>
                    <button
                      onClick={() => setAimMode("manual")}
                      className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                        aimMode === "manual"
                          ? "bg-[#C96F3B] text-[#F5EFE5] shadow-sm shadow-[#C96F3B]/40"
                          : "text-[#F5EFE5]/60 hover:text-[#F0A352]"
                      }`}
                    >
                      <Compass className="w-3 h-3" />
                      <span>Manual Dial</span>
                    </button>
                  </div>
                </div>

                {/* Quick Direction Presets */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-mono text-[#F5EFE5]/60 flex justify-between">
                    <span>Angle Presets:</span>
                    <span className="text-[#F0A352]">{manualAngleDeg}°</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 font-mono">
                    {[
                      { label: "↖ Up-L", angle: -135 },
                      { label: "⬆ Up", angle: -90 },
                      { label: "↗ Up-R", angle: -45 },
                      { label: "➡ Right", angle: 0 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleAngleChange(item.angle)}
                        className={`py-1.5 text-[10px] rounded transition-all border ${
                          aimMode === "manual" && manualAngleDeg === item.angle
                            ? "bg-[#F0A352] text-[#201C19] border-[#F0A352] font-bold"
                            : "bg-[#2D1E16] text-[#F5EFE5]/80 border-[#C96F3B]/30 hover:border-[#F0A352]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fine-Tuning Slider */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#C96F3B]/20">
                  <button
                    onClick={() => handleAngleChange(manualAngleDeg - 15)}
                    className="p-1.5 rounded bg-[#2D1E16] hover:bg-[#392820] text-[#F5EFE5]/80 hover:text-[#F0A352] transition-colors border border-[#C96F3B]/30"
                    title="Rotate -15°"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={manualAngleDeg}
                    onChange={(e) => handleAngleChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#151210] rounded-lg appearance-none cursor-pointer accent-[#F0A352]"
                    title="Adjust blower angle"
                  />

                  <button
                    onClick={() => handleAngleChange(manualAngleDeg + 15)}
                    className="p-1.5 rounded bg-[#2D1E16] hover:bg-[#392820] text-[#F5EFE5]/80 hover:text-[#F0A352] transition-colors border border-[#C96F3B]/30"
                    title="Rotate +15°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Turbo Blast Shockwave Button */}
                <button
                  onClick={triggerTurboBlast}
                  className="mt-1 w-full py-2 rounded-xl bg-gradient-to-r from-[#C96F3B] to-[#9E472D] text-[#F5EFE5] font-mono font-bold text-xs flex items-center justify-center gap-2 border border-[#F0A352]/40 shadow-lg shadow-black/40 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-[#F0A352] fill-current" />
                  <span>UNLEASH TURBO GUST</span>
                </button>
              </div>
            ) : (
              /* Docked Placeholder Card */
              <div className="p-4 rounded-xl bg-[#201C19]/60 border border-dashed border-[#C96F3B]/30 text-center flex flex-col items-center gap-2">
                <Wind className="w-7 h-7 text-[#C96F3B]/60" />
                <span className="text-xs font-mono text-[#F5EFE5]/80">
                  Blower is safely tucked away
                </span>
                <p className="text-[11px] font-sans text-[#F5EFE5]/50 leading-relaxed">
                  The screen stays completely clean during normal reading. Click &ldquo;Equip&rdquo; above anytime you want to blow autumn leaves around!
                </p>
                <button
                  onClick={deployBlower}
                  className="mt-1 px-4 py-1.5 rounded-lg bg-[#C96F3B] text-[#F5EFE5] font-mono text-xs font-semibold shadow-md shadow-[#C96F3B]/40 hover:bg-[#D97736] transition-all"
                >
                  Deploy Blower Unit
                </button>
              </div>
            )}
          </div>

          {/* Footer Statistics & Live Counter */}
          <div className="border-t border-[#C96F3B]/25 pt-4 flex flex-col gap-2 font-mono text-[11px]">
            <div className="flex justify-between text-[#F5EFE5]/70">
              <span>Settled on Hero:</span>
              <span className="text-[#F0A352] font-semibold">
                {piledCount} / {FULL_COVER_THRESHOLD} leaves
              </span>
            </div>
            <div className="w-full bg-[#151210] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C96F3B] to-[#F0A352] h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((piledCount / FULL_COVER_THRESHOLD) * 100))}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#F5EFE5]/40 leading-tight">
              Leaves continuously fall from the top across all sections as you scroll.
            </span>
          </div>
        </aside>
      )}
    </>
  );
}
