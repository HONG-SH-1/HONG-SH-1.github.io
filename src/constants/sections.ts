/** 섹션 앵커 · 스크롤 스파이 */
export const SECTIONS = [
  { id: "intro", label: "소개" },
  { id: "skills", label: "일하는 방식" },
  { id: "education", label: "교육" },
  { id: "stack", label: "스택" },
  { id: "projects", label: "프로젝트" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export const SCROLL_SPY_OFFSET = 72;
export const SCROLL_SPY_ZONE_START = 0.22;
export const SCROLL_SPY_ZONE_END = 0.78;
