import Navbar from "@/components/navigation/Navbar";
import FallingLeaves from "@/components/animation/FallingLeaves";
import CinematicWorld3D from "@/components/animation/CinematicWorld3D";
import SmoothScroll from "@/components/animation/SmoothScroll";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import JourneySection from "@/components/sections/JourneySection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#201C19] text-[#F5EFE5] film-grain selection:bg-[#C96F3B]/30 selection:text-[#F5EFE5]">
        {/* Continuous 3D WebGL Camera Flight World */}
        <CinematicWorld3D />

        {/* Interactive Physics Leaf Catcher Bucket & Ambient Leaves */}
        <FallingLeaves />

        {/* Global Navigation */}
        <Navbar />

        {/* Cinematic Spatial Portfolio Sections */}
        <main id="main-content" className="relative z-10">
          {/* Section A: Opening & Hero */}
          <HeroSection />

          {/* Section B: About Asli Mich Jose */}
          <AboutSection />

          {/* Section C: Editorial Skills Architecture */}
          <SkillsSection />

          {/* Section D: Selected Projects Showcase */}
          <ProjectsSection />

          {/* Section E: Visual Learning Journey */}
          <JourneySection />

          {/* Section F: Twilight Contact Scene & Footer */}
          <ContactSection />
        </main>
      </div>
    </SmoothScroll>
  );
}
