import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { FolderGit2 } from "lucide-react";
import type { ProjectItem } from "../types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectTabsView } from "./ProjectTabsView";

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

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

function collaborationOf(p: ProjectItem): "team" | "individual" {
  return p.collaboration ?? "team";
}

/**
 * 프로젝트 영역 — 상단: 팀/개인 목록(데스크톱 좌·우), 하단: 선택 프로젝트 상세 전체 너비(영상·ERD)
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");

  const teamProjects = useMemo(
    () => projects.filter((p) => collaborationOf(p) === "team"),
    [projects]
  );
  const individualProjects = useMemo(
    () => projects.filter((p) => collaborationOf(p) === "individual"),
    [projects]
  );

  const active = useMemo(
    () => projects.find((p) => p.id === activeId) ?? projects[0],
    [projects, activeId]
  );

  const hasTeam = teamProjects.length > 0;
  const hasIndividual = individualProjects.length > 0;
  const twoColumns = hasTeam && hasIndividual;

  useEffect(() => {
    if (projects.length === 0) return;
    if (!projects.some((p) => p.id === activeId)) {
      setActiveId(projects[0].id);
    }
  }, [projects, activeId]);

  if (projects.length === 0) {
    return null;
  }

  const PANEL_ID = "project-detail-panel";

  function renderListBlock(
    title: string,
    list: ProjectItem[],
    listId: string
  ) {
    if (list.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {title}
        </h3>
        <ul className="space-y-2" id={listId}>
          {list.map((p) => {
            const selected = p.id === active?.id;
            return (
              <li key={p.id}>
                <div
                  className="rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/15"
                  {...projectCardLift}
                >
                  <button
                    type="button"
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      selected
                        ? "bg-accent/15 text-accent"
                        : "text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100"
                    }`}
                    aria-pressed={selected}
                    aria-controls={PANEL_ID}
                    onClick={() => setActiveId(p.id)}
                  >
                    {p.title}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <section id="projects" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent">
          <FolderGit2 className="h-4 w-4" aria-hidden />
          Projects
        </h2>
        <p className="mb-8 text-2xl font-semibold text-zinc-100">프로젝트</p>

        <div className="space-y-10">
          {/* 팀 / 개인 — 모바일 세로, sm 이상에서 두 그룹이 모일 때만 좌우 2열 */}
          <div
            className={
              twoColumns
                ? "grid gap-8 sm:grid-cols-2 sm:gap-8 lg:gap-10"
                : "grid grid-cols-1 gap-8"
            }
            aria-label="프로젝트 목록"
          >
            {hasTeam && (
              <div className="min-w-0">
                {renderListBlock("팀 프로젝트", teamProjects, "project-list-team")}
              </div>
            )}
            {hasIndividual && (
              <div className="min-w-0">
                {renderListBlock(
                  "개인 프로젝트",
                  individualProjects,
                  "project-list-individual"
                )}
              </div>
            )}
          </div>

          {/* 상세(영상·ERD·탭) — 목록 아래 전체 폭 */}
          {active && (
            <div
              id={PANEL_ID}
              role="region"
              aria-label={`${active.title} 상세`}
              aria-live="polite"
              className="min-w-0 w-full"
            >
              {active.detailTabs && active.detailTabs.length > 0 ? (
                <ProjectTabsView project={active} />
              ) : (
                <ProjectCard project={active} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
