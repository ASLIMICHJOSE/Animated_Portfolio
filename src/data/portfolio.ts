export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  year: string;
  role?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  skills: {
    name: string;
    level?: string;
    description?: string;
  }[];
}

export interface JourneyMilestone {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    bio: string[];
    philosophy: string;
    currentLearning: string[];
    interests: string[];
    location: string;
    availability: string;
  };
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  skillCategories: SkillCategory[];
  projects: Project[];
  journey: JourneyMilestone[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "ASLI MICH JOSE",
    title: "Creative Frontend Developer & UI/UX Engineer",
    tagline: "Bridging cinematic autumn aesthetics with modern high-performance web engineering.",
    bio: [
      "Hello! I am Asli Mich Jose, a creative developer passionate about transforming digital surfaces into expressive, atmospheric spaces. Inspired by cinematic atmosphere, editorial design, and responsive systems, I focus on crafting interfaces that feel tactile and memorable.",
      "My development journey centers on building fast, accessible web applications using modern React ecosystems, TypeScript, and fluid motion design principles that respect user intent and performance."
    ],
    philosophy:
      "Code is the invisible architecture; animation is the living breath. A great digital experience should evoke the serenity of an autumn evening—calm, intentional, and deeply resonant.",
    currentLearning: [
      "Three.js & Canvas-driven spatial physics",
      "Next.js App Router performance optimizations",
      "Design systems & accessible micro-interactions",
      "Creative shader and spatial choreography"
    ],
    interests: [
      "Cinematic UI & Motion Direction",
      "Minimalist Editorial Typography",
      "Atmospheric Autumn Landscapes",
      "Interactive Storytelling & Web Experiments"
    ],
    location: "Available Globally / Remote",
    availability: "Open to Collaborations & Engineering Roles"
  },
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "aslimichjose@example.com"
  },
  skillCategories: [
    {
      title: "Frontend Development",
      subtitle: "Interface & Architecture",
      skills: [
        { name: "React", description: "Component architecture & hooks" },
        { name: "Next.js", description: "App Router, SSR, and static generation" },
        { name: "HTML5", description: "Semantic markup and accessibility" },
        { name: "CSS3 / Tailwind", description: "Responsive layouts and modern styling" },
        { name: "GSAP & Web Animations", description: "Cinematic timeline choreography" }
      ]
    },
    {
      title: "Programming Languages",
      subtitle: "Typed Core Systems",
      skills: [
        { name: "JavaScript (ES6+)", description: "Modern syntax, async patterns, and DOM" },
        { name: "TypeScript", description: "Strict typing and modular interfaces" }
      ]
    },
    {
      title: "Backend Development",
      subtitle: "Server & Runtime",
      skills: [
        { name: "Node.js (Basics)", description: "Server-side runtimes and tooling" },
        { name: "RESTful APIs", description: "Endpoint integration and data fetching" }
      ]
    },
    {
      title: "Databases & Storage",
      subtitle: "Persistence Layer",
      skills: [
        { name: "SQL Basics", description: "Relational query fundamentals" },
        { name: "Local & Session Storage", description: "Client-side persistence patterns" }
      ]
    },
    {
      title: "Tools & Workflow",
      subtitle: "Engineering Ecosystem",
      skills: [
        { name: "Git", description: "Version control and branching strategies" },
        { name: "GitHub", description: "Repository hosting, pull requests, and CI/CD basics" },
        { name: "VS Code", description: "Tailored developer workflow and debugging" },
        { name: "Figma (Basics)", description: "Design inspection and asset preparation" }
      ]
    }
  ],
  projects: [
    {
      id: "project-autumn-studio",
      title: "Autumn Studio Showcase",
      category: "Creative Web Experience",
      year: "2026",
      role: "Lead Creative Technologist",
      description:
        "A cinematic brand showcase exploring fluid GSAP transitions, bespoke typography layouts, and warm autumn color harmonies.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
      image: "/images/project-autumn-workspace.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true,
      highlights: [
        "Architected zero-jank GSAP scroll choreography linked to Lenis lerp engine",
        "Custom SVG bezier wave filters delivering organic atmospheric warmth",
        "Full keyboard-navigable a11y focus routing and screen reader optimization"
      ],
      metrics: [
        { label: "Frame Rate", value: "60 FPS" },
        { label: "Lighthouse", value: "99/100" },
        { label: "Load Time", value: "0.6s" }
      ]
    },
    {
      id: "project-autumn-flow",
      title: "Node Flow Architecture",
      category: "Interactive Data Lab",
      year: "2025",
      role: "Frontend Systems Engineer",
      description:
        "A concept exploration of node-based state flow visualization featuring glassmorphic controls and responsive motion design.",
      techStack: ["React", "TypeScript", "Canvas API", "Tailwind CSS"],
      image: "/images/project-creative-lab.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true,
      highlights: [
        "High-performance HTML5 Canvas renderer capable of handling 500+ nodes",
        "Spatial collision detection with QuadTree spatial index partitioning",
        "Glassmorphic design system tuned with hardware-accelerated backdrop blur"
      ],
      metrics: [
        { label: "Active Nodes", value: "500+" },
        { label: "Input Latency", value: "< 4ms" },
        { label: "Test Coverage", value: "94%" }
      ]
    },
    {
      id: "project-editorial-journal",
      title: "Editorial Narrative Engine",
      category: "Editorial Platform",
      year: "2025",
      role: "UI/UX & Frontend Architect",
      description:
        "A minimalist publishing experience emphasizing generous whitespace, typographic rhythm, and smooth page transitions.",
      techStack: ["Next.js", "Tailwind CSS", "Lucide React"],
      image: "/images/hero-autumn-city.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: false,
      highlights: [
        "Bespoke modular serif typography system with automated baseline grid alignment",
        "View Transitions API integration for seamless zero-reload chapter switching",
        "Adaptive reading progress tracker with chapter-based memory persistence"
      ],
      metrics: [
        { label: "CLS Score", value: "0.00" },
        { label: "Bundle Size", value: "48 KB" },
        { label: "Font Swap", value: "0ms" }
      ]
    },
    {
      id: "project-komorebi-audio",
      title: "Komorebi Spatial Audio",
      category: "Atmospheric Soundscape",
      year: "2026",
      role: "Full Stack Creative Developer",
      description:
        "An ambient sound laboratory generating generative autumn forest soundscapes using Web Audio synthesis and procedural canvas visuals.",
      techStack: ["Web Audio API", "Next.js", "TypeScript", "Canvas"],
      image: "/images/skills-autumn-pavilion.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true,
      highlights: [
        "Custom biquad filter audio graphs simulating natural forest acoustic reverb",
        "Procedural leaf wind simulation synchronized to sound amplitude frequencies",
        "Offline audio buffer caching for instant background playback without latency"
      ],
      metrics: [
        { label: "Audio Graph", value: "32 Nodes" },
        { label: "Audio Latency", value: "5.8ms" },
        { label: "User Retention", value: "4.8m" }
      ]
    },
    {
      id: "project-zenith-velocity",
      title: "Zenith Velocity Engine",
      category: "WebGL Motion Architecture",
      year: "2026",
      role: "Motion Graphics & WebGL Engineer",
      description:
        "High-performance motion framework exploring kinetic typography, GPU particle fields, and inertial physics transitions.",
      techStack: ["WebGL", "Three.js", "GSAP", "TypeScript"],
      image: "/images/journey-autumn-train.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true,
      highlights: [
        "GPU instanced mesh system animating 12,000 particles at smooth 60fps",
        "Custom fragment shaders simulating autumnal dusk chromatic aberration",
        "Dynamic touch gesture recognition with spring damping physics"
      ],
      metrics: [
        { label: "Particles", value: "12,000" },
        { label: "GPU Load", value: "< 14%" },
        { label: "FPS Stability", value: "99.8%" }
      ]
    }
  ],
  journey: [
    {
      period: "Chapter 01",
      title: "Foundations & Visual Curiosity",
      subtitle: "Discovering Code as a Creative Medium",
      description:
        "Began exploring modern web standards, semantic HTML, and responsive CSS. Developed a fascination with bridging visual art, cinematography, and interactive web pages.",
      tags: ["HTML5", "CSS3", "JavaScript Fundamentals", "UI Exploration"]
    },
    {
      period: "Chapter 02",
      title: "Component Architecture & TypeScript",
      subtitle: "Elevating Structure and Scalability",
      description:
        "Transitioned into the React and TypeScript ecosystems. Focused on writing typed, modular components and understanding state lifecycles and modern front-end tooling.",
      tags: ["React", "TypeScript", "Tailwind CSS", "Modular Architecture"]
    },
    {
      period: "Chapter 03",
      title: "Fullstack Exploration & Next.js",
      subtitle: "Expanding Horizons with App Router",
      description:
        "Dived into Next.js App Router, server-rendered components, API endpoints, and clean git collaboration workflows using GitHub.",
      tags: ["Next.js", "App Router", "API Integration", "Git & GitHub"]
    },
    {
      period: "Chapter 04",
      title: "Cinematic Motion & Future Horizon",
      subtitle: "Refining Craft, Physics & Animation",
      description:
        "Actively deepening expertise in GSAP ScrollTrigger choreography, canvas-based ambient effects, accessibility, and high-performance design systems.",
      tags: ["GSAP ScrollTrigger", "Motion Design", "Accessibility", "Performance"]
    }
  ]
};
