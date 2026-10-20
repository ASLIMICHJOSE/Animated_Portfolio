export interface Project {
  id: string;
  title: string;
  japaneseTitle?: string;
  category: string;
  description: string;
  techStack: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  year: string;
}

export interface SkillCategory {
  title: string;
  japaneseSubtitle: string;
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
    kanjiName: string;
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
    kanjiName: "アスリ・ミチ・ホセ",
    title: "Creative Frontend Developer & UI/UX Engineer",
    tagline: "Bridging cinematic anime aesthetics with modern high-performance web engineering.",
    bio: [
      "Hello! I am Asli Mich Jose, a creative developer passionate about transforming digital surfaces into expressive, atmospheric spaces. Inspired by Japanese animation aesthetics, editorial design, and responsive systems, I focus on crafting interfaces that feel tactile and memorable.",
      "My development journey centers on building fast, accessible web applications using modern React ecosystems, TypeScript, and fluid motion design principles that respect user intent and performance."
    ],
    philosophy:
      "Code is the invisible architecture; animation is the living breath. A great digital experience should evoke the serenity of an autumn evening—calm, intentional, and deeply resonant.",
    currentLearning: [
      "Advanced GSAP & Canvas-driven physics",
      "Next.js App Router performance optimizations",
      "Design systems & accessible micro-interactions",
      "Creative shader and SVG choreography"
    ],
    interests: [
      "Cinematic UI & Motion Direction",
      "Minimalist Editorial Typography",
      "Autumn & Japanese Aesthetic Scenery",
      "Interactive Storytelling & Web Experiments"
    ],
    location: "Available Globally / Remote",
    availability: "Open to Collaborations & Junior / Mid Engineering Roles"
  },
  socials: {
    github: "https://github.com", // Replace with your personal GitHub URL
    linkedin: "https://linkedin.com", // Replace with your personal LinkedIn URL
    email: "aslimichjose@example.com" // Replace with your contact email
  },
  skillCategories: [
    {
      title: "Frontend Development",
      japaneseSubtitle: "フロントエンド開発",
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
      japaneseSubtitle: "プログラミング言語",
      skills: [
        { name: "JavaScript (ES6+)", description: "Modern syntax, async patterns, and DOM" },
        { name: "TypeScript", description: "Strict typing and modular interfaces" }
      ]
    },
    {
      title: "Backend Development",
      japaneseSubtitle: "バックエンド基盤",
      skills: [
        { name: "Node.js (Basics)", description: "Server-side runtimes and tooling" },
        { name: "RESTful APIs", description: "Endpoint integration and data fetching" }
      ]
    },
    {
      title: "Databases & Storage",
      japaneseSubtitle: "データベース",
      skills: [
        { name: "SQL Basics", description: "Relational query fundamentals" },
        { name: "Local & Session Storage", description: "Client-side persistence patterns" }
      ]
    },
    {
      title: "Tools & Workflow",
      japaneseSubtitle: "開発ツールと環境",
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
      id: "project-momiji-studio",
      title: "Momiji Creative Studio",
      japaneseTitle: "紅葉スタジオ",
      category: "Creative Web Experience",
      year: "2026",
      description:
        "A sample cinematic brand showcase exploring fluid GSAP transitions, bespoke typography layouts, and warm autumn color harmonies.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
      image: "/images/project-autumn-workspace.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true
    },
    {
      id: "project-autumn-flow",
      title: "Aki-Node Architecture",
      japaneseTitle: "秋ノード",
      category: "Interactive Data Lab",
      year: "2025",
      description:
        "A concept exploration of node-based state flow visualization featuring glassmorphic controls and responsive motion design.",
      techStack: ["React", "TypeScript", "Canvas API", "Tailwind CSS"],
      image: "/images/project-creative-lab.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: true
    },
    {
      id: "project-shinkai-journal",
      title: "Komorebi Editorial Engine",
      japaneseTitle: "木漏れ日エディトリアル",
      category: "Editorial Platform",
      year: "2025",
      description:
        "A minimalist publishing experience emphasizing generous whitespace, typographic rhythm, and smooth page transitions.",
      techStack: ["Next.js", "Tailwind CSS", "Lucide React"],
      image: "/images/hero-autumn-city.jpg",
      githubUrl: "https://github.com",
      liveUrl: "#",
      featured: false
    }
  ],
  journey: [
    {
      period: "Chapter 01",
      title: "Foundations & Visual Curiosity",
      subtitle: "Discovering Code as a Creative Medium",
      description:
        "Began exploring modern web standards, semantic HTML, and responsive CSS. Developed a fascination with bridging visual art, Japanese anime cinematography, and interactive web pages.",
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
