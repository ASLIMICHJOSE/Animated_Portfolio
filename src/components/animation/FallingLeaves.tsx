"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, RotateCcw, Eye, EyeOff } from "lucide-react";

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
  relX: number; // relative to bucket center
  relY: number; // height inside bucket
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
  const [basketActive, setBasketActive] = useState(true);
  const [milestoneText, setMilestoneText] = useState<string | null>(null);
  const collectedCountRef = useRef(0);
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
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Bucket physics variables
    const bucket = {
      x: width * 0.5,
      y: height - 60,
      targetX: width * 0.5,
      width: 105,
      height: 65,
      vx: 0,
      tilt: 0,
      bounceY: 0,
      bounceVy: 0,
    };

    let isMouseActive = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      isMouseActive = true;
      let clientX = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX;
      }
      bucket.targetX = Math.max(bucket.width / 2 + 10, Math.min(width - bucket.width / 2 - 10, clientX));
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

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

    // Draw Japanese Maple Leaf
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

    // Draw Japanese Woven Bamboo / Wood Bucket
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

      // Drop shadow underneath bucket
      context.beginPath();
      context.ellipse(0, bh + 4, halfBot + 6, 8, 0, 0, Math.PI * 2);
      context.fillStyle = "rgba(0,0,0,0.45)";
      context.fill();

      // Bucket Wooden Body (Tapered)
      context.beginPath();
      context.moveTo(-halfTop, 0);
      context.lineTo(halfTop, 0);
      context.lineTo(halfBot, bh);
      context.lineTo(-halfBot, bh);
      context.closePath();

      // Wood Grain Gradient
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

      // Render Collected Leaves Inside Bucket
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

      // Japanese Kanji Emblem on Bucket Front: 「秋」 (Autumn)
      context.font = "bold 13px 'Cinzel', serif";
      context.fillStyle = "rgba(240, 163, 82, 0.75)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("秋", 0, bh * 0.55);

      context.restore();
    };

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Handle Leaf Release if user clicks "Release"
      if (releaseTriggerRef.current) {
        releaseTriggerRef.current = false;
        // Turn settled leaves into bursting particles upward
        settledLeaves.forEach((sl) => {
          for (let p = 0; p < 2; p++) {
            particles.push({
              x: bucket.x + sl.relX,
              y: bucket.y + sl.relY,
              vx: (Math.random() - 0.5) * 5,
              vy: -Math.random() * 6 - 3,
              color: sl.color,
              alpha: 1,
              size: sl.size * 0.8,
            });
          }
        });
        settledLeaves = [];
        collectedCountRef.current = 0;
        setCollectedCount(0);
      }

      // Bucket physics
      if (basketActive) {
        bucket.y = height - 75 + bucket.bounceY;
        const spring = 0.12;
        const friction = 0.78;
        const dx = bucket.targetX - bucket.x;
        bucket.vx += dx * spring;
        bucket.vx *= friction;
        bucket.x += bucket.vx;

        // Target tilt proportional to speed, smoothed
        const targetTilt = Math.max(-0.25, Math.min(0.25, bucket.vx * 0.015));
        bucket.tilt += (targetTilt - bucket.tilt) * 0.15;

        // Bounce spring back to zero
        bucket.bounceVy += -bucket.bounceY * 0.15;
        bucket.bounceVy *= 0.75;
        bucket.bounceY += bucket.bounceVy;
      }

      // Update & Draw Particles (when leaves are caught or released)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
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

      // Update & Draw Falling Leaves
      const bucketTopY = bucket.y - 10;
      const bucketLeft = bucket.x - bucket.width / 2;
      const bucketRight = bucket.x + bucket.width / 2;

      for (let i = 0; i < fallingLeaves.length; i++) {
        const leaf = fallingLeaves[i];

        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(time * leaf.oscillationSpeed + leaf.oscillationOffset) * 0.55;
        leaf.angle += leaf.angleSpeed;
        leaf.flipAngle += leaf.flipSpeed;

        // Check Collision with Basket Rim
        if (
          basketActive &&
          leaf.y >= bucketTopY &&
          leaf.y <= bucketTopY + 22 &&
          leaf.x >= bucketLeft &&
          leaf.x <= bucketRight
        ) {
          // Leaf Caught!
          bucket.bounceVy += 3.5; // Bucket gives a satisfying bounce!

          // Sparkle burst
          for (let s = 0; s < 5; s++) {
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

          // Add to settled leaves (clamped to bucket internal volume)
          const pileLevel = Math.min(bucket.height * 0.75, settledLeaves.length * 1.8);
          const relX = (leaf.x - bucket.x) * 0.7;
          const relY = bucket.height * 0.8 - pileLevel;

          settledLeaves.push({
            relX,
            relY,
            size: leaf.size * 0.8,
            angle: leaf.angle,
            color: leaf.color,
            opacity: 0.95,
            flipAngle: leaf.flipAngle,
          });

          // Keep maximum 40 leaves settled to avoid clutter
          if (settledLeaves.length > 40) {
            settledLeaves.shift();
          }

          collectedCountRef.current += 1;
          const newTotal = collectedCountRef.current;
          setCollectedCount(newTotal);

          // Milestone celebrations
          if (newTotal === 10) {
            setMilestoneText("秋のそよ風 — Autumn Whisper! (10 Leaves)");
            setTimeout(() => setMilestoneText(null), 3500);
          } else if (newTotal === 25) {
            setMilestoneText("紅葉狩り — Maple Harvest! (25 Leaves)");
            setTimeout(() => setMilestoneText(null), 4000);
          } else if (newTotal === 50) {
            setMilestoneText("風情の達人 — Autumn Master! (50 Leaves)");
            setTimeout(() => setMilestoneText(null), 4500);
          }

          // Spawn new leaf at top
          fallingLeaves[i] = createLeaf(false);
          continue;
        }

        // Reset if past screen bottom or edges
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

      // Draw Bucket if active
      if (basketActive) {
        drawBucket(ctx, bucket.x, bucket.y, bucket.width, bucket.height, bucket.tilt);
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
  }, [basketActive]);

  const handleEmptyBasket = () => {
    releaseTriggerRef.current = true;
  };

  return (
    <>
      {/* Interactive Physics Leaf & Bucket Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30 w-full h-full"
        aria-hidden="true"
      />

      {/* Floating Autumn Basket Game HUD */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 select-none">
        {/* Milestone Achievement Popup */}
        {milestoneText && (
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#C96F3B] to-[#9E472D] text-[#F5EFE5] text-xs font-mono border border-[#F0A352]/50 shadow-2xl animate-bounce flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F0A352]" />
            <span>{milestoneText}</span>
          </div>
        )}

        {/* Control Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#201C19]/85 backdrop-blur-xl border border-[#C96F3B]/35 shadow-2xl text-xs font-mono text-[#F5EFE5]">
          <button
            onClick={() => setBasketActive(!basketActive)}
            className="flex items-center gap-1.5 text-[#F0A352] hover:text-white transition-colors focus:outline-none"
            title={basketActive ? "Hide leaf basket" : "Show leaf basket"}
            aria-label="Toggle leaf basket"
          >
            {basketActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{basketActive ? "Basket" : "Basket Off"}</span>
          </button>

          {basketActive && (
            <>
              <span className="text-[#F5EFE5]/30">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[#F5EFE5]/70">Caught:</span>
                <span className="font-bold text-[#F0A352] px-1.5 py-0.5 rounded bg-[#392820]">
                  {collectedCount}
                </span>
              </div>

              {collectedCount > 0 && (
                <button
                  onClick={handleEmptyBasket}
                  className="p-1 rounded hover:bg-[#392820] text-[#F5EFE5]/60 hover:text-[#C96F3B] transition-colors"
                  title="Release leaves to the wind"
                  aria-label="Release leaves"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
