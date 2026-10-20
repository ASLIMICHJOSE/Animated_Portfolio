"use client";

import React, { useEffect, useRef, useState } from "react";

interface Leaf {
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
}

const AUTUMN_COLORS = [
  "#C96F3B", // Burnt orange
  "#9E472D", // Autumn rust
  "#D97736", // Amber red
  "#E89844", // Golden leaf
  "#B34D28", // Deep crimson leaf
  "#777957"  // Olive green accent
];

export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [motionDisabled, setMotionDisabled] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setMotionDisabled(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Interactive mouse wind
    let mouseWindX = 0;
    let targetWindX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetWindX = normalizedX * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Determine particle count based on screen width
    const isMobile = width < 768;
    const count = isMobile ? 12 : 28;

    const createLeaf = (initialRandomY = false): Leaf => ({
      x: Math.random() * width,
      y: initialRandomY ? Math.random() * height : -30,
      size: Math.random() * 8 + 12,
      speedX: Math.random() * 0.8 - 0.4,
      speedY: Math.random() * 0.9 + 0.8,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationDistance: Math.random() * 30 + 15,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
      opacity: Math.random() * 0.4 + 0.55,
      flipSpeed: Math.random() * 0.03 + 0.015,
      flipAngle: Math.random() * Math.PI
    });

    const leaves: Leaf[] = Array.from({ length: count }, () => createLeaf(true));

    // Draw stylized Japanese maple (momiji) leaf
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

      // Draw stylized multi-lobed maple leaf
      context.beginPath();
      context.moveTo(0, -size);
      // Top tip
      context.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.5, -size * 0.5, size * 0.8, -size * 0.4);
      // Right lobe
      context.bezierCurveTo(size * 0.5, -size * 0.1, size * 0.7, size * 0.3, size * 0.5, size * 0.6);
      // Bottom right
      context.bezierCurveTo(size * 0.2, size * 0.4, size * 0.1, size * 0.7, 0, size * 0.9);
      // Bottom left
      context.bezierCurveTo(-size * 0.1, size * 0.7, -size * 0.2, size * 0.4, -size * 0.5, size * 0.6);
      // Left lobe
      context.bezierCurveTo(-size * 0.7, size * 0.3, -size * 0.5, -size * 0.1, -size * 0.8, -size * 0.4);
      // Top left
      context.bezierCurveTo(-size * 0.5, -size * 0.5, -size * 0.3, -size * 0.8, 0, -size);
      context.closePath();
      context.fill();

      // Delicate stem
      context.strokeStyle = "rgba(57, 40, 32, 0.45)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, size * 0.4);
      context.lineTo(0, size * 1.15);
      context.stroke();

      context.restore();
    };

    let time = 0;
    const render = () => {
      time += 1;
      // Smoothly interpolate wind
      mouseWindX += (targetWindX - mouseWindX) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + mouseWindX + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.45;
        leaf.angle += leaf.angleSpeed;
        leaf.flipAngle += leaf.flipSpeed;

        // Reset if off bottom or sides
        if (leaf.y > height + 40 || leaf.x < -40 || leaf.x > width + 40) {
          leaves[i] = createLeaf(false);
          leaves[i].x = Math.random() * (width + 60) - 30;
        }

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
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (motionDisabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      aria-hidden="true"
    />
  );
}
