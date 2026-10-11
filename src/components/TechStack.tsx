import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Database,
  Globe,
  Layers,
  Server,
  Sparkles,
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

type StackGroup = {
  title: string;
  role: string;
  icon: LucideIcon;
  items: string[];
};

const frequent = ["Java", "Spring Boot", "Spring Security", "SQL", "Python"];

const devTools = ["Git", "GitHub Actions"];

const aiTools = ["Claude Code", "Cursor"];

const groups: StackGroup[] = [
  {
    title: "Law-Partner",
    role: "팀 프로젝트 · 보안, 관리자, DB 설계",
    icon: Server,
    items: [
      "Spring Boot",
      "Spring Security",
      "JWT",
      "AES-256",
      "Spring AOP",
      "Oracle",
    ],
  },
  {
    title: "MedNeduro",
    role: "팀 프로젝트 · 보안 리드, DB 설계",
    icon: Database,
    items: ["Spring Boot", "Interceptor", "MyBatis", "Oracle", "JSP"],
  },
  {
    title: "MediCore",
    role: "팀 프로젝트 · 안과 모듈",
    icon: Sparkles,
    items: [
      "PyTorch",
      "ONNX",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Vertex AI",
    ],
  },
  {
    title: "MALA",
    role: "개인 프로젝트",
    icon: Braces,
    items: ["Python", "Ollama", "LangGraph", "Redis", "ChromaDB"],
  },
  {
    title: "이상 탐지 프로젝트 3개",
    role: "개인 프로젝트 · FDS, DeepGuard, 펌프 센서",
    icon: Layers,
    items: [
      "XGBoost",
      "SHAP",
      "imbalanced-learn",
      "TensorFlow",
      "PyTorch",
      "Optuna",
      "Streamlit",
      "Gradio",
    ],
  },
  {
    title: "현업",
    role: "APM 엔지니어",
    icon: Globe,
    items: [
      "Linux",
      "WhaTap APM 고객사 구축",
      "WhaTap·JENNIFER 모니터링·정기점검",
      "Kubernetes 공용 작업 환경 구성",
    ],
  },
];

export function TechStack() {
  return (
    <AnimatedSection id="stack" className="border-t border-line py-section-y">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Tech Stack"
          title="기술 스택"
          description="자주 쓰는 것과, 프로젝트에서 직접 맡은 부분에 쓴 기술을 나눴습니다."
        />

        <div className="grid gap-gutter">
          <article className="panel p-5">
            <h3 className="mb-4 text-sm font-semibold text-fg">자주 쓰는 것</h3>
            <ul className="flex flex-wrap gap-2">
              {frequent.map((name) => (
                <li key={name}>
                  <span className="tag">{name}</span>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-5 text-sm font-semibold text-fg">
              협업·배포
            </h3>
            <ul className="flex flex-wrap gap-2">
              {devTools.map((name) => (
                <li key={name}>
                  <span className="tag">{name}</span>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-5 text-sm font-semibold text-fg">
              AI 코딩 도구
            </h3>
            <ul className="flex flex-wrap gap-2">
              {aiTools.map((name) => (
                <li key={name}>
                  <span className="tag">{name}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ title, role, icon: Icon, items }) => (
              <article key={title} className="panel p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-accent">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <h3 className="text-sm font-semibold text-fg">{title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-fg-muted">{role}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((name) => (
                    <li key={name}>
                      <span className="tag">{name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </AnimatedSection>
  );
}
