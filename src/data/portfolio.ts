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

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: "Cloud & Infrastructure" | "Database & AI" | "Artificial Intelligence" | "Software Engineering";
  description: string;
  skills: string[];
  period: string;
  credentialId?: string;
  verifyUrl?: string;
  image?: string;
  pdfUrl?: string;
  issueDate?: string;
  signee?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  technologies: string[];
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
    phone: string;
    education: Education;
    experience: Experience[];
  };
  socials: {
    github: string;
    linkedin: string;
    email: string;
    phone: string;
  };
  skillCategories: SkillCategory[];
  projects: Project[];
  journey: JourneyMilestone[];
  certifications: Certification[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "ASLI MICH JOSE J",
    title: "Full-Stack Web & Frontend Developer",
    tagline:
      "Computer Science Engineering student with frontend development internship experience and hands-on expertise building full-stack web, AI-powered, and e-commerce applications.",
    bio: [
      "I am a Computer Science Engineering student at Stella Mary's College of Engineering (2023–2027) with frontend development internship experience at Admini and a proven track record of engineering full-stack web applications.",
      "Proficient across JavaScript, React.js, Node.js, Express.js, REST APIs, and MongoDB. Passionate about architecting responsive user interfaces, AI-powered guidance tools, and scalable e-commerce systems with clean engineering standards."
    ],
    philosophy:
      "Code is the structural foundation; user experience is the human connection. A great digital solution balances rigorous architecture with effortless, engaging interaction.",
    currentLearning: [
      "AI Agents & Retrieval-Augmented Generation (RAG) with MongoDB",
      "Vector Search indexing & Semantic Embeddings",
      "Next.js App Router full-stack performance optimization",
      "High-throughput RESTful API architectures"
    ],
    interests: [
      "AI-Powered Application Engineering",
      "Hyperlocal E-Commerce Architecture",
      "Responsive Component Design Systems",
      "Cloud Deployment & Modern DevOps"
    ],
    location: "Tamil Nadu, India // Available Globally & Remote",
    availability: "Open to Full-Stack & Frontend Engineering Roles",
    phone: "+91-8903252575",
    education: {
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      institution: "Stella Mary's College of Engineering",
      period: "2023–2027",
      location: "Tamil Nadu, India"
    },
    experience: [
      {
        role: "Frontend Developer Intern",
        company: "Admini",
        period: "July 2025 – March 2026",
        location: "Remote / Hybrid",
        highlights: [
          "Developed responsive and reusable user interface components using React.js, JavaScript, and Tailwind CSS.",
          "Integrated REST APIs to retrieve and display backend data seamlessly within frontend components.",
          "Debugged UI issues and performed systematic troubleshooting to enhance overall application usability.",
          "Collaborated closely with the engineering team to implement frontend requirements and maintain consistent user experiences."
        ],
        technologies: ["React.js", "JavaScript", "Tailwind CSS", "REST APIs", "Git"]
      }
    ]
  },
  socials: {
    github: "https://github.com/ASLIMICHJOSE",
    linkedin: "https://www.linkedin.com/in/aslimichjose/",
    email: "aslimich22@gmail.com",
    phone: "+91-8903252575"
  },
  skillCategories: [
    {
      title: "Web Development",
      subtitle: "Full-Stack & Frontend Ecosystem",
      skills: [
        { name: "React.js", description: "Reusable component hierarchies & hooks" },
        { name: "Node.js", description: "Asynchronous backend runtimes & services" },
        { name: "Express.js", description: "RESTful API routing & middleware architecture" },
        { name: "HTML5 & CSS3", description: "Semantic markup, modern responsive styling" },
        { name: "Tailwind CSS", description: "Utility-first design systems & custom themes" },
        { name: "REST APIs", description: "Clean client-server contracts & data integration" }
      ]
    },
    {
      title: "Programming Languages",
      subtitle: "Core Typed & Scripting Languages",
      skills: [
        { name: "JavaScript (ES6+)", description: "Async patterns, promises, DOM manipulation" },
        { name: "Java", description: "Object-oriented software design & architectures" },
        { name: "Python", description: "Scripting, data handling, and AI tooling" },
        { name: "C & C++", description: "Memory management, algorithms & system fundamentals" },
        { name: "Dart", description: "Cross-platform mobile & UI engineering basics" }
      ]
    },
    {
      title: "Databases & Storage",
      subtitle: "Persistence & Vector Stores",
      skills: [
        { name: "MongoDB", description: "Document schemas, Atlas, aggregation & vector search" },
        { name: "Supabase", description: "PostgreSQL persistence, Auth & real-time subscriptions" },
        { name: "SQL", description: "Relational queries, table relations & joins" }
      ]
    },
    {
      title: "Core Computer Science",
      subtitle: "Foundational Engineering Disciplines",
      skills: [
        { name: "Data Structures & Algorithms (DSA)", description: "Trees, graphs, dynamic programming, complexity analysis" },
        { name: "Object-Oriented Programming (OOP)", description: "Encapsulation, inheritance, polymorphism & design patterns" },
        { name: "Database Management Systems (DBMS)", description: "ACID properties, indexing, normalization & transactions" },
        { name: "Operating Systems", description: "Process scheduling, concurrency, threads & memory hierarchy" }
      ]
    },
    {
      title: "Tools & Deployment",
      subtitle: "Developer Toolchain & Cloud DevOps",
      skills: [
        { name: "Git & GitHub", description: "Branching strategies, pull requests & code review" },
        { name: "Postman", description: "API testing, automated endpoint verification" },
        { name: "Microsoft Azure", description: "Cloud computing fundamentals & resource management" },
        { name: "Vercel & Render", description: "Continuous deployment pipelines for web & backend services" }
      ]
    }
  ],
  projects: [
    {
      id: "project-careerforge",
      title: "CareerForge",
      category: "AI-Powered Career Platform",
      year: "2025–2026",
      role: "Lead Full-Stack AI Engineer",
      description:
        "An AI-powered career guidance platform featuring automated resume parsing, ATS scoring engine, document verification, skill assessment, and personalized learning roadmaps.",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "AI APIs"],
      image: "/images/project-careerforge.jpg",
      githubUrl: "https://github.com/ASLIMICHJOSE/CareerForge",
      liveUrl: "https://github.com/ASLIMICHJOSE/CareerForge",
      featured: true,
      highlights: [
        "Architected full-stack career platform with automated resume parsing and multi-format document verification",
        "Engineered an ATS Score Engine calculating keyword density, formatting compliance, and job match compatibility",
        "Integrated AI APIs to analyze skill gaps and generate personalized learning roadmaps with career recommendations",
        "Connected responsive React.js frontend with secure Express.js and MongoDB backend services"
      ],
      metrics: [
        { label: "ATS Accuracy", value: "95%" },
        { label: "Parsing Speed", value: "< 1.2s" },
        { label: "API Endpoints", value: "24+" }
      ]
    },
    {
      id: "project-serofast",
      title: "SeroFast",
      category: "Hyperlocal E-Commerce",
      year: "2025",
      role: "Full-Stack Developer",
      description:
        "A high-speed hyperlocal e-commerce marketplace built with React 18, Vite 6, Express.js, and Supabase, featuring instant product catalogs, shopping carts, and order processing.",
      techStack: ["React 18", "Vite 6", "Node.js", "Express.js", "Supabase", "Tailwind CSS v4"],
      image: "/images/project-serofast.jpg",
      githubUrl: "https://github.com/Abinesh00173/serofast",
      liveUrl: "https://github.com/Abinesh00173/serofast",
      featured: true,
      highlights: [
        "Engineered responsive e-commerce web application with real-time product search, filtering, and persistent cart",
        "Implemented secure user authentication and order-processing workflows powered by Supabase backend services",
        "Developed full-stack frontend and Express.js REST APIs to support high-concurrency order operations",
        "Designed mobile-first component architecture using Tailwind CSS v4 design tokens"
      ],
      metrics: [
        { label: "Checkout Latency", value: "< 80ms" },
        { label: "Cart Speed", value: "60 FPS" },
        { label: "Mobile Responsive", value: "100%" }
      ]
    },
    {
      id: "project-admini-suite",
      title: "Admini UI Component Suite",
      category: "Production Enterprise Frontend",
      year: "2025–2026",
      role: "Frontend Developer Intern",
      description:
        "Production-grade reusable React.js component architecture and REST API data layer engineered during internship at Admini.",
      techStack: ["React.js", "JavaScript", "Tailwind CSS", "REST APIs", "Git"],
      image: "/images/hero-autumn-city.jpg",
      githubUrl: "https://github.com/ASLIMICHJOSE",
      liveUrl: "https://github.com/ASLIMICHJOSE",
      featured: true,
      highlights: [
        "Developed modular, accessible UI components deployed across production dashboards using React.js and Tailwind CSS",
        "Integrated complex REST APIs to retrieve, transform, and render real-time backend operational data",
        "Performed systematic UI debugging and usability troubleshooting to boost client task completion rates"
      ],
      metrics: [
        { label: "Component Reuse", value: "85%" },
        { label: "Bug Reduction", value: "40%" },
        { label: "Page Speed", value: "0.8s" }
      ]
    },
    {
      id: "project-autumn-studio",
      title: "Autumn Studio Showcase",
      category: "Creative Web Experience",
      year: "2026",
      role: "Creative Frontend Technologist",
      description:
        "A cinematic brand showcase exploring fluid GSAP transitions, bespoke typography layouts, and warm autumn color harmonies.",
      techStack: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
      image: "/images/skills-autumn-pavilion.jpg",
      githubUrl: "https://github.com/ASLIMICHJOSE",
      liveUrl: "#",
      featured: false,
      highlights: [
        "Architected zero-jank GSAP scroll choreography linked to Lenis lerp smooth scroll engine",
        "Custom SVG bezier wave filters delivering organic atmospheric warmth and responsive motion",
        "Full keyboard-navigable a11y focus routing and screen reader optimization"
      ],
      metrics: [
        { label: "Frame Rate", value: "60 FPS" },
        { label: "Lighthouse", value: "99/100" },
        { label: "Load Time", value: "0.6s" }
      ]
    },
    {
      id: "project-node-flow",
      title: "Node Flow Architecture",
      category: "Interactive Data Lab",
      year: "2025",
      role: "Frontend Systems Engineer",
      description:
        "A concept exploration of node-based state flow visualization featuring glassmorphic controls and responsive motion design.",
      techStack: ["React", "JavaScript", "Canvas API", "Tailwind CSS"],
      image: "/images/journey-autumn-train.jpg",
      githubUrl: "https://github.com/ASLIMICHJOSE",
      liveUrl: "#",
      featured: false,
      highlights: [
        "High-performance HTML5 Canvas renderer capable of handling 500+ interactive nodes",
        "Spatial collision detection with QuadTree spatial index partitioning",
        "Glassmorphic design system tuned with hardware-accelerated backdrop blur"
      ],
      metrics: [
        { label: "Active Nodes", value: "500+" },
        { label: "Input Latency", value: "< 4ms" },
        { label: "Test Coverage", value: "94%" }
      ]
    }
  ],
  journey: [
    {
      period: "Chapter 01 (2023–2024)",
      title: "Computer Science Foundations & Core Systems",
      subtitle: "Stella Mary's College of Engineering",
      description:
        "Commenced Bachelor of Engineering in Computer Science and Engineering. Built rigorous fundamentals in Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Java, C, and C++.",
      tags: ["DSA", "OOP", "DBMS", "OS", "Java", "C & C++"]
    },
    {
      period: "Chapter 02 (2024)",
      title: "Full-Stack Web Development & Modern JavaScript",
      subtitle: "Mastering React, Node.js & Databases",
      description:
        "Specialized in the modern web ecosystem. Built dynamic web applications using React.js, Node.js, Express.js, MongoDB, Supabase, and Tailwind CSS, focusing on clean REST API design and responsive interfaces.",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Supabase", "Tailwind CSS"]
    },
    {
      period: "Chapter 03 (2025)",
      title: "Flagship Platforms: CareerForge & SeroFast",
      subtitle: "AI Integrations & Hyperlocal E-Commerce",
      description:
        "Engineered CareerForge (AI-powered career guidance with automated resume parsing and roadmaps) and SeroFast (hyperlocal e-commerce platform with real-time carts and auth). Completed specialized MongoDB AI certifications.",
      tags: ["CareerForge", "SeroFast", "AI APIs", "Resume Parsing", "Vector Search"]
    },
    {
      period: "Chapter 04 (July 2025 – March 2026)",
      title: "Industry Internship & Production Engineering",
      subtitle: "Admini — Frontend Developer Intern",
      description:
        "Working as a Frontend Developer Intern at Admini. Developing production-grade reusable React components, integrating backend REST APIs, debugging complex UI challenges, and ensuring polished, high-performance usability.",
      tags: ["Admini Internship", "Reusable Components", "REST Integration", "UI Optimization"]
    }
  ],
  certifications: [
    {
      id: "cert-mongodb-ai-agents",
      title: "AI Agents with MongoDB",
      issuer: "MongoDB, Inc.",
      category: "Artificial Intelligence",
      credentialId: "MDBzmy9d48cie",
      period: "Issued 08-02-2026 · Verified",
      issueDate: "08-02-2026",
      signee: "Raghu Viswanathan (VP, Education, Academia, and Documentation)",
      image: "/certificates/mongodb-ai-agents.png",
      pdfUrl: "/certificates/mongodb-ai-agents.pdf",
      description:
        "Official Proof of Completion for engineering autonomous AI Agent architectures utilizing MongoDB as a persistent memory store, execution context, and tool-calling backend.",
      skills: ["AI Agents", "MongoDB Atlas", "Tool Calling", "Autonomous Workflows", "Agent Memory"]
    },
    {
      id: "cert-mongodb-ai-data-strategy",
      title: "AI Data Strategy with MongoDB",
      issuer: "MongoDB, Inc.",
      category: "Database & AI",
      credentialId: "MDB2g7794mb7u",
      period: "Issued 08-02-2026 · Verified",
      issueDate: "08-02-2026",
      signee: "Raghu Viswanathan (VP, Education, Academia, and Documentation)",
      image: "/certificates/mongodb-ai-data-strategy.png",
      pdfUrl: "/certificates/mongodb-ai-data-strategy.pdf",
      description:
        "Official Proof of Completion for formulating AI data architecture strategies with MongoDB, incorporating vector embeddings, operational pipelines, and unified intelligent data storage.",
      skills: ["AI Data Strategy", "MongoDB Atlas", "Vector Search", "Data Architecture", "Enterprise AI"]
    },
    {
      id: "cert-simplilearn-full-stack",
      title: "Full Stack Developer Certification",
      issuer: "Simplilearn SkillUp",
      category: "Software Engineering",
      credentialId: "10635740",
      period: "Issued 22nd Aug 2026 · Verified",
      issueDate: "22nd August 2026",
      signee: "Krishna Kumar (CEO, Simplilearn)",
      image: "/certificates/simplilearn-full-stack.png",
      pdfUrl: "/certificates/simplilearn-full-stack.pdf",
      description:
        "Official Certificate of Completion for rigorous full-stack web engineering curriculum covering modern frontend interfaces, backend server architectures, RESTful APIs, and database engineering.",
      skills: ["Full Stack Web", "React.js", "Node.js", "REST APIs", "Database Engineering", "DevOps"]
    },
    {
      id: "cert-azure-fundamentals",
      title: "Microsoft Azure Fundamentals",
      issuer: "Microsoft",
      category: "Cloud & Infrastructure",
      credentialId: "AZ-900-88319",
      period: "Issued Aug 2026 · Verified",
      issueDate: "August 2026",
      signee: "Satya Nadella (CEO, Microsoft Corporation)",
      image: "/certificates/azure-fundamentals.png",
      pdfUrl: "/certificates/azure-fundamentals.pdf",
      description:
        "Official Microsoft Certified certification verifying fundamental cloud concepts, core Azure architectural components, security, privacy, compliance, and cloud governance.",
      skills: ["Azure Cloud", "Cloud Architecture", "Security & Governance", "Cloud Services"]
    },
    {
      id: "cert-mongodb-vector-search",
      title: "MongoDB Vector Search Fundamentals",
      issuer: "MongoDB, Inc.",
      category: "Database & AI",
      credentialId: "MDBvtr8841sec",
      period: "Issued 08-02-2026 · Verified",
      issueDate: "08-02-2026",
      signee: "Raghu Viswanathan (VP, Education, Academia, and Documentation)",
      image: "/certificates/mongodb-vector-search.png",
      pdfUrl: "/certificates/mongodb-vector-search.pdf",
      description:
        "Official Proof of Completion for vector embeddings, high-dimensional vector indexing, semantic search pipelines, and generative AI search integrations on MongoDB Atlas.",
      skills: ["Vector Search", "Semantic Search", "Embeddings", "Atlas Vector Search"]
    },
    {
      id: "cert-rag-mongodb",
      title: "RAG with MongoDB",
      issuer: "MongoDB, Inc.",
      category: "Artificial Intelligence",
      credentialId: "MDBrag5519ctx",
      period: "Issued 08-02-2026 · Verified",
      issueDate: "08-02-2026",
      signee: "Raghu Viswanathan (VP, Education, Academia, and Documentation)",
      image: "/certificates/mongodb-rag.png",
      pdfUrl: "/certificates/mongodb-rag.pdf",
      description:
        "Official Proof of Completion for Retrieval-Augmented Generation (RAG) system design connecting Large Language Models with real-time operational data stores and vector indexes.",
      skills: ["RAG Architecture", "LLM Integration", "Context Retrieval", "Prompt Optimization"]
    },
    {
      id: "cert-career-essentials-software",
      title: "Career Essentials in Software Development",
      issuer: "Microsoft & LinkedIn Learning",
      category: "Software Engineering",
      credentialId: "MS-LK-918237",
      period: "Issued Aug 2026 · Verified",
      issueDate: "August 2026",
      signee: "Ryan Roslansky (CEO, LinkedIn) & Kate Johnson (Microsoft)",
      image: "/certificates/career-essentials-software.png",
      pdfUrl: "/certificates/career-essentials-software.pdf",
      description:
        "Official Professional Certificate of Completion demonstrating competencies in full-cycle software development methodologies, modern version control, agile workflows, and collaborative engineering standards.",
      skills: ["Software Engineering", "Git & GitHub", "Agile Methodologies", "Clean Code Standards"]
    }
  ]
};
