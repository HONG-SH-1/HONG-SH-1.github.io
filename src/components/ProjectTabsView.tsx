import { useEffect, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Play,
} from "lucide-react";
import type { ProjectItem } from "../types/project";

type ProjectTabsViewProps = {
  project: ProjectItem;
};

function publicAssetUrl(relativePath: string): string {
  return `${import.meta.env.BASE_URL}${relativePath.replace(/^\//, "")}`;
}

/**
 * LawPartner 등 — 상단 시연 영상 영역 + 하위 탭(배경·개요·목표 등)
 * 영상은 나중에 <video> 또는 iframe 으로 교체하면 됩니다.
 */
export function ProjectTabsView({ project }: ProjectTabsViewProps) {
  const tabs = project.detailTabs ?? [];
  const [tabId, setTabId] = useState(tabs[0]?.id ?? "");
  const [openDemo, setOpenDemo] = useState<number | null>(null);

  /* 상단 프로젝트 탭 전환 시 하위 탭을 첫 항목으로 리셋 */
  useEffect(() => {
    setTabId(project.detailTabs?.[0]?.id ?? "");
  }, [project.id]);

  const activeTab = tabs.find((t) => t.id === tabId) ?? tabs[0];

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-glass backdrop-blur-md sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-zinc-50">{project.title}</h3>
        <div className="flex items-center gap-3">
          {project.pdfUrl && (
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              <FileText className="h-4 w-4" aria-hidden />
              PDF
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <Globe className="h-4 w-4" aria-hidden />
              라이브
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/20"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </a>
        </div>
      </div>

      {/* 메인: 시연 영상 — demoVideoSrc 있으면 재생, 없으면 플레이스홀더 */}
      {(project.demoVideoSrc || project.showDemoPlaceholder !== false) && (
        <div className="mb-6">
          {project.demoVideoSrc ? (
            <div
              className={`overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg ${
                project.demoVideoSrc.startsWith("http") ? "aspect-video" : ""
              }`}
              aria-label="시연 영상"
            >
              {project.demoVideoSrc.startsWith("http") ? (
                <iframe
                  src={project.demoVideoSrc}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="데모 영상"
                  className="h-full w-full"
                />
              ) : (
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  src={`${import.meta.env.BASE_URL}${project.demoVideoSrc.replace(/^\//, "")}`}
                >
                  시연 영상을 재생할 수 없습니다. 브라우저가 MP4 재생을 지원하는지 확인하세요.
                </video>
              )}
            </div>
          ) : (
            <div
              className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-accent/30 bg-black/40 px-6 text-center"
              aria-label="시연 영상 영역"
            >
              <Play className="h-14 w-14 text-accent/50" strokeWidth={1.25} aria-hidden />
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-300">시연 영상</p>
                <p className="text-xs text-zinc-500">
                  준비되면 여기에 &lt;video&gt; 또는 YouTube·Vimeo 임베드를 넣으면 됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 하위 탭 — 모바일에서는 가로 스크롤 */}
      <div
        className="mb-4 flex gap-1 overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="tablist"
        aria-label="프로젝트 상세 탭"
      >
        {tabs.map((t) => {
          const selected = t.id === activeTab?.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`subtab-${project.id}-${t.id}`}
              aria-controls={`subpanel-${project.id}-${t.id}`}
              onClick={() => setTabId(t.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-xs font-medium transition sm:text-sm ${
                selected
                  ? "bg-accent/20 text-accent"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          role="tabpanel"
          id={`subpanel-${project.id}-${activeTab.id}`}
          aria-labelledby={`subtab-${project.id}-${activeTab.id}`}
          className="min-h-[8rem] rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5"
        >
          {activeTab.iframeSrc ? (
            <div style={{ position: "relative", width: "100%" }} className="mb-6">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "8px",
                }}
              >
                <a
                  href={`${import.meta.env.BASE_URL}${activeTab.iframeSrc.replace(/^\//, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "monospace",
                    fontSize: ".75rem",
                    color: "#94a3b8",
                    textDecoration: "none",
                    background: "#1c2230",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    transition: "color .2s, border-color .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4ade80";
                    e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  ↗ 전체화면으로 보기
                </a>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "600px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <iframe
                  src={`${import.meta.env.BASE_URL}${activeTab.iframeSrc.replace(/^\//, "")}`}
                  width="100%"
                  height="100%"
                  scrolling="no"
                  style={{ border: "none", background: "#fff" }}
                  title="ERD"
                />
              </div>
            </div>
          ) : (
            activeTab.images &&
            activeTab.images.length > 0 && (
              <div className="mb-6 space-y-4">
                {activeTab.images.map((src) => (
                  <figure key={src} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50">
                    <img
                      src={publicAssetUrl(src)}
                      alt={`${project.title} · ${activeTab.label} 참고 이미지`}
                      className="w-full object-contain"
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            )
          )}
          <div className="whitespace-pre-wrap break-keep text-sm leading-relaxed text-zinc-300">
            {activeTab.content}
          </div>
          {/* 개요 탭에서 태그도 함께 보이도록: id가 overview 일 때 */}
          {activeTab.id === "overview" && project.tags.length > 0 && (
            <ul
              className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4"
              aria-label="기술 태그"
            >
              {project.tags.map((tag) => (
                <li key={tag}>
                  <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-400">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {activeTab.demoVideos && activeTab.demoVideos.length > 0 && (
            <div className="space-y-3">
              {activeTab.demoVideos.map((video, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <button
                    onClick={() => setOpenDemo(openDemo === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.04] transition"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-zinc-100">🎬 {video.title}</span>
                      <span className="text-xs text-zinc-500">{video.desc}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${openDemo === idx ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDemo === idx && (
                    <div className="px-5 pb-5">
                      {video.url ? (
                        <video
                          className="w-full rounded-lg aspect-video bg-black"
                          controls
                          playsInline
                          preload="metadata"
                          src={
                            video.url.startsWith("http")
                              ? video.url
                              : `${import.meta.env.BASE_URL}${video.url.replace(/^\//, "")}`
                          }
                        >
                          영상을 재생할 수 없습니다. 브라우저가 MP4 재생을 지원하는지 확인하세요.
                        </video>
                      ) : (
                        <div className="w-full aspect-video rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center">
                          <span className="text-zinc-500 text-sm">영상 처리 중 오류가 발생했습니다.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
