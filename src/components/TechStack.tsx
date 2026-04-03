import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Database,
  GitBranch,
  Globe,
  Layers,
  Server,
  Sparkles,
} from "lucide-react";

type StackGroup = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

/** 기술 스택 그룹 — Lucide 아이콘으로 카테고리 표현 */
const groups: StackGroup[] = [
  {
    title: "Languages",
    icon: Braces,
    items: ["Java", "Python", "JavaScript"],
  },
  {
    title: "Frontend",
    icon: Globe,
    items: ["React", "Vue.js", "JSP", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      "Spring Boot",
      "Spring Security",
      "Spring MVC",
      "Spring Data JPA",
      "Spring Framework",
      "MyBatis",
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: ["Oracle DB", "MariaDB", "MySQL"],
  },
  {
    title: "AI / Data",
    icon: Sparkles,
    items: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "imbalanced-learn",
      "XGBoost",
      "SHAP",
      "Streamlit",
      "Matplotlib",
      "Jupyter",
      "LangChain",
      "FastAPI",
      "Django",
    ],
  },
  {
    title: "DevOps / Tools",
    icon: Layers,
    items: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Apache Maven",
      "Apache Tomcat",
    ],
  },
];

export function TechStack() {
  return (
    <section id="stack" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
          Tech Stack
        </h2>
        <p className="mb-10 text-2xl font-semibold text-zinc-100">기술 스택</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ title, icon: Icon, items }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 shadow-glass backdrop-blur-md"
            >
              <div className="mb-4 flex items-center gap-2 text-accent">
                <Icon className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
                  {title}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {items.map((name) => (
                  <li key={name}>
                    <span className="inline-block rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-zinc-300">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
          <GitBranch className="h-3.5 w-3.5" aria-hidden />
          AI·ML 심화 주제는{" "}
          <a href="#education" className="text-accent hover:underline">
            교육 · 활동
          </a>
          커리큘럼 카드(기초 + 심화 통합)에서 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
