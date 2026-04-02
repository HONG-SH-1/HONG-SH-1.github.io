import { useState } from "react";
import { Award, Brain, BookOpen, ChevronDown, GraduationCap } from "lucide-react";

type Pillar = {
  title: string;
  note?: string;
  items: string[];
};

/** 과정 A — 메인 과정 */
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

/** 과정 B — 심화 과정 */
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

/** 과정 C — 연구 활동 */
const courseC = {
  org: "휴먼AI교육센터",
  title: "AI 에이전트 보안 거버넌스 아키텍처 연구",
  period: "2026.03.07 ~ 진행 중",
  items: [
    "기업용 협업 툴(Notion, Jira 등) 연동 AI 에이전트의 권한 남용 및 민감 데이터 유출 통제 연구",
    "Spring AOP/Proxy 기반 보안 게이트웨이 설계 및 Latency 최적화 연구",
    "국제 학회(International Conference) 논문 투고 목표",
  ],
};

const degree = {
  school: "용인대학교 유도학과",
  period: "2020.03 ~ 2026.03 졸업",
  gpa: "학점 4.18 / 4.5",
};

const certification =
  "정보처리기사 필기합격 (2026.03, 한국산업인력공단)";

function PillarList({ pillars }: { pillars: Pillar[] }) {
  return (
    <ol className="space-y-10">
      {pillars.map((pillar, idx) => (
        <li key={pillar.title}>
          <h4 className="mb-4 flex flex-wrap items-baseline gap-2 text-base font-semibold text-zinc-200">
            <span className="text-accent">{idx + 1}.</span>
            {pillar.title}
          </h4>
          {pillar.note && (
            <p className="mb-3 text-sm italic text-zinc-500">{pillar.note}</p>
          )}
          <ul className="space-y-3 border-l border-white/10 pl-4 sm:pl-5">
            {pillar.items.map((line) => (
              <li
                key={line}
                className="break-keep text-sm leading-[1.75] text-zinc-400"
              >
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
    <section id="education" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
          Education
        </h2>

        <button
          type="button"
          id="education-trigger"
          aria-expanded={open}
          aria-controls="education-panel"
          onClick={() => setOpen((v) => !v)}
          className="mb-6 flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left shadow-glass backdrop-blur-md transition hover:border-accent/30 hover:bg-white/[0.06] sm:px-5 sm:py-4"
        >
          <span className="text-xl font-semibold text-zinc-100 sm:text-2xl">
            교육 / 활동
          </span>
          <ChevronDown
            className={`h-6 w-6 shrink-0 text-accent transition-transform duration-300 ${
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
          className={open ? "space-y-14" : undefined}
        >
          {open && (
            <>
              {/* 과정 A — 메인 과정 */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 shadow-glass backdrop-blur-md sm:p-8">
                <div className="mb-8 flex flex-wrap items-start gap-3">
                  <GraduationCap
                    className="h-7 w-7 shrink-0 text-accent"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-accent">
                      메인 과정
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{courseA.org}</p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-zinc-100 sm:text-xl">
                      {courseA.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{courseA.period}</p>
                  </div>
                </div>

                <PillarList pillars={courseA.pillars} />

                <div className="mt-10 flex gap-3 rounded-xl border border-accent/25 bg-accent/[0.08] p-4 sm:p-5">
                  <Award
                    className="h-6 w-6 shrink-0 text-accent"
                    aria-hidden
                  />
                  <p className="text-sm font-medium leading-relaxed text-zinc-200">
                    수상: {courseA.award}
                  </p>
                </div>
              </div>

              {/* 과정 B — 심화 과정 */}
              <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-transparent p-6 shadow-glass backdrop-blur-md sm:p-8">
                <div className="mb-8 flex flex-wrap items-start gap-3">
                  <Brain
                    className="h-7 w-7 shrink-0 text-accent"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-accent">
                      심화 과정
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{courseB.org}</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">
                      {courseB.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{courseB.period}</p>
                  </div>
                </div>

                <PillarList pillars={courseB.pillars} />
              </div>

              {/* 과정 C — 연구 활동 */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 shadow-glass backdrop-blur-md sm:p-8">
                <div className="mb-8 flex flex-wrap items-start gap-3">
                  <BookOpen
                    className="h-7 w-7 shrink-0 text-accent"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-accent">
                      연구 활동
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{courseC.org}</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">
                      {courseC.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{courseC.period}</p>
                  </div>
                </div>

                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  내용
                </p>
                <ul className="space-y-3 border-l border-white/10 pl-4 sm:pl-5">
                  {courseC.items.map((line) => (
                    <li
                      key={line}
                      className="break-keep text-sm leading-[1.75] text-zinc-400"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 학력 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-glass backdrop-blur-md sm:p-8">
                <h3 className="mb-4 text-base font-semibold text-zinc-200">
                  학력
                </h3>
                <p className="text-sm font-medium text-zinc-100">{degree.school}</p>
                <p className="mt-2 text-sm text-zinc-400">{degree.period}</p>
                <p className="mt-1 text-sm text-zinc-400">{degree.gpa}</p>
              </div>

              {/* 자격 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-glass backdrop-blur-md sm:p-8">
                <h3 className="mb-4 text-base font-semibold text-zinc-200">
                  자격
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {certification}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
