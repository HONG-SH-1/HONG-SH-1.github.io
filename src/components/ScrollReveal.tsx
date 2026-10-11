import type { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** subtle: 이동·시간 절반 */
  intensity?: "default" | "subtle";
};

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  intensity = "default",
}: ScrollRevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`scroll-reveal${intensity === "subtle" ? " scroll-reveal-subtle" : ""} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
