"use client";

import React, { useEffect, useRef } from "react";

interface WindStreak {
  x: number;
  y: number;
  z: number;
  length: number;
  color: string;
  speed: number;
  alpha: number;
}

export default function PovFlightController() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Track scroll velocity for camera rush effect
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothedVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3D Radial Wind Stream Particles
    const streaksCount = 45;
    const streaks: WindStreak[] = [];

    const STREAK_COLORS = ["#F0A352", "#C96F3B", "#F5EFE5", "#E89844"];

    const initStreak = (): WindStreak => {
      // Angle around center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 250 + 60;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * 800 + 200,
        length: Math.random() * 40 + 25,
        color: STREAK_COLORS[Math.floor(Math.random() * STREAK_COLORS.length)],
        speed: Math.random() * 12 + 10,
        alpha: Math.random() * 0.4 + 0.2,
      };
    };

    for (let i = 0; i < streaksCount; i++) {
      streaks.push(initStreak());
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const fov = 400;

    const render = () => {
      // Smooth velocity decay
      smoothedVelocity += (scrollVelocity - smoothedVelocity) * 0.15;
      scrollVelocity *= 0.85;

      ctx.clearRect(0, 0, width, height);

      // Only draw speed lines when moving with sufficient speed
      const intensity = Math.min(1, smoothedVelocity / 25);

      if (intensity > 0.05) {
        ctx.save();
        ctx.translate(centerX, centerY);

        for (let i = 0; i < streaks.length; i++) {
          const s = streaks[i];

          // Accelerate particle towards camera
          s.z -= s.speed * (1 + intensity * 2.5);

          if (s.z <= 10) {
            streaks[i] = initStreak();
            continue;
          }

          // 3D Perspective Projection
          const scale = fov / s.z;
          const x2d = s.x * scale;
          const y2d = s.y * scale;

          // Trail origin
          const trailScale = fov / (s.z + s.length * (1 + intensity * 1.5));
          const prevX2d = s.x * trailScale;
          const prevY2d = s.y * trailScale;

          ctx.beginPath();
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(prevX2d, prevY2d);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = Math.max(1, scale * 1.8);
          ctx.globalAlpha = Math.min(1, s.alpha * intensity * 1.8);
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full mix-blend-screen"
      aria-hidden="true"
    />
  );
}
