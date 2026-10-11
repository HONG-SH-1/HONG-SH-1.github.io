import { SECTIONS } from "../constants/sections";
import { useSectionScroll } from "../context/SectionScrollContext";

/** 우측 미니 섹션 인디케이터 */
export function SectionRail() {
  const { activeSection, scrollToSection } = useSectionScroll();

  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-6"
      aria-label="섹션 바로가기"
    >
      {SECTIONS.map(({ id, label }) => {
        const active = activeSection === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center justify-end gap-2"
            aria-current={active ? "location" : undefined}
            aria-label={`${label}으로 이동`}
          >
            <span
              className={`pointer-events-none rounded px-2 py-0.5 font-mono text-xs text-fg-muted opacity-0 transition group-hover:opacity-100 ${
                active ? "text-accent" : ""
              }`}
            >
              {label}
            </span>
            <span
              className={`block rounded-full transition-all ${
                active
                  ? "h-2 w-2 bg-accent shadow-glow"
                  : "h-1.5 w-1.5 bg-fg-faint group-hover:bg-fg-muted"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
