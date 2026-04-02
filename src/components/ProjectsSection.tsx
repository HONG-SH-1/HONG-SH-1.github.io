import { Fragment, useMemo, useState, type MouseEvent } from "react";
import { FolderGit2 } from "lucide-react";
import type { ProjectItem } from "../types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectTabsView } from "./ProjectTabsView";

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

/**
 * 프로젝트 영역 — 탭으로 프로젝트 전환 + 선택된 항목은 카드로 상세 표시
 */
const projectCardLift = {
  style: { transition: "all 0.3s ease" } as const,
  onMouseEnter: (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 0 24px rgba(74,222,128,0.15)";
  },
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  },
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");

  const active = useMemo(
    () => projects.find((p) => p.id === activeId) ?? projects[0],
    [projects, activeId]
  );

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent">
          <FolderGit2 className="h-4 w-4" aria-hidden />
          Projects
        </h2>
        <p className="mb-8 text-2xl font-semibold text-zinc-100">프로젝트</p>

        {/* 탭 버튼: JSON 항목 수만큼 자동 생성 */}
        <div
          className="mb-6 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm"
          role="tablist"
          aria-label="프로젝트 선택"
        >
          {projects.map((p, idx) => {
            const selected = p.id === active?.id;
            const kind = p.collaboration ?? "team";
            const prevKind = idx > 0 ? (projects[idx - 1].collaboration ?? "team") : undefined;
            const showGroupLabel = idx === 0 || prevKind !== kind;
            const groupLabel = kind === "individual" ? "개인 프로젝트" : "팀 프로젝트";

            return (
              <Fragment key={p.id}>
                {showGroupLabel && (
                  <div
                    className="flex w-full basis-full items-center gap-2 py-1.5 sm:py-0"
                    role="presentation"
                  >
                    <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      {groupLabel}
                    </span>
                    <span className="h-px min-w-[1.5rem] flex-1 bg-white/10" aria-hidden />
                  </div>
                )}
                <div className="inline-flex" {...projectCardLift}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`project-panel-${p.id}`}
                    id={`project-tab-${p.id}`}
                    onClick={() => setActiveId(p.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-accent/20 text-accent shadow-inner"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    {p.title}
                  </button>
                </div>
              </Fragment>
            );
          })}
        </div>

        {/* 활성 탭에 대응하는 패널 */}
        {active && (
          <div
            role="tabpanel"
            id={`project-panel-${active.id}`}
            aria-labelledby={`project-tab-${active.id}`}
            {...projectCardLift}
          >
            {active.detailTabs && active.detailTabs.length > 0 ? (
              <ProjectTabsView project={active} />
            ) : (
              <ProjectCard project={active} />
            )}
          </div>
        )}

      </div>
    </section>
  );
}
