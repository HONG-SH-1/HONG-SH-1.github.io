import { useEffect } from "react";

/** head 인라인 스크립트가 새로고침 시 scrollTo(0) 처리 — scroll-instant 클래스만 해제 */
export function useInitialScroll() {
  useEffect(() => {
    document.documentElement.classList.remove("scroll-instant");
  }, []);
}
