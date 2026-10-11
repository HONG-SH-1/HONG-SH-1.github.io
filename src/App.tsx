import projectsData from "./data/projects.json";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Competencies } from "./components/Competencies";
import { EducationSection } from "./components/EducationSection";
import { TechStack } from "./components/TechStack";
import { ProjectsSection } from "./components/ProjectsSection";
import { CosmicBackground } from "./components/CosmicBackground";
import { SectionRail } from "./components/SectionRail";
import { Footer } from "./components/Footer";
import {
  BackgroundViewProvider,
  useBackgroundView,
} from "./context/BackgroundViewContext";
import { SectionScrollProvider } from "./context/SectionScrollContext";
import { useInitialScroll } from "./hooks/useInitialScroll";
import type { ProjectItem } from "./types/project";

const projects = projectsData as ProjectItem[];
const GITHUB_PROFILE = "https://github.com/HONG-SH-1";

function AppShell() {
  const { backgroundOnly } = useBackgroundView();
  useInitialScroll();

  return (
    <div className="relative min-h-screen">
      <CosmicBackground />

      <div
        className={`pointer-events-none fixed inset-0 z-[1] cosmic-vignette transition-opacity duration-500 ${
          backgroundOnly ? "opacity-30" : "opacity-100"
        }`}
      />

      <Header />

      <div
        className={
          backgroundOnly
            ? "invisible pointer-events-none select-none"
            : undefined
        }
        aria-hidden={backgroundOnly}
      >
        <SectionRail />
        <main className="relative z-10 mx-auto max-w-wide px-margin-mobile pt-[4.5rem] md:px-margin-desktop">
          <Hero />
          <Competencies />
          <EducationSection />
          <TechStack />
          <ProjectsSection projects={projects} />
        </main>
        <Footer githubUrl={GITHUB_PROFILE} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SectionScrollProvider>
      <BackgroundViewProvider>
        <AppShell />
      </BackgroundViewProvider>
    </SectionScrollProvider>
  );
}
