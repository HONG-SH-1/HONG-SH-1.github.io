import { Fragment } from "react";
import { ArrowDown, Github } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";

const GITHUB_PROFILE = "https://github.com/HONG-SH-1";

const ROLES = [
  "LLM · RAG",
  "ML · DL",
  "AI 기획",
  "AI Security",
  "APM 실무",
] as const;

const LEAD = [
  "현업에서는 APM 엔지니어로 리눅스 서버 위의 고객사 서비스를 맡아, 로그와 지표를 보며 장애 원인을 찾습니다.",
  "업무 밖에서는 AI와 LLM으로 동작하는 서비스를 직접 기획하고 만들고, 만든 것도 같은 방식으로 숫자로 확인합니다.",
];

const PAPER = {
  title: "IEEE ICT4DA 2026 게재 확정 (5인 공동저자)",
  sentences: [
    "AI 에이전트가 외부 문서에 숨겨진 악성 지시에 속지 않도록 막는 방법을 연구했습니다.",
    "위험한 요청만 골라 엄격하게 검사하는 구조로, 기존 방식보다 공격 상황에서 작업을 안전하게 끝낸 비율은 2배로 늘고 처리 비용(토큰)은 30% 줄었습니다.",
  ],
};

type Highlight = {
  title: string;
  sentences?: string[];
  subItems?: { name: string; sentences: string[] }[];
};

const HIGHLIGHTS: Highlight[] = [
  {
    title: "사내 문서 위치를 찾아 주는 검색 도구 (현업)",
    sentences: [
      "GPU가 없는 서버라 추론 속도부터 재 보고(초당 3~4 토큰), LLM을 실시간 검색 경로에서 뺐습니다.",
      "대신 로컬 LLM이 문서마다 검색어를 미리 만들어 두고, 실시간으로는 질문 해석에만 씁니다.",
      "공유 드라이브 문서 180건을 색인해 검색은 1초 안에 끝나고, 문서는 회사 밖으로 나가지 않습니다.",
    ],
  },
  {
    title: "사내 AI 개발 환경 구축 (현업)",
    sentences: [
      "사내 쿠버네티스 클러스터를 여러 명이 함께 쓰는 작업용 VM에서 다룰 수 있도록 환경을 구성했습니다.",
      "사용자마다 리눅스 계정과 클러스터 접속 설정(kubeconfig)을 따로 두어, 한 사람이 컨텍스트를 바꿔도 다른 사람의 작업에 영향이 없게 했습니다.",
      "공용 작업 디렉토리는 그룹 권한으로 공유하고, Claude Code와 JDK 버전별 환경을 함께 설치했습니다.",
    ],
  },
  {
    title: "내 컴퓨터 안에서만 돌아가는 AI 비서 (MALA)",
    sentences: [
      "개인 공부 노트를 찾아 질문에 답하는 AI입니다.",
      "질문 분류, 노트 검색, 답변 작성 단계로 나뉜 파이프라인입니다.",
      "외부 AI 서비스 없이 그래픽카드 한 장으로 동작해서, 노트가 밖으로 나가지 않습니다.",
    ],
  },
  {
    title: "웹 서비스 두 곳의 보안 담당 (Law-Partner, MedNeduro)",
    sentences: [
      "누가 언제 접속했는지 기록하고, 관리자가 한 일은 지워지지 않게 남기고, 로그인 정보를 훔쳐 가는 공격을 막는 구조를 설계했습니다.",
    ],
  },
  {
    title: "드문 이상을 찾아내는 AI (개인 프로젝트 2개)",
    subItems: [
      {
        name: "신용카드 이상거래(FDS) 분류",
        sentences: [
          "사기 거래는 1,000건 중 2건이 채 안 됩니다.",
          "정상 거래를 의심하는 것보다 사기를 놓치는 걸 더 큰 실수로 보고 모델을 평가했습니다.",
        ],
      },
      {
        name: "산업용 펌프 센서 이상 탐지 시스템",
        sentences: [
          "정상 상태만 학습시켜 평소와 다른 움직임을 찾게 했고, 테스트 구간에서 이상 신호가 있던 30분 단위 구간 11개 중 10개를 찾아냈습니다.",
          "대신 오경보가 많아, 연속 알람 조건 같은 후처리가 다음 과제입니다.",
        ],
      },
    ],
  },
];

/** 하이픈에서 줄이 갈리지 않게 묶을 단어 */
const NO_WRAP_WORD = "Law-Partner";

function keepTogether(text: string) {
  const parts = text.split(NO_WRAP_WORD);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <span className="whitespace-nowrap">{NO_WRAP_WORD}</span>
      )}
    </Fragment>
  ));
}

function Sentences({ sentences }: { sentences: string[] }) {
  return (
    <>
      {sentences.map((sentence) => (
        <span key={sentence} className="block">
          {sentence}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <AnimatedSection
      id="intro"
      className="flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-section-y"
    >
      <ScrollReveal className="max-w-content lg:max-w-4xl">
        <p className="eyebrow mb-4">Portfolio · 2026</p>

        <h1 className="text-display text-fg">
          <span className="text-accent">
            AI 엔지니어,
            <br />
            기획부터 검증까지
          </span>
          <br />
          홍승현
        </h1>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="역할">
          {ROLES.map((role, i) => (
            <li key={role}>
              <span
                className={`tag ${i === 0 ? "border-accent/40 text-accent" : ""}`}
              >
                {role}
              </span>
            </li>
          ))}
        </ul>

        <div className="panel mt-6 max-w-content p-6 md:p-8 lg:max-w-4xl">
          <p className="border-b border-line pb-5 text-lg font-medium leading-relaxed text-fg md:text-xl">
            <Sentences sentences={LEAD} />
          </p>

          <div className="mt-5 space-y-4 text-body-lg leading-relaxed text-fg-muted">
            <div>
              <p className="font-semibold text-fg">{PAPER.title}</p>
              <p>
                <Sentences sentences={PAPER.sentences} />
              </p>
            </div>

            <ul className="space-y-4">
              {HIGHLIGHTS.map(({ title, sentences, subItems }) => (
                <li key={title}>
                  <p className="font-semibold text-fg">{keepTogether(title)}</p>
                  {sentences && (
                    <p>
                      <Sentences sentences={sentences} />
                    </p>
                  )}
                  {subItems && (
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {subItems.map((item) => (
                        <li key={item.name}>
                          <span className="block font-medium text-fg/80">
                            {item.name}
                          </span>
                          <Sentences sentences={item.sentences} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn-primary">
            프로젝트 보기
          </a>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Github className="mr-2 h-4 w-4" aria-hidden />
            GitHub
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={200} className="mt-16 flex justify-center">
        <a
          href="#skills"
          className="flex flex-col items-center gap-2 text-fg-faint transition hover:text-accent"
          aria-label="일하는 방식 섹션으로 스크롤"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
        </a>
      </ScrollReveal>
    </AnimatedSection>
  );
}
