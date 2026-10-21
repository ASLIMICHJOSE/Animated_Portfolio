"use client";

import React, { useEffect, useRef } from "react";

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
  oscillationOffset: number;
  color: string;
  opacity: number;
  flipSpeed: number;
  flipAngle: number;
}

interface WindRibbon {
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

export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Pointer velocity tracking for natural cursor wind
    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;
    let lastMouseMoveTime = Date.now();

    const ribbons: WindRibbon[] = [];

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

      const now = Date.now();
      const dt = Math.max(1, now - lastMouseMoveTime);
      lastMouseMoveTime = now;

      if (prevMouseX !== -1000) {
        mouseVx = ((cx - prevMouseX) / dt) * 16;
        mouseVy = ((cy - prevMouseY) / dt) * 16;
      }

      prevMouseX = mouseX = cx;
      prevMouseY = mouseY = cy;

      // Spawn subtle golden stardust particles along cursor motion if moving with intent
      const speed = Math.hypot(mouseVx, mouseVy);
      if (speed > 4 && Math.random() < 0.6) {
        ribbons.push({
          x: cx + (Math.random() - 0.5) * 12,
          y: cy + (Math.random() - 0.5) * 12,
          vx: mouseVx * 0.15 + (Math.random() - 0.5) * 1.5,
          vy: mouseVy * 0.15 - Math.random() * 1.2,
          life: 0,
          maxLife: Math.random() * 24 + 18,
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.9,
          color: Math.random() > 0.4 ? "#F0A352" : "#FFE8B8",
        });
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // Pool of elegant falling maple leaves
    const targetCount = width < 768 ? 12 : 20;
    let leafIdCounter = 0;

    const createLeaf = (initialRandomY = false): Leaf => ({
      id: leafIdCounter++,
      x: Math.random() * (width + 80) - 40,
      y: initialRandomY ? Math.random() * height : -40 - Math.random() * 80,
      size: Math.random() * 7 + 13,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.1 + 0.9,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.03,
      oscillationSpeed: Math.random() * 0.02 + 0.015,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
      opacity: Math.random() * 0.35 + 0.65,
      flipSpeed: Math.random() * 0.03 + 0.02,
      flipAngle: Math.random() * Math.PI,
    });

    const leaves: Leaf[] = Array.from({ length: targetCount }, () => createLeaf(true));

    // Draw Japanese Maple / Autumn Leaf shape
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

      // Delicate Stem
      context.strokeStyle = "rgba(40, 28, 22, 0.55)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, size * 0.4);
      context.lineTo(0, size * 1.15);
      context.stroke();

      context.restore();
    };

    let time = 0;

    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Damp pointer velocity gradually
      mouseVx *= 0.88;
      mouseVy *= 0.88;

      // 1. UPDATE AND RENDER GOLDEN WIND EMBERS
      for (let r = ribbons.length - 1; r >= 0; r--) {
        const rb = ribbons[r];
        rb.x += rb.vx;
        rb.y += rb.vy;
        rb.life++;
        rb.alpha = (1 - rb.life / rb.maxLife) * 0.85;

        if (rb.life >= rb.maxLife) {
          ribbons.splice(r, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = rb.alpha;
          ctx.fillStyle = rb.color;
          ctx.shadowColor = rb.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(rb.x, rb.y, rb.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. NATURAL LEAF SIMULATION (Peaceful, organic autumn drift)
      const naturalBreeze = Math.sin(time * 0.02) * 0.6;

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // Fall physics
        leaf.x += leaf.speedX + naturalBreeze + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.7;
        leaf.y += leaf.speedY;
        leaf.angle += leaf.angleSpeed;
        leaf.flipAngle += leaf.flipSpeed;

        // Drag air friction
        leaf.speedX *= 0.96;
        if (leaf.speedY > 2.2) leaf.speedY *= 0.98;

        // Wrap / respawn seamlessly at the top
        if (leaf.y > height + 45 || leaf.x < -60 || leaf.x > width + 60) {
          leaf.y = -30 - Math.random() * 60;
          leaf.x = Math.random() * (width + 60) - 30;
          leaf.speedY = Math.random() * 1.2 + 0.9;
          leaf.speedX = (Math.random() - 0.5) * 1.4;
          leaf.angle = Math.random() * Math.PI * 2;
          leaf.color = AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)];
        }

        // Render leaf
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        drawMapleLeaf(ctx, leaf.size, leaf.color, leaf.opacity, leaf.flipAngle);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
