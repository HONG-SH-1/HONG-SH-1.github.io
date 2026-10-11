import { useEffect, useState } from "react";
import { Eye, EyeOff, Menu, X } from "lucide-react";
import { SECTIONS } from "../constants/sections";
import { useBackgroundView } from "../context/BackgroundViewContext";

const navItems = SECTIONS.filter((s) => s.id !== "intro");

export function Header() {
  const [open, setOpen] = useState(false);
  const { backgroundOnly, toggleBackgroundOnly } = useBackgroundView();

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface-overlay/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-wide items-center justify-between gap-4 px-margin-mobile md:px-margin-desktop">
        <a
          href="#intro"
          className="text-h3 font-bold tracking-tight text-fg transition hover:text-accent"
        >
          홍승현
        </a>

        {!backgroundOnly && (
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="주요 섹션"
          >
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-pill px-3.5 py-2 text-sm text-fg-muted transition hover:bg-surface-raised hover:text-fg"
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBackgroundOnly}
            className={`btn-ghost !px-3 !py-2 text-xs ${
              backgroundOnly ? "border-accent/40 text-accent" : ""
            }`}
            aria-pressed={backgroundOnly}
            aria-label={backgroundOnly ? "콘텐츠 보기" : "배경만 보기"}
          >
            {backgroundOnly ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
            <span className="ml-1.5 hidden sm:inline">
              {backgroundOnly ? "콘텐츠" : "배경"}
            </span>
          </button>

          {!backgroundOnly && (
            <button
              type="button"
              className="btn-ghost !p-2 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && !backgroundOnly && (
        <nav
          id="mobile-nav"
          className="border-t border-line px-margin-mobile py-3 md:hidden"
          aria-label="모바일 메뉴"
        >
          <ul className="space-y-0.5">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:bg-surface-raised hover:text-fg"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
