import { useEffect, useId, useState, type ReactNode } from "react";

type SlideDirection = "next" | "prev" | "none";

type ProjectSlideFrameProps = {
  slideKey: string;
  direction: SlideDirection;
  children: ReactNode;
};

export function ProjectSlideFrame({
  slideKey,
  direction,
  children,
}: ProjectSlideFrameProps) {
  const gradientId = useId();
  const [traceActive, setTraceActive] = useState(false);

  useEffect(() => {
    setTraceActive(false);
    const frame = requestAnimationFrame(() => setTraceActive(true));
    return () => cancelAnimationFrame(frame);
  }, [slideKey]);

  return (
    <div className="project-slide-shell">
      <svg
        className="project-slide-trace"
        aria-hidden
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 168, 83, 0)" />
            <stop offset="45%" stopColor="rgba(212, 168, 83, 0.95)" />
            <stop offset="100%" stopColor="rgba(232, 192, 120, 0.4)" />
          </linearGradient>
        </defs>
        <rect
          x="0.6"
          y="0.6"
          width="98.8"
          height="98.8"
          rx="3.2"
          ry="3.2"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.55"
          pathLength="100"
          vectorEffect="non-scaling-stroke"
          className={traceActive ? "project-slide-trace-line is-running" : "project-slide-trace-line"}
        />
      </svg>

      <div
        key={slideKey}
        className="project-slide-body"
        data-direction={direction}
      >
        {children}
      </div>
    </div>
  );
}
