import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SCROLL_SPY_ZONE_END,
  SCROLL_SPY_ZONE_START,
  SECTION_IDS,
  type SectionId,
} from "../constants/sections";

const PROGRAMMATIC_SCROLL_MS = 1100;

type SectionScrollContextValue = {
  activeSection: SectionId;
  scrollToSection: (id: SectionId) => void;
  lockScrollSpy: () => void;
};

const SectionScrollContext = createContext<SectionScrollContextValue | null>(
  null
);

function getSectionMetrics(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    id,
    top: rect.top,
    bottom: rect.bottom,
    center: rect.top + rect.height / 2,
    height: rect.height,
  };
}

/** 뷰포트 중앙 밴드와 겹치는 비율이 가장 큰 섹션을 활성으로 선택 */
function pickActiveSection(): SectionId {
  const vh = window.innerHeight;
  const zoneTop = vh * SCROLL_SPY_ZONE_START;
  const zoneBottom = vh * SCROLL_SPY_ZONE_END;
  const zoneHeight = zoneBottom - zoneTop;
  const viewportCenter = vh / 2;

  let bestId: SectionId = SECTION_IDS[0];
  let bestOverlap = -1;

  for (const id of SECTION_IDS) {
    const m = getSectionMetrics(id);
    if (!m) continue;

    const overlapTop = Math.max(m.top, zoneTop);
    const overlapBottom = Math.min(m.bottom, zoneBottom);
    const overlap = Math.max(0, overlapBottom - overlapTop);
    const ratio = zoneHeight > 0 ? overlap / zoneHeight : 0;

    if (ratio > bestOverlap) {
      bestOverlap = ratio;
      bestId = id;
    }
  }

  if (bestOverlap > 0) return bestId;

  let closestId: SectionId = SECTION_IDS[0];
  let minDistance = Infinity;

  for (const id of SECTION_IDS) {
    const m = getSectionMetrics(id);
    if (!m) continue;
    const distance = Math.abs(m.center - viewportCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestId = id;
    }
  }

  return closestId;
}

function scrollTargetForSection(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const centered =
    absoluteTop + el.offsetHeight / 2 - window.innerHeight / 2;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(centered, maxScroll));
}

export function SectionScrollProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>(SECTION_IDS[0]);
  const scrollLockRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);

  const updateFromScroll = useCallback(() => {
    if (scrollLockRef.current) return;
    setActiveSection(pickActiveSection());
  }, []);

  useEffect(() => {
    updateFromScroll();
    const onScroll = () => updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    };
  }, [updateFromScroll]);

  const lockScrollSpy = useCallback(() => {
    scrollLockRef.current = true;
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
      setActiveSection(pickActiveSection());
    }, PROGRAMMATIC_SCROLL_MS);
  }, []);

  const scrollToSection = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveSection(id);
    scrollLockRef.current = true;
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);

    window.scrollTo({ top: scrollTargetForSection(el), behavior: "smooth" });

    lockTimerRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
      setActiveSection(pickActiveSection());
    }, PROGRAMMATIC_SCROLL_MS);
  }, []);

  const value = useMemo(
    () => ({ activeSection, scrollToSection, lockScrollSpy }),
    [activeSection, scrollToSection, lockScrollSpy]
  );

  return (
    <SectionScrollContext.Provider value={value}>
      {children}
    </SectionScrollContext.Provider>
  );
}

export function useSectionScroll(): SectionScrollContextValue {
  const ctx = useContext(SectionScrollContext);
  if (!ctx) {
    throw new Error("useSectionScroll must be used within SectionScrollProvider");
  }
  return ctx;
}
