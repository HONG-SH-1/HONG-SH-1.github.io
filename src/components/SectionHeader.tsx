type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={`mb-10 max-w-content ${className}`.trim()}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-h2 text-fg">{title}</h2>
      {description && (
        <p className="mt-3 text-body-lg text-fg-muted">{description}</p>
      )}
    </header>
  );
}
