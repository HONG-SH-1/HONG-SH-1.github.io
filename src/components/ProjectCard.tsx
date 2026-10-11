import { ExternalLink, Github } from "lucide-react";
import type { ProjectItem } from "../types/project";

type ProjectCardProps = {
  project: ProjectItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, githubUrl, tags } = project;

  return (
    <article className="panel-readable h-full p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-h3 text-fg">{title}</h3>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !py-2 !text-xs"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            <span className="ml-1.5">GitHub</span>
            <ExternalLink className="ml-1 h-3 w-3 opacity-60" aria-hidden />
          </a>
        )}
      </div>

      <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-fg/90 md:text-body">
        {description}
      </p>

      <ul className="flex flex-wrap gap-2" aria-label="프로젝트 태그">
        {tags.map((tag) => (
          <li key={tag}>
            <span className="tag">{tag}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
