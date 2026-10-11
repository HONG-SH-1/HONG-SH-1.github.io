import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectItem } from "../types/project";

type ProjectSlideNavProps = {
  projects: ProjectItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function ProjectSlideNav({
  projects,
  activeId,
  onSelect,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: ProjectSlideNavProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const btn = itemRefs.current.get(activeId);
    if (!list || !btn) return;

    setIndicator({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
    });

    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const viewLeft = list.scrollLeft;
    const viewRight = viewLeft + list.clientWidth;

    if (btnLeft < viewLeft) {
      list.scrollLeft = btnLeft;
    } else if (btnRight > viewRight) {
      list.scrollLeft = btnRight - list.clientWidth;
    }
  }, [activeId]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator, projects]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onScroll = () => updateIndicator();
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateIndicator);

    return () => {
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const activeIndex = projects.findIndex((p) => p.id === activeId);

  return (
    <div className="project-slide-nav">
      <button
        type="button"
        className="project-slide-arrow"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="이전 프로젝트"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      <div className="project-slide-nav-track">
        <ul
          ref={listRef}
          className="project-slide-nav-list"
          role="tablist"
          aria-label="프로젝트 선택"
        >
          {projects.map((project) => {
            const selected = project.id === activeId;
            return (
              <li key={project.id} className="shrink-0">
                <button
                  ref={(node) => {
                    if (node) itemRefs.current.set(project.id, node);
                    else itemRefs.current.delete(project.id);
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className="project-slide-nav-btn"
                  onClick={() => onSelect(project.id)}
                >
                  {project.title}
                </button>
              </li>
            );
          })}
        </ul>

        <span
          className="project-slide-nav-indicator"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
          aria-hidden
        />
      </div>

      <button
        type="button"
        className="project-slide-arrow"
        onClick={onNext}
        disabled={!canNext}
        aria-label="다음 프로젝트"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>

      {projects.length > 1 && (
        <span className="project-slide-counter" aria-live="polite">
          {activeIndex + 1}
          <span className="text-fg-faint"> / {projects.length}</span>
        </span>
      )}
    </div>
  );
}
