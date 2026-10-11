type FooterProps = {
  githubUrl: string;
};

export function Footer({ githubUrl }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-line py-10">
      <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 px-margin-mobile text-center md:flex-row md:px-margin-desktop md:text-left">
        <p className="text-sm text-fg-muted">
          © {new Date().getFullYear()} 홍승현 · GitHub Pages
        </p>
        <nav className="flex gap-6 text-sm" aria-label="푸터 링크">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted transition hover:text-accent"
          >
            GitHub
          </a>
          <a href="#intro" className="text-fg-muted transition hover:text-accent">
            맨 위로
          </a>
        </nav>
      </div>
    </footer>
  );
}
