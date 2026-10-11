import { useState } from "react";
import {
  Award,
  BookOpen,
  Brain,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

type Pillar = {
  title: string;
  note?: string;
  items: string[];
};

const courseA = {
  org: "휴먼AI교육센터",
  title: "인공지능·빅데이터 활용 웹솔루션 개발자 양성과정 (Python, Java)",
  period: "2025.09.22 ~ 2026.03.25",
  award: "성적 우수상 (우수 수료)",
  pillars: [
    {
      title: "백엔드 및 서버 개발",
      items: [
        "Java 17, Spring Boot, Spring MVC 기반 서버 사이드 로직 구현",
        "MyBatis를 활용한 Oracle DB 연동 및 CRUD 구현",
        "BCrypt 해시 암호화 및 UUID 기반 식별자 처리",
        "Git, Maven, IntelliJ 기반 협업 개발 환경 구성",
      ],
    },
    {
      title: "자기주도 학습 및 프로젝트 적용",
      note: "(교육과정 외 자체 학습 후 프로젝트 적용)",
      items: [
        "Spring Security & JWT 기반 Stateless 인증·인가 체계",
        "AES-256 및 JPA Converter를 활용한 민감 데이터 암호화 자동화",
        "Spring AOP 기반 로그 마스킹 및 감사 로그 설계",
        "Apache Tika 기반 파일 업로드 보안 처리",
      ],
    },
    {
      title: "프론트엔드 UI/UX 설계",
      items: [
        "React, Vue.js 기반 컴포넌트 설계",
        "Axios를 활용한 API 데이터 흐름 관리",
        "HTML5, CSS3, JavaScript 기반 반응형 웹 구현",
      ],
    },
  ] satisfies Pillar[],
};

const courseB = {
  org: "휴먼AI교육센터",
  title: "심화_인공지능(AI) 서비스 기반 웹 개발자 심화 프로젝트",
  period: "2026.03.23 ~ 2026.05.21",
  pillars: [
    {
      title: "백엔드 및 서버 아키텍처 설계",
      items: [
        "Java(Spring Boot/MyBatis)와 Python(Django/FastAPI) 다중 서버 환경 구축",
        "MariaDB 및 Oracle DB 연동, MyBatis/JPA 데이터 영속화 처리",
        "RESTful API 표준화 및 서버 간 데이터 송수신 무결성 확보",
      ],
    },
    {
      title: "AI 모델링 및 서비스 통합",
      items: [
        "Pandas, Scikit-learn 기반 지도/비지도 학습 모델 개발",
        "데이터 전처리부터 모델 학습, 평가까지 전체 파이프라인 수행",
        "Django API 서비스로 AI 모델 등록 및 실무 환경 적용",
      ],
    },
    {
      title: "프론트엔드 및 인터랙티브 UI 설계",
      items: [
        "React 및 Vue.js 기반 컴포넌트 설계 및 상태 관리",
        "Axios를 활용한 Django/Spring API 실시간 데이터 통신",
        "Tailwind CSS 및 Bootstrap 기반 반응형 UX 구현",
      ],
    },
  ] satisfies Pillar[],
};

const courseC = {
  org: "휴먼AI교육센터",
  title: "AI 에이전트 간접 프롬프트 주입 방어 연구",
  period: "2026.03 ~ 2026.06 (2026.09 게재 확정)",
  items: [
    "IEEE ICT4DA 2026 게재 확정(2026.09). 「Intent-based Dual-Path Optimization Scheme to Prevent Indirect Prompt Injection」, 5인 공동저자",
    "LLM 에이전트의 간접 프롬프트 주입 방어 연구. 요청 위험도를 규칙+LLM 하이브리드로 평가해 경량 경로(Fast Path)와 구조적 격리 경로(Secure Path)로 나누는 의도 기반 라우팅을 제안. AgentDojo Slack 공격 평가에서 CaMeL 대비 공격 상황 안전 작업 완료율(SUR) 0.16→0.32(2배), 평균 토큰 사용량 30.3% 감소(논문 보고치).",
    "역할: 연구 주제 정의(CaMeL의 일률적 격리 비용 문제 제기 → 경량 의도 판별 제안), 이중 경로 구조 공동 제안(팀원 1인과), 학회 선정, 주간 진행 발표·팀 회의 조율, 일부 집필, 학회 발표 대본 작성",
  ],
};

const degree = {
  school: "용인대학교 유도학과",
  period: "2020.03 ~ 2026.02 졸업",
  gpa: "학점 4.18 / 4.5",
};

const certification =
  "정보처리기사 필기합격 (2026.03, 한국산업인력공단)";

const journeyPhases = [
  {
    img: "/images/theme/journey-web-bootcamp.png",
    alt: "React, Spring Boot, Oracle DB와 보안 레이어를 표현한 웹솔루션 아키텍처",
    period: "2025.09 ~ 2026.03",
    title: "웹솔루션 양성과정",
    desc: "Spring·Oracle·React와 교과 외 JWT·AES·AOP 보안 적용.",
  },
  {
    img: "/images/theme/journey-ai-pipeline.png",
    alt: "Java·Python 다중 서버와 AI 파이프라인 통합 구조",
    period: "2026.03 ~ 2026.05",
    title: "AI 웹 심화 프로젝트",
    desc: "Java·Python 다중 서버, AI 파이프라인·API 통합.",
  },
  {
    img: "/images/theme/journey-agent-security.png",
    alt: "AI 에이전트 간접 프롬프트 주입 방어 연구",
    period: "2026.03 ~ 2026.06",
    title: "AI 에이전트 보안 연구",
    desc: "의도 기반 이중 경로 방어 · IEEE ICT4DA 2026 게재 확정(공동저자).",
  },
] as const;

function PillarList({ pillars }: { pillars: Pillar[] }) {
  return (
    <ol className="space-y-8">
      {pillars.map((pillar, idx) => (
        <li key={pillar.title}>
          <h4 className="mb-3 flex flex-wrap items-baseline gap-2 text-base font-semibold text-fg">
            <span className="text-accent">{idx + 1}.</span>
            {pillar.title}
          </h4>
          {pillar.note && (
            <p className="mb-2 text-sm italic text-fg-muted">{pillar.note}</p>
          )}
          <ul className="space-y-2 border-l border-line pl-4">
            {pillar.items.map((line) => (
              <li key={line} className="text-sm leading-relaxed text-fg-muted">
                {line}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function EducationSection() {
  const [open, setOpen] = useState(false);

  return (
    <AnimatedSection id="education" className="border-t border-line py-section-y">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Education"
          title="교육 · 활동"
          description="부트캠프 과정, 심화 프로젝트, 연구 활동 타임라인입니다."
        />

        <div className="mb-10 grid gap-gutter md:grid-cols-3">
          {journeyPhases.map(({ img, alt, period, title, desc }) => (
            <article
              key={title}
              className="panel panel-interactive overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={img}
                  alt={alt}
                  className="h-full w-full object-cover opacity-80 transition duration-500 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <span className="absolute bottom-3 left-3 tag !border-line-strong !bg-surface-overlay/80">
                  {period}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-h3 text-fg">{title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{desc}</p>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          id="education-trigger"
          aria-expanded={open}
          aria-controls="education-panel"
          onClick={() => setOpen((v) => !v)}
          className="panel mb-6 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:border-accent/30"
        >
          <span className="text-h3 text-fg">교육 / 활동 상세</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>

        <div
          id="education-panel"
          role="region"
          aria-labelledby="education-trigger"
          hidden={!open}
          className={open ? "space-y-gutter" : undefined}
        >
          {open && (
            <>
              <div className="panel p-6 sm:p-8">
                <div className="mb-8 flex gap-3">
                  <GraduationCap className="h-6 w-6 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="eyebrow !text-fg-faint">메인 과정</p>
                    <p className="mt-1 text-sm text-fg-muted">{courseA.org}</p>
                    <h3 className="mt-2 text-lg font-semibold text-fg">{courseA.title}</h3>
                    <p className="mt-1 text-sm text-fg-faint">{courseA.period}</p>
                  </div>
                </div>
                <PillarList pillars={courseA.pillars} />
                <div className="mt-8 flex gap-3 rounded-panel border border-accent/25 bg-accent-dim p-4">
                  <Award className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <p className="text-sm font-medium text-fg">수상: {courseA.award}</p>
                </div>
              </div>

              <div className="panel p-6 sm:p-8">
                <div className="mb-8 flex gap-3">
                  <Brain className="h-6 w-6 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="eyebrow !text-fg-faint">심화 과정</p>
                    <p className="mt-1 text-sm text-fg-muted">{courseB.org}</p>
                    <h3 className="mt-2 text-lg font-semibold text-fg">{courseB.title}</h3>
                    <p className="mt-1 text-sm text-fg-faint">{courseB.period}</p>
                  </div>
                </div>
                <PillarList pillars={courseB.pillars} />
              </div>

              <div className="panel p-6 sm:p-8">
                <div className="mb-8 flex gap-3">
                  <BookOpen className="h-6 w-6 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="eyebrow !text-fg-faint">연구 활동</p>
                    <p className="mt-1 text-sm text-fg-muted">{courseC.org}</p>
                    <h3 className="mt-2 text-lg font-semibold text-fg">{courseC.title}</h3>
                    <p className="mt-1 text-sm text-fg-faint">{courseC.period}</p>
                  </div>
                </div>
                <ul className="space-y-2 border-l border-line pl-4">
                  {courseC.items.map((line) => (
                    <li key={line} className="text-sm leading-relaxed text-fg-muted">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-gutter sm:grid-cols-2">
                <div className="panel p-6">
                  <h3 className="mb-3 text-h3 text-fg">학력</h3>
                  <p className="font-medium text-fg">{degree.school}</p>
                  <p className="mt-2 text-sm text-fg-muted">{degree.period}</p>
                  <p className="text-sm text-fg-muted">{degree.gpa}</p>
                </div>
                <div className="panel p-6">
                  <h3 className="mb-3 text-h3 text-fg">자격</h3>
                  <p className="text-sm leading-relaxed text-fg-muted">{certification}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollReveal>
    </AnimatedSection>
  );
}
