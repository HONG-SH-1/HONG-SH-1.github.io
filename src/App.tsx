import projectsData from "./data/projects.json";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Competencies } from "./components/Competencies";
import { EducationSection } from "./components/EducationSection";
import { TechStack } from "./components/TechStack";
import { ProjectsSection } from "./components/ProjectsSection";
import type { ProjectItem } from "./types/project";

/** JSON을 프로젝트 타입으로 단언 (빌드 시 타입 검사) */
const projects = projectsData as ProjectItem[];

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-zinc-500 sm:px-6">
      <p>© {new Date().getFullYear()} 홍승현. GitHub Pages 정적 호스팅.</p>
    </footer>
  );
}

/** 앱 루트 레이아웃 — 소개 → 역량 → 교육 → 스택 → 프로젝트 */
export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Competencies />
        <EducationSection />
        <TechStack />
        <ProjectsSection projects={projects} />
      </main>
      <Footer />
      {/* PDF 플로팅 버튼 — 임시 숨김 */}
      {false &&
      <a
        href="/assets/portfolio.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="포트폴리오 PDF 열기"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-accent/40 bg-[#0b0e14] px-4 py-3 text-sm font-medium text-accent shadow-lg shadow-accent/10 transition hover:bg-accent hover:text-white hover:shadow-accent/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        Portfolio PDF
      </a>
      }
    </div>
  );
}
