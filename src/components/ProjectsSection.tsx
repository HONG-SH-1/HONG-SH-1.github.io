import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProjectItem } from "../types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectTabsView } from "./ProjectTabsView";
import { ProjectSlideFrame } from "./ProjectSlideFrame";
import { ProjectSlideNav } from "./ProjectSlideNav";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

type Category = "team" | "individual";
type SlideDirection = "next" | "prev" | "none";

function collaborationOf(p: ProjectItem): "team" | "individual" {
  return p.collaboration ?? "team";
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const teamProjects = useMemo(
    () => projects.filter((p) => collaborationOf(p) === "team"),
    [projects]
  );
  const individualProjects = useMemo(
    () => projects.filter((p) => collaborationOf(p) === "individual"),
    [projects]
  );

  const hasTeam = teamProjects.length > 0;
  const hasIndividual = individualProjects.length > 0;
  const showCategoryTabs = hasTeam && hasIndividual;

  const [category, setCategory] = useState<Category>(
    hasTeam ? "team" : "individual"
  );
  const [activeId, setActiveId] = useState(
    (hasTeam ? teamProjects[0] : individualProjects[0])?.id ?? ""
  );
  const [direction, setDirection] = useState<SlideDirection>("none");

  const currentList = category === "team" ? teamProjects : individualProjects;
  const active =
    currentList.find((p) => p.id === activeId) ?? currentList[0] ?? null;

  const globalIndex = useMemo(() => {
    if (!active) return 0;
    return projects.findIndex((p) => p.id === active.id);
  }, [projects, active]);

  const selectProject = useCallback(
    (id: string, slideDirection: SlideDirection) => {
      setDirection(slideDirection);
      setActiveId(id);
    },
    []
  );

  const switchCategory = useCallback(
    (next: Category) => {
      if (next === category) return;
      setDirection("none");
      setCategory(next);
      const list = next === "team" ? teamProjects : individualProjects;
      setActiveId(list[0]?.id ?? "");
    },
    [category, teamProjects, individualProjects]
  );

  const goPrev = useCallback(() => {
    const idx = currentList.findIndex((p) => p.id === activeId);
    if (idx > 0) {
      selectProject(currentList[idx - 1].id, "prev");
      return;
    }
    if (category === "individual" && hasTeam) {
      setCategory("team");
      setDirection("prev");
      setActiveId(teamProjects[teamProjects.length - 1].id);
    }
  }, [
    activeId,
    category,
    currentList,
    hasTeam,
    selectProject,
    teamProjects,
  ]);

  const goNext = useCallback(() => {
    const idx = currentList.findIndex((p) => p.id === activeId);
    if (idx >= 0 && idx < currentList.length - 1) {
      selectProject(currentList[idx + 1].id, "next");
      return;
    }
    if (category === "team" && hasIndividual) {
      setCategory("individual");
      setDirection("next");
      setActiveId(individualProjects[0].id);
    }
  }, [
    activeId,
    category,
    currentList,
    hasIndividual,
    individualProjects,
    selectProject,
  ]);

  const canPrev = globalIndex > 0;
  const canNext = globalIndex >= 0 && globalIndex < projects.length - 1;

  useEffect(() => {
    if (projects.length === 0) return;
    if (!projects.some((p) => p.id === activeId)) {
      setActiveId(projects[0].id);
    }
  }, [projects, activeId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (projects.length === 0) return null;

  const PANEL_ID = "project-detail-panel";

  return (
    <AnimatedSection id="projects" className="border-t border-line py-section-y">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Projects"
          title="프로젝트"
          description="슬라이드로 프로젝트를 넘기며 상세 내용을 확인할 수 있습니다. ← → 키로도 이동할 수 있습니다."
        />

        {showCategoryTabs && (
          <div
            className="project-category-tabs"
            role="tablist"
            aria-label="프로젝트 분류"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === "team"}
              className="project-category-tab"
              data-active={category === "team"}
              onClick={() => switchCategory("team")}
            >
              팀 프로젝트
              <span className="project-category-count">{teamProjects.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={category === "individual"}
              className="project-category-tab"
              data-active={category === "individual"}
              onClick={() => switchCategory("individual")}
            >
              개인 프로젝트
              <span className="project-category-count">
                {individualProjects.length}
              </span>
            </button>
            <span
              className="project-category-indicator"
              data-category={category}
              aria-hidden
            />
          </div>
        )}

        {!showCategoryTabs && (
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-faint">
            {hasTeam ? "팀 프로젝트" : "개인 프로젝트"}
          </p>
        )}

        <ProjectSlideNav
          projects={currentList}
          activeId={active?.id ?? ""}
          onSelect={(id) => {
            const prevIdx = currentList.findIndex((p) => p.id === activeId);
            const nextIdx = currentList.findIndex((p) => p.id === id);
            const slideDirection: SlideDirection =
              nextIdx > prevIdx ? "next" : nextIdx < prevIdx ? "prev" : "none";
            selectProject(id, slideDirection);
          }}
          onPrev={goPrev}
          onNext={goNext}
          canPrev={canPrev}
          canNext={canNext}
        />

        {active && (
          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-label={`${active.title} 상세`}
            aria-live="polite"
            className="mt-gutter"
          >
            <ProjectSlideFrame slideKey={active.id} direction={direction}>
              {active.detailTabs && active.detailTabs.length > 0 ? (
                <ProjectTabsView project={active} />
              ) : (
                <ProjectCard project={active} />
              )}
            </ProjectSlideFrame>
          </div>
        )}
      </ScrollReveal>
    </AnimatedSection>
  );
}
