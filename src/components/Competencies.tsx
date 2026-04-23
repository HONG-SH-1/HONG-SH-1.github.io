import { CheckCircle2 } from "lucide-react";

/** 핵심 역량 */
const items = [
  "SpringBoot 기반 REST API 및 비동기 서버 로직 설계/구현",
  "JWT RTR 전략 및 Spring Security 기반 Zero-Trust 인증/인가 시스템 설계",
  "AES-256 암호화 · Bucket4j Rate Limiter · AOP 감사 로그 등 보안 시스템 설계 및 단위 테스트 36개 작성",
  "React + Axios 기반 컴포넌트 설계 및 API 데이터 흐름 관리",
  "Sliding Window 3D 텐서 변환 · SMOTETomek 불균형 보정 · Data Leakage 원천 차단 데이터 파이프라인 설계",
  "MLP → Bi-LSTM Cascade 앙상블 및 Autoencoder 비지도학습 기반 동적 임계값 이상 탐지 시스템 구현",
  "SHAP 기반 XAI 분석 엔진 개발 및 Streamlit 실시간 이상 탐지 관제 대시보드 구축",
];

export function Competencies() {
  return (
    <section id="skills" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
          Core Competencies
        </h2>
        <p className="mb-10 text-2xl font-semibold text-zinc-100">
          핵심 역량
        </p>

        <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {items.map((text) => (
            <li
              key={text}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition hover:border-accent/30 hover:shadow-accent"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                aria-hidden
              />
              <span className="text-[15px] leading-relaxed text-zinc-300">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
