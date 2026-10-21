# Design System, Appearance & Animation Memory

This rule is a permanent memory specification for Asli Mich Jose J's portfolio and associated project builds. Apply these exact patterns, tokens, and motion guidelines in every future conversation.

## 1. Color Palette (Autumn Glassmorphism)
- **Base Background**: `#201C19` (Deep Roasted Charcoal / Espresso)
- **Glass Surfaces**: `#181310` / `#161210` / `#1D1714` with `backdrop-blur-xl`
- **Primary Accent**: `#F0A352` (Luminous Warm Amber / Golden Honey)
- **Secondary Accent**: `#C96F3B` (Autumn Terracotta / Rust)
- **Light Highlight**: `#FFE8B8` (Soft Sunlight Cream)
- **Text**: `#F5EFE5` (Linen Ivory with `/90`, `/80`, `/70`, `/50` opacity scales)
- **Card Borders**: `border-[#C96F3B]/30` to `/35`, glowing `#F0A352` with amber ring on hover/active.
- **Top Flare**: `h-[2px]` gradient flare (`from-transparent via-[#F0A352] to-transparent`).

## 2. Typography
- **Headings**: Editorial Serif (`font-serif font-black` or `font-bold`), tracking-tight, uppercase badges, bold periods with `#F0A352` accent dots.
- **Body**: Clean modern Sans-serif (`font-sans font-light` / `font-normal`) with `leading-relaxed`.
- **Badges / Tech Specs**: Monospace (`font-mono`) with uppercase letter spacing (`tracking-widest` / `tracking-wider`).

## 3. Motion & Animation Principles
- **No Flat Fades**: Use physical 3D unfolds, mechanical latches, or magnetic snap entrances.
- **3D Card-Origin Unfold**:
  - Emerging panels must unfold from the origin of the card (`transformOrigin: "left center"`, `scaleX: 0 -> 1`, `rotateY: -55deg -> 0deg`, `ease: "back.out(1.15)"`).
  - Vertical laser energy flare along the connection seam.
- **Stepped Lenis Card Stacking**:
  - Multi-card stacks use stepped resting offsets (`y: i * 42px`) and `transformOrigin: "top center"`.
  - All preceding card top tab headers (`01`, `02`, `03`...) remain permanently visible, tiered, and touchable even when on the last card.
- **Interactive 3D Mouse Tilt & Glare**:
  - Cards track pointer coordinates on `mousemove` (`rotateX: ±8deg`, `rotateY: ±8deg`, `scale3d: 1.025`).
  - Dynamic radial amber glare spotlight (`radial-gradient(circle at glareX% glareY%, rgba(240, 163, 82, 0.22) 0%, transparent 65%)`).
- **Smooth Scroll Synchronization**:
  - Set `scrub: 1.0` to match Lenis smooth inertia.
  - Horizontal scroll distances must be proportional to track length (`Math.max(window.innerHeight * 2.8, travel * 1.15)`).
- **Conduit & Waypoint Beacon**:
  - Vertical flow conduit lines with traveling glowing waypoint beacons (`shadow-[0_0_20px_#F0A352]`).

## 4. Imagery & Atmosphere
- Cinematic anime autumn backdrops (city boulevards, waterfront reflections, tranquil verandas, twilight scenes, railway tracks).
- Radial amber warmth glow following the center of sections.
- Atmospheric falling leaves particle system with interactive physics.
