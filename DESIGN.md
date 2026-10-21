# Cinematic Warm Autumn Glassmorphism
## Complete Design, Animation & Atmospheric Engineering Blueprint

This document is the official architectural specification and creative engineering blueprint for our cinematic portfolio and future projects. It outlines every animation system, background effect, 3D transform, scroll synchronization mechanism, and styling token used to achieve this luxury editorial aesthetic.

---

## Table of Contents
1. [Core Design Philosophy & Palette](#1-core-design-philosophy--palette)
2. [Typography Hierarchy](#2-typography-hierarchy)
3. [Smooth Scroll Engine (Lenis + GSAP ScrollTrigger)](#3-smooth-scroll-engine-lenis--gsap-scrolltrigger)
4. [Lenis Cascading Sticky Card Stack (Projects Section)](#4-lenis-cascading-sticky-card-stack-projects-section)
5. [3D Card-Origin Mechanical Unfolding (Project Dossier Drawer)](#5-3d-card-origin-mechanical-unfolding-project-dossier-drawer)
6. [Interactive 3D Mouse Tilt & Dynamic Specular Glare](#6-interactive-3d-mouse-tilt--dynamic-specular-glare)
7. [Synchronized Horizontal Runway Scroll (Skills Section)](#7-synchronized-horizontal-runway-scroll-skills-section)
8. [Conduit Flow Lines & Traveling Waypoint Beacons (Journey Section)](#8-conduit-flow-lines--traveling-waypoint-beacons-journey-section)
9. [Atmospheric Particle Engine (Falling Leaves & Wind Wake)](#9-atmospheric-particle-engine-falling-leaves--wind-wake)
10. [Holographic 3D Modal Inspector (Certifications Section)](#10-holographic-3d-modal-inspector-certifications-section)
11. [Glassmorphism CSS Tokens & Ambient Lighting](#11-glassmorphism-css-tokens--ambient-lighting)
12. [Master Checklist for New Projects](#12-master-checklist-for-new-projects)

---

## 1. Core Design Philosophy & Palette

### Philosophy
- **Cinematic Anime Atmosphere**: Evoking nostalgic golden-hour warmth (traditional verandas, rainy twilight boulevards, waterfront reflections, railway scenes).
- **Physical Depth over Flat Elements**: No standard 2D fade-ins. Elements emerge with mass, unfold with mechanical hinges, tilt with specular glares, and respond to gravity and wind.
- **Glassmorphism with Contrast**: Deep, rich dark roast espresso grounds (`#201C19` to `#14100E`) layered under high-blur frosted glass with radiant amber/gold edge lighting.

### Color Palette Hex Codes
| Token | Hex / RGBA | Role / Usage |
| :--- | :--- | :--- |
| **Primary Background** | `#201C19` | Deep roasted charcoal / espresso background. |
| **Glass Panel Base** | `#181310` / `rgba(24,19,16,0.94)` | Dark frosted glass body with `backdrop-blur-xl`. |
| **Elevated Glass Base**| `#1D1714` / `rgba(29,23,20,0.96)` | Raised modal cards, active drawers, and popups. |
| **Primary Warm Accent**| `#F0A352` | Luminous amber honey. Used for active tabs, glows, buttons, and badges. |
| **Secondary Warm Accent**| `#C96F3B` | Autumn terracotta rust. Used for default borders, secondary tags, and subtle flares. |
| **Light Highlight** | `#FFE8B8` | Soft sunlight cream. Used for high-contrast subheadings, metric numbers, and embers. |
| **Body Text** | `#F5EFE5` | Linen ivory with opacity modifiers (`/90`, `/80`, `/70`, `/50`). |
| **Verified Green** | `#34D399` / `#47A248` | Credential status badges and verified indicators. |

### Edge Lighting Rule
Every premium card or modal must feature:
1. **Top Amber Flare**:
   ```html
   <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
   ```
2. **Glass Border**:
   ```html
   className="border border-[#C96F3B]/35 hover:border-[#F0A352] transition-colors"
   ```

---

## 2. Typography Hierarchy

| Role | Font Family & Weight | Tailwind Classes | Characteristics |
| :--- | :--- | :--- | :--- |
| **Display Headings** | Editorial Serif (`Playfair Display` or `Cinzel`) | `font-serif font-black tracking-tight` | High visual weight, uppercase category tags, colored accent periods (`.`). |
| **Section Numbers** | Monospace (`JetBrains Mono` or `Space Mono`) | `font-mono text-xs uppercase tracking-widest text-[#F0A352]` | E.g., `ACT 02 / WORKS`, `01 / 05`. |
| **Body Copy** | Clean Sans-Serif (`Inter` or `Plus Jakarta Sans`) | `font-sans font-light text-[#F5EFE5]/80 leading-relaxed` | Generous line-height, elegant breathing room. |
| **Technical Badges** | Monospace with micro-pills | `font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md` | Background `#201C19`, border `#C96F3B]/30`. |

---

## 3. Smooth Scroll Engine (Lenis + GSAP ScrollTrigger)

To achieve the liquid inertia of Awwwards sites, scroll physics must never stutter. Lenis coordinates with GSAP ScrollTrigger via a unified animation loop.

### Implementation Blueprint
```tsx
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
  });

  // Synchronize Lenis scroll with GSAP ScrollTrigger ticker
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

---

## 4. Lenis Cascading Sticky Card Stack (Projects Section)

### The Problem with Normal Carousels
Standard horizontal carousels or cards that hide offscreen feel disjointed.
### The Lenis Cascading Solution
Inspired by `lenis.dev/application`:
1. All project cards are fixed in a vertical stacking container.
2. As you scroll, each card pins at the top.
3. Preceding cards do **not** disappear; they stack tightly with a stepped offset:
   $$\text{Offset } y = i \times 42\text{px}$$
4. When you reach the final card (e.g., Card 05), **all top headers (01, 02, 03, 04, 05) remain visible, tiered, and directly touchable/clickable**.

### GSAP Architecture
```tsx
const TAB_OFFSET = 42;
const pinDistance = Math.round(window.innerHeight * (total - 1) * 0.85);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: `+=${pinDistance}`,
    pin: true,
    scrub: 0.5, // 1:1 sync with Lenis smooth wheel
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const activeIdx = Math.min(total - 1, Math.floor(self.progress * (total - 0.02)));
      setActiveIndex(activeIdx);
    },
  },
});

// Gapless stacking sequence (0->1, 1->2, 2->3, 3->4)
for (let i = 1; i < total; i++) {
  const startTime = i - 1;
  tl.to(cards[i], {
    yPercent: 0,
    y: i * TAB_OFFSET,
    ease: "power1.inOut",
    duration: 1.0,
  }, startTime);

  // Preceding cards scale and dim subtly, preserving tiered tabs
  for (let j = 0; j < i; j++) {
    const depth = i - j;
    tl.to(cards[j], {
      scale: Math.max(0.92, 1 - depth * 0.02),
      ease: "power1.inOut",
      duration: 1.0,
    }, startTime);
  }
}
```

---

## 5. 3D Card-Origin Mechanical Unfolding (Project Dossier Drawer)

### The Concept
Instead of boring opacity fades or standard side modals, when a user clicks **"Inspect Project Dossier"**:
1. The details panel **physically unfolds from the right edge of the card itself** (`transformOrigin: "left center"`).
2. It rotates from an acute 3D perspective angle (`rotateY: -55deg`) to flat (`rotateY: 0deg`).
3. An **amber vertical laser energy flare** sweeps along the connecting hinge.
4. Uses punchy mechanical easing: `back.out(1.15)`.

### GSAP Animation Code
```tsx
export function animateDossierOpen(drawerEl: HTMLElement, laserLineEl: HTMLElement) {
  const tl = gsap.timeline();

  // 1. Initial 3D collapsed state
  gsap.set(drawerEl, {
    transformOrigin: "left center",
    scaleX: 0.1,
    rotateY: -55,
    opacity: 0,
    boxShadow: "0 0 0 rgba(240, 163, 82, 0)",
  });

  // 2. Punchy mechanical unfold
  tl.to(drawerEl, {
    scaleX: 1,
    rotateY: 0,
    opacity: 1,
    duration: 0.65,
    ease: "back.out(1.18)",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), -5px 0 25px rgba(240, 163, 82, 0.25)",
  });

  // 3. Laser Seam traveling flare
  tl.fromTo(
    laserLineEl,
    { scaleY: 0, opacity: 1, y: "-100%" },
    { scaleY: 1, opacity: 1, y: "100%", duration: 0.5, ease: "power2.inOut" },
    "<0.1"
  );

  return tl;
}
```

---

## 6. Interactive 3D Mouse Tilt & Dynamic Specular Glare

Used across About portraits, Project cards, and Certification badges.

### Mathematical Formulas
Given pointer coordinates $(X, Y)$ relative to card bounding rectangle $(W, H)$:
$$\text{centerX} = \frac{W}{2}, \quad \text{centerY} = \frac{H}{2}$$
$$\text{rotateX} = \frac{Y - \text{centerY}}{\text{centerY}} \times -8^\circ$$
$$\text{rotateY} = \frac{X - \text{centerX}}{\text{centerX}} \times 8^\circ$$
$$\text{glareX} = \frac{X}{W} \times 100\%, \quad \text{glareY} = \frac{Y}{H} \times 100\%$$

### Component Template
```tsx
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  setTilt({
    rotateX: ((y - centerY) / centerY) * -8,
    rotateY: ((x - centerX) / centerX) * 8,
    glareX: (x / rect.width) * 100,
    glareY: (y / rect.height) * 100,
    isHovered: true,
  });
};

// Inside JSX:
<div
  style={{
    transform: tilt.isHovered
      ? `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.025, 1.025, 1.025)`
      : "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: tilt.isHovered ? "transform 0.08s ease-out" : "transform 0.45s ease-out",
  }}
>
  {/* Specular Radial Amber Spotlight */}
  {tilt.isHovered && (
    <div
      className="absolute inset-0 pointer-events-none rounded-3xl"
      style={{
        background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.22) 0%, transparent 65%)`,
      }}
    />
  )}
</div>
```

---

## 7. Synchronized Horizontal Runway Scroll (Skills Section)

### Core Requirement
Horizontal scroll runways must **never feel fast, rushed, or abrupt**. The scroll duration must be calculated from the physical track distance traveled.

### Scrub Formula & GSAP Implementation
```tsx
const section = sectionRef.current;
const track = trackRef.current;

const travelDistance = track.scrollWidth - window.innerWidth;
// Ensure runway distance scales gracefully:
const scrollRunway = Math.max(window.innerHeight * 2.8, travelDistance * 1.15);

gsap.to(track, {
  x: -travelDistance,
  ease: "none",
  scrollTrigger: {
    trigger: section,
    pin: true,
    start: "top top",
    end: () => `+=${scrollRunway}`,
    scrub: 1.0, // Matches Lenis scroll inertia
    invalidateOnRefresh: true,
  },
});
```

---

## 8. Conduit Flow Lines & Traveling Waypoint Beacons (Journey Section)

### Visual Narrative
A glowing energy circuit flows continuously through the section, connecting each chapter.

```
       ○ Milestone Chapter 01
       │
       ▼ [Traveling Amber Beacon]  <-- shadow-[0_0_20px_#F0A352]
       │
       ○ Milestone Chapter 02
       │
       ▼
```

### GSAP Waypoint Animation
```tsx
// Scale the conduit line with scroll
gsap.fromTo(
  conduitLine,
  { scaleY: 0 },
  {
    scaleY: 1,
    transformOrigin: "top center",
    ease: "none",
    scrollTrigger: {
      trigger: timelineContainer,
      start: "top 75%",
      end: "bottom 80%",
      scrub: 1.0,
    },
  }
);

// Amber Waypoint Beacon tracking current active chapter
ScrollTrigger.create({
  trigger: milestoneItem,
  start: "top center",
  end: "bottom center",
  onEnter: () => activateWaypoint(index),
  onEnterBack: () => activateWaypoint(index),
});
```

---

## 9. Atmospheric Particle Engine (Falling Leaves & Wind Wake)

### Architecture
- **Peaceful Organic Drift**: Leaves drift gently, gracefully, and undisturbed across the screen with natural oscillations and 3D flips (not violently repelled by the cursor).
- **Subtle Cursor Stardust**: Moving the mouse generates delicate golden embers and amber stardust trails along the pointer path without scattering or disturbing the leaves.
- **Zero Screen Clutter**: Pure, peaceful atmospheric background rendering without any intrusive floating buttons, dials, or manual triggers.

### Maple Leaf Drawing Routine
```tsx
const drawMapleLeaf = (ctx: CanvasRenderingContext2D, size: number, color: string, opacity: number, flipAngle: number) => {
  ctx.save();
  ctx.scale(Math.cos(flipAngle), 1); // 3D tumbling flip simulation
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.5, -size * 0.5, size * 0.8, -size * 0.4);
  ctx.bezierCurveTo(size * 0.5, -size * 0.1, size * 0.7, size * 0.3, size * 0.5, size * 0.6);
  ctx.bezierCurveTo(size * 0.2, size * 0.4, size * 0.1, size * 0.7, 0, size * 0.9);
  ctx.bezierCurveTo(-size * 0.1, size * 0.7, -size * 0.2, size * 0.4, -size * 0.5, size * 0.6);
  ctx.bezierCurveTo(-size * 0.7, size * 0.3, -size * 0.5, -size * 0.1, -size * 0.8, -size * 0.4);
  ctx.bezierCurveTo(-size * 0.5, -size * 0.5, -size * 0.3, -size * 0.8, 0, -size);
  ctx.closePath();
  ctx.fill();

  // Leaf Stem
  ctx.strokeStyle = "rgba(40, 28, 22, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.4);
  ctx.lineTo(0, size * 1.15);
  ctx.stroke();

  ctx.restore();
};
```

---

## 10. Holographic 3D Modal Inspector (Certifications Section)

### Mechanical Vault Entrance
When inspecting an official certificate or diploma:
```tsx
gsap.fromTo(
  modalRef.current,
  {
    transformOrigin: "center center",
    scale: 0.82,
    rotateX: 20,
    y: 40,
    opacity: 0.1,
    filter: "brightness(2) drop-shadow(0 0 35px rgba(240,163,82,0.8))",
  },
  {
    scale: 1,
    rotateX: 0,
    y: 0,
    opacity: 1,
    filter: "brightness(1) drop-shadow(0 30px 80px rgba(0,0,0,0.95))",
    duration: 0.6,
    ease: "back.out(1.2)",
  }
);
```

### Direct PDF Document Binding
Each credential card presents a rendered PNG snapshot with an active action bar linking directly to the high-resolution source PDF via:
```tsx
<a
  href={cert.pdfUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="px-5 py-2.5 rounded-xl bg-[#F0A352] text-[#181310] font-bold font-mono text-xs flex items-center gap-2 hover:bg-[#FFE8B8] transition-all shadow-[0_0_20px_rgba(240,163,82,0.35)] shrink-0 hover:scale-105"
>
  <ExternalLink className="w-4 h-4" />
  <span>Open Official PDF</span>
</a>
```

---

## 11. Glassmorphism CSS Tokens & Ambient Lighting

Add these utility tokens to your `globals.css` or Tailwind config:

```css
/* Deep Glass Panel Base */
.glass-panel {
  background: rgba(24, 19, 16, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 111, 59, 0.32);
}

/* Warm Amber Ambient Panel */
.glass-panel-warm {
  background: rgba(29, 23, 20, 0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(240, 163, 82, 0.38);
}

/* Active Amber Glow Shadow */
.amber-glow {
  box-shadow: 0 0 25px rgba(240, 163, 82, 0.35);
}

/* Autumn Radial Spotlight */
.autumn-spotlight {
  background: radial-gradient(ellipse at 50% 35%, rgba(240, 163, 82, 0.14) 0%, transparent 65%);
}
```

---

## 12. Master Checklist for New Projects

When starting any new web application, portfolio, or landing page with this aesthetic:

- [ ] **Background**: Set background to `#201C19` (not pure black `#000` or plain `#111`).
- [ ] **Smooth Scrolling**: Initialize Lenis with `lerp: 0.08` and hook into `gsap.ticker`.
- [ ] **Parallax Drift**: Background artwork must subtly drift (`yPercent: 12-18`) on `ScrollTrigger` with `scrub: 1.0`.
- [ ] **Top Amber Edge**: Add `h-[2px] bg-gradient-to-r from-transparent via-[#F0A352] to-transparent` to all elevated cards.
- [ ] **Tilt Interaction**: Implement `perspective(1200px)` with dynamic radial specular glare on pointer hover.
- [ ] **Card Unfolding**: Unfold detail sidebars from the card origin (`scaleX: 0 -> 1`, `rotateY: -55deg -> 0deg`) using `back.out(1.15)`.
- [ ] **Horizontal Runways**: Calculate track width dynamically and set runway duration to $\ge 2.8 \times$ viewport height.
- [ ] **No Ugly Gadgets**: Use subtle, ambient particle physics (floating leaves and wind embers) rather than intrusive physical machines.

---
*Created by Asli Mich Jose · Creative Frontend Developer & UI/UX Engineer*
