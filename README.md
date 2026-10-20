# ASLI MICH JOSE — Cinematic Autumn Developer Portfolio

An immersive, production-grade personal developer portfolio inspired by cinematic anime environments (Makoto Shinkai aesthetic), autumn scenery, elegant editorial typography, and creative studio design.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP**, and **Lenis**.

---

## 🍁 Features & Highlights

- **Atmospheric Autumn Visuals:**
  - Layered golden-hour anime city landscapes with realistic lighting and depth.
  - Continuous, lightweight canvas-driven Japanese maple leaf flutter physics that respond to wind and pointer movement.
  - Subtle film grain and frosted glassmorphic card overlays.
- **Cinematic Animation System:**
  - GSAP & ScrollTrigger scroll-driven parallax layers.
  - Editorial text reveals and staggered card entrances.
  - Smooth inertia scrolling powered by Lenis with automatic ticker synchronization.
  - Full support for `prefers-reduced-motion` for accessibility.
- **Editorial Typography & Color Direction:**
  - Display Serif: *Cinzel* for commanding editorial titles.
  - Sans-Serif: *Plus Jakarta Sans* for modern, legible body copy.
  - Monospace: *JetBrains Mono* for technical badges and metadata.
  - Curated Autumn Palette:
    - Warm Cream: `#F5EFE5`
    - Burnt Orange: `#C96F3B`
    - Deep Brown: `#392820`
    - Autumn Rust: `#9E472D`
    - Muted Olive: `#777957`
    - Dark Cinematic Background: `#201C19`
- **Modular Sections:**
  - **Section A (Hero):** Full-screen opening with layered scenery, monolithic typography, Japanese subtitle badge, and scroll indicator.
  - **Section B (About):** Warm developer studio scene, personal philosophy, current learning expeditions, and creative focus areas.
  - **Section C (Skills):** Editorial categorization without misleading percentage meters.
  - **Section D (Projects):** Rich showcase with interactive hover states, technology pills, and live demo/source links.
  - **Section E (Journey):** Visual storytelling timeline along an anime autumn railway.
  - **Section F (Contact):** Twilight riverside scene with interactive email copy-to-clipboard feedback, social links, and minimal footer.

---

## 🛠️ Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts, metadata & viewport
│   ├── page.tsx           # Assembled portfolio narrative
│   └── globals.css        # Tailwind theme, film grain, and custom scrollbar
├── components/
│   ├── navigation/
│   │   └── Navbar.tsx     # Floating frosted glass navbar & mobile drawer
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── JourneySection.tsx
│   │   └── ContactSection.tsx
│   ├── animation/
│   │   ├── FallingLeaves.tsx  # High-performance canvas leaf physics
│   │   └── SmoothScroll.tsx   # Lenis smooth scrolling wrapper
│   └── ui/
│       ├── Button.tsx         # Accessible buttons with variants
│       ├── SectionHeading.tsx # Editorial chapter titles with Kanji scripts
│       ├── ProjectCard.tsx    # Project card with preview & links
│       └── Icons.tsx          # Crisp SVG brand icons
├── data/
│   └── portfolio.ts       # Centralized editable portfolio data
└── lib/
    └── animations.ts      # GSAP and ScrollTrigger initialization
```

---

## 📝 Editing Portfolio Content

All personal details, skills, projects, and social links are centrally configured in:
👉 [`src/data/portfolio.ts`](file:///d:/Animated_Portfolio/src/data/portfolio.ts)

Simply open this file to update:
- Personal name, bio, and philosophy
- Skills and category descriptions
- Project titles, descriptions, preview images, and links
- Learning milestones and journey chapters
- Social links (GitHub, LinkedIn, Email)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested with Node 20 & Node 26)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the active port reported in terminal) to view the portfolio.

### 3. Production Build
```bash
npm run build
```

### 4. Run Production Server
```bash
npm run start
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Vercel automatically detects Next.js:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository to [Netlify](https://www.netlify.com).
2. Set build command: `npm run build`
3. Set publish directory: `.next`

---

## 📄 License
Created for **ASLI MICH JOSE**. Free to adapt for personal portfolio use.
