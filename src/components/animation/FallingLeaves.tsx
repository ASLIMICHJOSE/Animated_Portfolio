"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

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
}

interface SettledLeaf {
  relX: number;
  relY: number;
  size: number;
  angle: number;
  color: string;
  opacity: number;
  flipAngle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
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
  const [collectedCount, setCollectedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const releaseTriggerRef = useRef(false);

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
      dockX = width - 110;
      dockY = height - 80;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Docked coordinates on the side
    let dockX = width - 110;
    let dockY = height - 80;

    // Bucket physics variables
    const bucket = {
      x: dockX,
      y: dockY,
      targetX: dockX,
      targetY: dockY,
      width: 100,
      height: 65,
      vx: 0,
      vy: 0,
      tilt: 0,
      bounceY: 0,
      bounceVy: 0,
      isHeld: false,
    };

    let pointerX = 0;
    let pointerY = 0;

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

      // Check if clicked inside or near bucket
      const dist = Math.hypot(cx - bucket.x, cy - bucket.y);
      if (dist < 75) {
        bucket.isHeld = true;
        setIsDragging(true);
        pointerX = cx;
        pointerY = cy;
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
      pointerX = cx;
      pointerY = cy;

      if (bucket.isHeld) {
        bucket.targetX = Math.max(bucket.width / 2 + 10, Math.min(width - bucket.width / 2 - 10, cx));
        bucket.targetY = Math.max(bucket.height + 20, Math.min(height - 40, cy));
      }
    };

    const handlePointerUp = () => {
      if (bucket.isHeld) {
        bucket.isHeld = false;
        setIsDragging(false);
        // Gently return towards side dock
        bucket.targetX = dockX;
        bucket.targetY = dockY;
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Active falling leaves
    const isMobile = width < 768;
    const count = isMobile ? 18 : 34;

    let leafIdCounter = 0;
    const createLeaf = (initialRandomY = false): Leaf => ({
      id: leafIdCounter++,
      x: Math.random() * width,
      y: initialRandomY ? Math.random() * height : -35,
      size: Math.random() * 8 + 14,
      speedX: Math.random() * 0.8 - 0.4,
      speedY: Math.random() * 1.0 + 0.9,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationDistance: Math.random() * 30 + 15,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
      opacity: Math.random() * 0.35 + 0.65,
      flipSpeed: Math.random() * 0.03 + 0.015,
      flipAngle: Math.random() * Math.PI,
    });

    let fallingLeaves: Leaf[] = Array.from({ length: count }, () => createLeaf(true));
    let settledLeaves: SettledLeaf[] = [];
    let particles: Particle[] = [];

    // Draw Maple Leaf
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
      context.strokeStyle = "rgba(57, 40, 32, 0.5)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, size * 0.4);
      context.lineTo(0, size * 1.15);
      context.stroke();

      context.restore();
    };

    // Draw Japanese Woven Wood Bucket
    const drawBucket = (
      context: CanvasRenderingContext2D,
      bx: number,
      by: number,
      bw: number,
      bh: number,
      tilt: number
    ) => {
      context.save();
      context.translate(bx, by);
      context.rotate(tilt);

      const topW = bw;
      const botW = bw * 0.75;
      const halfTop = topW / 2;
      const halfBot = botW / 2;

      // Drop shadow
      context.beginPath();
      context.ellipse(0, bh + 4, halfBot + 6, 8, 0, 0, Math.PI * 2);
      context.fillStyle = "rgba(0,0,0,0.5)";
      context.fill();

      // Bucket Wooden Body
      context.beginPath();
      context.moveTo(-halfTop, 0);
      context.lineTo(halfTop, 0);
      context.lineTo(halfBot, bh);
      context.lineTo(-halfBot, bh);
      context.closePath();

      const woodGrad = context.createLinearGradient(-halfTop, 0, halfTop, 0);
      woodGrad.addColorStop(0, "#2D1E16");
      woodGrad.addColorStop(0.2, "#4A3326");
      woodGrad.addColorStop(0.5, "#684835");
      woodGrad.addColorStop(0.8, "#4A3326");
      woodGrad.addColorStop(1, "#2D1E16");
      context.fillStyle = woodGrad;
      context.fill();
      context.strokeStyle = "#C96F3B";
      context.lineWidth = 1.5;
      context.stroke();

      // Brass Hoops (Golden Bands)
      const drawBand = (yRatio: number) => {
        const currentW = halfTop - (halfTop - halfBot) * yRatio;
        const curY = bh * yRatio;
        context.beginPath();
        context.ellipse(0, curY, currentW, 4, 0, 0, Math.PI * 2);
        context.strokeStyle = "#F0A352";
        context.lineWidth = 2.5;
        context.stroke();
      };
      drawBand(0.35);
      drawBand(0.75);

      // Render Collected Leaves Inside & Overfilling Bucket
      for (const leaf of settledLeaves) {
        context.save();
        context.translate(leaf.relX, leaf.relY);
        context.rotate(leaf.angle);
        drawMapleLeaf(context, leaf.size, leaf.color, leaf.opacity, leaf.flipAngle);
        context.restore();
      }

      // Bucket Top Rim (Inner & Outer Ellipse)
      context.beginPath();
      context.ellipse(0, 0, halfTop, 8, 0, 0, Math.PI * 2);
      context.fillStyle = "rgba(32, 28, 25, 0.85)";
      context.fill();
      context.strokeStyle = "#F0A352";
      context.lineWidth = 2;
      context.stroke();

      // Polished Brass Diamond Emblem
      context.save();
      context.translate(0, bh * 0.55);
      context.rotate(Math.PI / 4);
      context.fillStyle = "#F0A352";
      context.fillRect(-5, -5, 10, 10);
      context.restore();

      // Hint badge when resting at dock
      if (!bucket.isHeld && Math.hypot(bucket.x - dockX, bucket.y - dockY) < 15) {
        context.font = "500 10px 'Plus Jakarta Sans', sans-serif";
        context.fillStyle = "rgba(240, 163, 82, 0.85)";
        context.textAlign = "center";
        context.fillText("Drag bucket", 0, -18);
      }

      context.restore();
    };

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Handle Leaf Release
      if (releaseTriggerRef.current) {
        releaseTriggerRef.current = false;
        settledLeaves.forEach((sl) => {
          for (let p = 0; p < 2; p++) {
            particles.push({
              x: bucket.x + sl.relX,
              y: bucket.y + sl.relY,
              vx: (Math.random() - 0.5) * 6,
              vy: -Math.random() * 7 - 3,
              color: sl.color,
              alpha: 1,
              size: sl.size * 0.8,
            });
          }
        });
        settledLeaves = [];
        setCollectedCount(0);
      }

      // Bucket Physics: Follow target with spring & damping
      const spring = bucket.isHeld ? 0.2 : 0.08;
      const friction = bucket.isHeld ? 0.72 : 0.82;

      const dx = bucket.targetX - bucket.x;
      const dy = bucket.targetY - bucket.y;

      bucket.vx += dx * spring;
      bucket.vx *= friction;
      bucket.x += bucket.vx;

      bucket.vy += dy * spring;
      bucket.vy *= friction;
      bucket.y += bucket.vy;

      // Tilt proportional to horizontal velocity
      const targetTilt = Math.max(-0.35, Math.min(0.35, bucket.vx * 0.02));
      bucket.tilt += (targetTilt - bucket.tilt) * 0.15;

      // Bounce return
      bucket.bounceVy += -bucket.bounceY * 0.15;
      bucket.bounceVy *= 0.75;
      bucket.bounceY += bucket.bounceVy;

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Falling Leaves & Collision
      const bucketTopY = bucket.y - 12;
      const bucketLeft = bucket.x - bucket.width / 2;
      const bucketRight = bucket.x + bucket.width / 2;

      for (let i = 0; i < fallingLeaves.length; i++) {
        const leaf = fallingLeaves[i];

        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.55;
        leaf.angle += leaf.angleSpeed;
        leaf.flipAngle += leaf.flipSpeed;

        // Collision with Bucket Rim
        if (
          leaf.y >= bucketTopY &&
          leaf.y <= bucketTopY + 28 &&
          leaf.x >= bucketLeft &&
          leaf.x <= bucketRight
        ) {
          bucket.bounceVy += 4;

          // Sparkle burst
          for (let s = 0; s < 4; s++) {
            particles.push({
              x: leaf.x,
              y: leaf.y,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 3 - 1,
              color: "#F0A352",
              alpha: 0.9,
              size: Math.random() * 3 + 2,
            });
          }

          // Leaves can continuously overfill the bucket!
          // They stack up and layer over the top rim
          const pileHeight = Math.min(60, settledLeaves.length * 1.2);
          const spreadFactor = 0.8 + Math.min(0.4, settledLeaves.length * 0.01);
          const relX = (leaf.x - bucket.x) * spreadFactor;
          const relY = bucket.height * 0.7 - pileHeight;

          settledLeaves.push({
            relX,
            relY,
            size: leaf.size * 0.85,
            angle: leaf.angle + (Math.random() - 0.5) * 0.4,
            color: leaf.color,
            opacity: 0.95,
            flipAngle: leaf.flipAngle,
          });

          setCollectedCount((prev) => prev + 1);

          // Respawn at top
          fallingLeaves[i] = createLeaf(false);
          continue;
        }

        // Reset if off bottom or sides
        if (leaf.y > height + 40 || leaf.x < -40 || leaf.x > width + 40) {
          fallingLeaves[i] = createLeaf(false);
          fallingLeaves[i].x = Math.random() * (width + 60) - 30;
        }

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        drawMapleLeaf(ctx, leaf.size, leaf.color, leaf.opacity, leaf.flipAngle);
        ctx.restore();
      }

      // Draw Bucket
      drawBucket(ctx, bucket.x, bucket.y, bucket.width, bucket.height, bucket.tilt);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  const handleEmptyBasket = () => {
    releaseTriggerRef.current = true;
  };

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

      {/* Floating Autumn Basket Game HUD (Quiet on Side) */}
      <div className="fixed bottom-5 right-5 z-40 select-none pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201C19]/80 backdrop-blur-xl border border-[#C96F3B]/35 shadow-xl text-xs font-mono text-[#F5EFE5]">
          <span className="text-[#F5EFE5]/70">Leaves Caught:</span>
          <span className="font-bold text-[#F0A352] px-1.5 py-0.5 rounded bg-[#392820]">
            {collectedCount}
          </span>

          {collectedCount > 0 && (
            <button
              onClick={handleEmptyBasket}
              className="p-1 rounded hover:bg-[#392820] text-[#F5EFE5]/60 hover:text-[#C96F3B] transition-colors focus:outline-none"
              title="Release leaves to the wind"
              aria-label="Release leaves"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
