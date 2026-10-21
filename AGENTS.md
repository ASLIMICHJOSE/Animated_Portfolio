<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Persistent Project Design & Animation Memory

This rule specifies the exact design language, color palette, typography, visual aesthetic, and animation principles used across our portfolio and projects. Follow these standards in every chat session.

## 1. Color Palette & Aesthetics (Warm Autumn Glassmorphism)
- **Primary Background**: `#201C19` (Deep Roasted Charcoal / Espresso)
- **Glass Surfaces & Panels**: `#181310` / `#161210` / `#1D1714` with `backdrop-blur-xl`
- **Primary Warm Accent**: `#F0A352` (Luminous Amber / Golden Honey)
- **Secondary Warm Accent**: `#C96F3B` (Autumn Terracotta / Rust)
- **Light Accent / Highlights**: `#FFE8B8` (Soft Sunlight Cream)
- **Body Text**: `#F5EFE5` (Linen Ivory with `/90`, `/80`, `/70`, `/50` opacity scales)
- **Glass Borders**: `border-[#C96F3B]/30` to `/35`, elevating to `#F0A352` with glowing amber ring/shadow on hover or active state.
- **Top Amber Flare**: Subtle `h-[2px]` gradient flare (`from-transparent via-[#F0A352] to-transparent`) at the top edge of cards.

## 2. Typography Hierarchy
- **Headings & Display**: Editorial Serif (`font-serif font-black` or `font-bold`), tracking-tight, uppercase badges, bold periods with `#F0A352` accent dots.
- **Body Copy**: Clean modern Sans-serif (`font-sans font-light` / `font-normal`) with `leading-relaxed`.
- **Technical Badges, Tags & Metrics**: Monospace (`font-mono`) with uppercase letter spacing (`tracking-widest` / `tracking-wider`).

## 3. Core Animation Principles & Mechanics
- **No Boring Flat Fade-ins**: Interactive elements should physically emerge, unfold, or tilt.
- **3D Card-Origin Unfolding**:
  - Emerging panels and drawers must unfold from the origin of the card (`transformOrigin: "left center"`, `scaleX: 0 -> 1`, `rotateY: -55deg -> 0deg`) using punchy mechanical ease (`back.out(1.15)`).
  - Include an amber vertical laser energy flare along the connection seam.
- **Lenis Cascading Card Stacks (Projects)**:
  - Cards stack with stepped resting offsets (`y: i * 42px`) and `transformOrigin: "top center"`.
  - All preceding card top tab headers (`01`, `02`, `03`...) remain permanently visible, tiered, and touchable even when viewing the last card.
- **Interactive 3D Mouse Tilt & Specular Glare**:
  - Cards track pointer coordinates on `mousemove` (`rotateX: ±8deg`, `rotateY: ±8deg`, `scale3d: 1.025`).
  - Dynamic radial amber glare spotlight (`radial-gradient(circle at glareX% glareY%, rgba(240, 163, 82, 0.22) 0%, transparent 65%)`).
- **Synchronized Smooth Scroll (Lenis & GSAP ScrollTrigger)**:
  - Scrub damping set to `scrub: 1.0` to match Lenis smooth inertia.
  - Horizontal scroll runways must never be rushed; distance must be calculated from actual track travel (`Math.max(window.innerHeight * 2.8, travel * 1.15)`).
- **Conduit & Waypoint Beacon**:
  - Vertical flow conduit lines with traveling glowing waypoint beacons (`shadow-[0_0_20px_#F0A352]`) leading the scroll progression.

## 4. Visual Imagery & Atmosphere
- Cinematic anime autumn backdrops (city boulevards, waterfront reflections, tranquil verandas, twilight scenes, railway tracks).
- Radial amber warmth glow following the center of sections.
- Atmospheric falling leaves particle system with interactive physics.
