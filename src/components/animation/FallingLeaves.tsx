"use client";

import React, { useEffect, useRef, useState } from "react";
import { Wind, Play, Pause, Sparkles } from "lucide-react";

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
  isSettledInHero: boolean;
  settleOffset: number;
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
}

const AUTUMN_COLORS = [
  "#C96F3B", // Burnt orange
  "#9E472D", // Autumn rust
  "#D97736", // Amber red
  "#E89844", // Golden leaf
  "#B34D28", // Deep crimson leaf
  "#777957", // Olive green accent
  "#F0A352", // Golden highlight
];

export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isBlowing, setIsBlowing] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [piledCount, setPiledCount] = useState(0);

  const isBlowingRef = useRef(true);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    isBlowingRef.current = isBlowing;
  }, [isBlowing]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dock coordinates on bottom right
    let dockX = width - 110;
    let dockY = height - 90;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dockX = width - 110;
      dockY = height - 90;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Track scroll state for hero AFK vs cascading
    let currentScrollY = window.scrollY;
    let prevScrollY = currentScrollY;
    let wasAtHeroTop = currentScrollY < 60;

    const handleScroll = () => {
      currentScrollY = window.scrollY;
      const isNowAtHero = currentScrollY < 60;

      // When transitioning from Hero AFK to Scrolling Down -> Cascade all settled leaves!
      if (wasAtHeroTop && !isNowAtHero) {
        cascadeSettledLeaves();
      }

      wasAtHeroTop = isNowAtHero;
      prevScrollY = currentScrollY;
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
      angle: -Math.PI * 0.75, // pointing up-left into the scene by default
      targetAngle: -Math.PI * 0.75,
      isHeld: false,
      fanAngle: 0,
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      const dist = Math.hypot(cx - blower.x, cy - blower.y);
      if (dist < 75) {
        blower.isHeld = true;
        setIsDragging(true);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }

      if (blower.isHeld) {
        blower.targetX = Math.max(50, Math.min(width - 50, cx));
        blower.targetY = Math.max(50, Math.min(height - 50, cy));

        // Aim blower towards movement or mouse position
        const dx = cx - blower.x;
        const dy = cy - blower.y;
        if (Math.hypot(dx, dy) > 8) {
          blower.targetAngle = Math.atan2(dy, dx);
        }
      }
    };

    const handlePointerUp = () => {
      if (blower.isHeld) {
        blower.isHeld = false;
        setIsDragging(false);
        // Smoothly return towards side dock
        blower.targetX = dockX;
        blower.targetY = dockY;
        blower.targetAngle = -Math.PI * 0.75;
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Leaves creation & pool
    const leafCount = width < 768 ? 24 : 45;
    let leafIdCounter = 0;

    const createLeaf = (initialRandomY = false): Leaf => ({
      id: leafIdCounter++,
      x: Math.random() * width,
      y: initialRandomY ? Math.random() * (height - 80) : -40,
      size: Math.random() * 8 + 14,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.2 + 1.0,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.03,
      oscillationSpeed: Math.random() * 0.02 + 0.015,
      oscillationDistance: Math.random() * 25 + 15,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
      opacity: Math.random() * 0.35 + 0.65,
      flipSpeed: Math.random() * 0.03 + 0.02,
      flipAngle: Math.random() * Math.PI,
      isSettledInHero: false,
      settleOffset: (Math.random() - 0.5) * 18,
    });

    const leaves: Leaf[] = Array.from({ length: leafCount }, () => createLeaf(true));
    const windParticles: WindParticle[] = [];

    // Cascade all settled leaves when user scrolls out of hero
    const cascadeSettledLeaves = () => {
      leaves.forEach((leaf) => {
        if (leaf.isSettledInHero) {
          leaf.isSettledInHero = false;
          leaf.speedY = Math.random() * 3.5 + 3.0; // dynamic downward burst
          leaf.speedX = (Math.random() - 0.5) * 5.0; // horizontal scatter
          leaf.angleSpeed = (Math.random() - 0.5) * 0.12;
          leaf.flipSpeed = Math.random() * 0.08 + 0.04;
        }
      });
      setPiledCount(0);
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

      // Stem
      context.strokeStyle = "rgba(57, 40, 32, 0.6)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, size * 0.4);
      context.lineTo(0, size * 1.15);
      context.stroke();

      context.restore();
    };

    // Draw Autumn Blower Machine
    const drawBlower = (
      context: CanvasRenderingContext2D,
      bx: number,
      by: number,
      bAngle: number,
      fanRot: number,
      blowing: boolean
    ) => {
      context.save();
      context.translate(bx, by);
      context.rotate(bAngle);

      // Shadow
      context.save();
      context.beginPath();
      context.ellipse(0, 15, 35, 12, 0, 0, Math.PI * 2);
      context.fillStyle = "rgba(0,0,0,0.45)";
      context.fill();
      context.restore();

      // Long Tapered Air Nozzle Tube (facing right in local coords)
      context.beginPath();
      context.moveTo(18, -12);
      context.lineTo(75, -6);
      context.lineTo(75, 6);
      context.lineTo(18, 12);
      context.closePath();
      const nozzleGrad = context.createLinearGradient(18, 0, 75, 0);
      nozzleGrad.addColorStop(0, "#2D1E16");
      nozzleGrad.addColorStop(0.5, "#4A3326");
      nozzleGrad.addColorStop(1, "#392820");
      context.fillStyle = nozzleGrad;
      context.fill();
      context.strokeStyle = "#C96F3B";
      context.lineWidth = 1.5;
      context.stroke();

      // Polished Brass Rings on Nozzle
      context.beginPath();
      context.rect(45, -9, 4, 18);
      context.rect(68, -7, 5, 14);
      context.fillStyle = "#F0A352";
      context.fill();

      // Cylindrical Motor & Turbine Housing
      context.beginPath();
      context.ellipse(0, 0, 24, 20, 0, 0, Math.PI * 2);
      const bodyGrad = context.createRadialGradient(-6, -6, 2, 0, 0, 24);
      bodyGrad.addColorStop(0, "#684835");
      bodyGrad.addColorStop(0.7, "#392820");
      bodyGrad.addColorStop(1, "#201C19");
      context.fillStyle = bodyGrad;
      context.fill();
      context.strokeStyle = "#F0A352";
      context.lineWidth = 2;
      context.stroke();

      // Rotating Turbine Impeller / Fan Blades visible inside intake grille
      context.save();
      context.rotate(fanRot);
      for (let b = 0; b < 6; b++) {
        context.rotate(Math.PI / 3);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(12, 4);
        context.lineTo(14, -2);
        context.closePath();
        context.fillStyle = "#F0A352";
        context.fill();
      }
      context.restore();

      // Intake Grille Outer Ring
      context.beginPath();
      context.arc(0, 0, 10, 0, Math.PI * 2);
      context.strokeStyle = "rgba(240, 163, 82, 0.7)";
      context.lineWidth = 1.5;
      context.stroke();

      // Ergonomic Rear Handle
      context.beginPath();
      context.arc(-18, -12, 14, 0, Math.PI * 1.5, true);
      context.strokeStyle = "#C96F3B";
      context.lineWidth = 5;
      context.lineCap = "round";
      context.stroke();

      // Active Air Blast Cone & Wind Exhaust from Nozzle
      if (blowing) {
        context.save();
        const tipX = 75;
        const blastGrad = context.createRadialGradient(tipX, 0, 5, tipX + 60, 0, 90);
        blastGrad.addColorStop(0, "rgba(240, 163, 82, 0.8)");
        blastGrad.addColorStop(0.3, "rgba(245, 239, 229, 0.35)");
        blastGrad.addColorStop(1, "rgba(201, 111, 59, 0)");

        context.beginPath();
        context.moveTo(tipX, -6);
        context.lineTo(tipX + 160, -50);
        context.lineTo(tipX + 160, 50);
        context.lineTo(tipX, 6);
        context.closePath();
        context.fillStyle = blastGrad;
        context.fill();

        // Wind Breeze Lines
        context.strokeStyle = "rgba(245, 239, 229, 0.5)";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(tipX + 10, -3);
        context.quadraticCurveTo(tipX + 60, -15, tipX + 130, -30);
        context.moveTo(tipX + 10, 3);
        context.quadraticCurveTo(tipX + 60, 15, tipX + 130, 30);
        context.stroke();

        context.restore();
      }

      context.restore();
    };

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const isHeroAfk = currentScrollY < 60;
      const blowingActive = isBlowingRef.current || blower.isHeld;

      // Update Blower Physics
      const spring = blower.isHeld ? 0.2 : 0.08;
      const friction = blower.isHeld ? 0.75 : 0.85;

      blower.vx += (blower.targetX - blower.x) * spring;
      blower.vx *= friction;
      blower.x += blower.vx;

      blower.vy += (blower.targetY - blower.y) * spring;
      blower.vy *= friction;
      blower.y += blower.vy;

      // Smooth angle interpolation
      let angleDiff = blower.targetAngle - blower.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      blower.angle += angleDiff * 0.15;

      // Spin fan faster when blowing
      if (blowingActive) {
        blower.fanAngle += 0.35;
      } else {
        blower.fanAngle += 0.05;
      }

      // Spawn wind particles from blower nozzle when active
      if (blowingActive && (time % 2 === 0)) {
        const nozzleDist = 75;
        const nozzleX = blower.x + Math.cos(blower.angle) * nozzleDist;
        const nozzleY = blower.y + Math.sin(blower.angle) * nozzleDist;
        const spread = (Math.random() - 0.5) * 0.45;
        const particleAngle = blower.angle + spread;
        const pSpeed = Math.random() * 8 + 8;

        windParticles.push({
          x: nozzleX,
          y: nozzleY,
          vx: Math.cos(particleAngle) * pSpeed,
          vy: Math.sin(particleAngle) * pSpeed,
          life: 0,
          maxLife: Math.random() * 20 + 15,
          size: Math.random() * 2.5 + 1.5,
          alpha: 0.8,
        });
      }

      // Render Wind Particles
      for (let i = windParticles.length - 1; i >= 0; i--) {
        const wp = windParticles[i];
        wp.x += wp.vx;
        wp.y += wp.vy;
        wp.life++;
        wp.alpha = (1 - wp.life / wp.maxLife) * 0.75;

        if (wp.life >= wp.maxLife) {
          windParticles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = wp.alpha;
          ctx.fillStyle = "#F5EFE5";
          ctx.shadowColor = "#F0A352";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, wp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Ground plane for hero accumulation (30px above bottom edge)
      const heroGroundY = height - 35;
      let settledCount = 0;

      // Update & Render Leaves
      const nozzleDist = 75;
      const nozzleX = blower.x + Math.cos(blower.angle) * nozzleDist;
      const nozzleY = blower.y + Math.sin(blower.angle) * nozzleDist;

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // 1. BLOWER WIND INTERACTION
        if (blowingActive) {
          const dx = leaf.x - nozzleX;
          const dy = leaf.y - nozzleY;
          const distToNozzle = Math.hypot(dx, dy);

          // Check if leaf is within wind cone (~240px range)
          if (distToNozzle < 260) {
            const angleToLeaf = Math.atan2(dy, dx);
            let relAngle = angleToLeaf - blower.angle;
            while (relAngle < -Math.PI) relAngle += Math.PI * 2;
            while (relAngle > Math.PI) relAngle -= Math.PI * 2;

            if (Math.abs(relAngle) < 0.65) {
              // Inside wind cone!
              const force = (1 - distToNozzle / 260) * 14;
              leaf.speedX += Math.cos(blower.angle) * force * 0.45;
              leaf.speedY += Math.sin(blower.angle) * force * 0.45;
              leaf.angleSpeed += (Math.random() - 0.5) * 0.1;
              leaf.flipSpeed += 0.04;

              // If it was resting on the hero ground, wake it up and blow it into the air!
              if (leaf.isSettledInHero) {
                leaf.isSettledInHero = false;
              }
            }
          }
        }

        // 2. HERO ACCUMULATION (AFK at bottom of hero section)
        if (isHeroAfk && !leaf.isSettledInHero) {
          const targetGround = heroGroundY + leaf.settleOffset;
          if (leaf.y >= targetGround && leaf.speedY > 0) {
            // Leaf hits the hero ground plane! Settle down.
            leaf.isSettledInHero = true;
            leaf.y = targetGround;
            leaf.speedX = 0;
            leaf.speedY = 0;
            leaf.angleSpeed = 0;
            leaf.flipSpeed = 0;
          }
        }

        // 3. NORMAL OR CASCADING PHYSICS
        if (!leaf.isSettledInHero) {
          leaf.x += leaf.speedX + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.55;
          leaf.y += leaf.speedY;
          leaf.angle += leaf.angleSpeed;
          leaf.flipAngle += leaf.flipSpeed;

          // Drag air friction
          leaf.speedX *= 0.96;
          if (leaf.speedY > 2.0) {
            leaf.speedY *= 0.98; // settle back towards terminal velocity
          }
        } else {
          settledCount++;
          // Gentle idle rustle while settled on ground
          leaf.angle += Math.sin(time * 0.05 + leaf.id) * 0.003;
        }

        // Reset if blown out of bounds (except settled leaves)
        if (!leaf.isSettledInHero) {
          if (leaf.y > height + 50 || leaf.x < -60 || leaf.x > width + 60) {
            leaves[i] = createLeaf(false);
            leaves[i].x = Math.random() * (width + 60) - 30;
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

      // Draw Blower Machine
      drawBlower(ctx, blower.x, blower.y, blower.angle, blower.fanAngle, blowingActive);

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
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-30 w-full h-full ${
          isDragging ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ pointerEvents: isDragging ? "auto" : "none" }}
        aria-hidden="true"
      />

      {/* Floating Autumn Leaf Blower HUD (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40 select-none pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#201C19]/85 backdrop-blur-xl border border-[#C96F3B]/35 shadow-xl text-xs font-mono text-[#F5EFE5]">
          <Wind className={`w-3.5 h-3.5 ${isBlowing ? "text-[#F0A352] animate-pulse" : "text-[#F5EFE5]/50"}`} />
          <span className="text-[#F5EFE5]/70">Leaf Blower:</span>

          <button
            onClick={() => setIsBlowing(!isBlowing)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              isBlowing
                ? "bg-[#C96F3B] text-[#F5EFE5] shadow-sm shadow-[#C96F3B]/40"
                : "bg-[#392820] text-[#F5EFE5]/60 hover:text-[#F0A352]"
            }`}
            title="Toggle blower air stream"
            aria-label="Toggle blower"
          >
            {isBlowing ? "Active" : "Idle"}
          </button>

          {piledCount > 0 && (
            <span className="text-[10px] text-[#F0A352] pl-1 border-l border-[#C96F3B]/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{piledCount} Piled</span>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
