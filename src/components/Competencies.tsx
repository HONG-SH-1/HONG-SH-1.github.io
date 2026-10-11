import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

type WorkStep = {
  title: string;
  detail: string;
};

const MALA_REPO = "https://github.com/HONG-SH-1/mala";

const steps: WorkStep[] = [
  {
    title: "문서부터 씁니다.",
    detail:
      "만들기 전에 요구사항 문서(PRD)를 먼저 쓰고, 질문을 주고받으며 범위와 완료 기준을 좁힙니다.",
  },
  {
    title: "모델을 나눠 씁니다.",
    detail:
      "정해진 구현은 가벼운 모델에게 맡기고, 설계 판단이 필요한 부분만 상위 모델과 함께 결정합니다.",
  },
  {
    title: "직접 확인합니다.",
    detail:
      "나온 코드를 AI와 함께 다시 읽고, 테스트가 통과해도 실제로 돌려서 숫자로 확인합니다.",
  },
  {
    title: "한 번에 끝낼 크기로 나눕니다.",
    detail:
      "작업 하나를 한 세션 안에 끝낼 수 있는 단위로 쪼개서, 중간에 멈춘 채 남는 일이 없게 합니다.",
  },
  {
    title: "만든 뒤에 거꾸로 공부합니다.",
    detail:
      "이해하지 못한 부분은 넘어가지 않습니다. MALA는 완성하고 4개월 뒤 처음부터 다시 읽으며, 테스트를 통과하던 결함을 포함해 16건을 찾았습니다.",
  },
];

export function Competencies() {
  return (
    <AnimatedSection id="skills" className="border-t border-line py-section-y">
      <ScrollReveal>
        <SectionHeader eyebrow="How I Work" title="일하는 방식" />

        <ol className="grid gap-gutter lg:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="panel panel-interactive flex flex-col p-6 md:p-7"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-h3 text-fg">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-fg-muted">
          <a
            href={MALA_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            설계 기록과 재학습 노트
          </a>
        </p>
      </ScrollReveal>
    </AnimatedSection>
  );
}
