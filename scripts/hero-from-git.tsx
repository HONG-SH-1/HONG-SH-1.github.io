import { Sparkles } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

const ROLE_CHIPS = [
  {
    label: "AI Full-Stack Developer",
    className:
      "border-tertiary/40 bg-tertiary/10 text-tertiary shadow-neon-cyan",
  },
  {
    label: "AI/ML Engineer",
    className:
      "border-secondary/35 bg-secondary-container/25 text-secondary-fixed shadow-[0_0_20px_-8px_rgba(184,196,255,0.22)]",
  },
  {
    label: "Data Engineer",
    className:
      "border-emerald-400/35 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_-8px_rgba(52,211,153,0.22)]",
  },
] as const;

const HERO_IMG = "/images/theme/hero-sphere.jpg";

/** 히어로 — 한국어 본문 유지, 테마 2열 레이아웃 */
export function Hero() {
  return (
    <section
      id="intro"
      className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center px-margin-mobile pb-16 pt-28 md:px-margin-desktop md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-max-width grid-cols-1 items-center gap-gutter lg:grid-cols-12">
        <div className="relative z-20 lg:col-span-7">
          <div className="mb-6 inline-block border border-tertiary/40 px-3 py-1">
            <span className="font-code-md text-sm uppercase tracking-widest text-tertiary sm:text-[15px]">
              Portfolio · 백엔드 · 보안 · AI
            </span>
          </div>

          <div
            className="mb-5 flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5"
            aria-label={ROLE_CHIPS.map((c) => c.label).join(", ")}
          >
            <Sparkles
              className="h-3.5 w-3.5 shrink-0 text-tertiary opacity-90"
              aria-hidden
            />
            {ROLE_CHIPS.map(({ label, className }) => (
              <span
                key={label}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-medium backdrop-blur-sm sm:px-3 sm:text-[15px] ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            className="mb-6 flex items-center gap-2 font-code-md text-sm sm:text-[15px]"
            style={{ fontFamily: "var(--mono)" }}
          >
            <span className="text-outline">root@hsh-server:~$</span>
            <TypeAnimation
              sequence={[
                "systemctl start spring-security... [OK]",
                1500,
                "AES-256 encryption enabled... [OK]",
                1500,
                "JWT RTR strategy activated... [OK]",
                1500,
                "rate-limiter deployed... [OK]",
                1500,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ color: "#2fd9f4" }}
            />
          </div>

          <h1 className="font-display-lg mb-8 text-balance break-keep text-xl font-bold leading-snug tracking-normal text-on-surface sm:text-2xl sm:leading-snug md:text-3xl md:leading-snug lg:text-[2rem] lg:leading-[1.45] xl:text-[2.25rem]">
            JWT RTR, AES-256, MLP·Bi-LSTM Cascade 앙상블로 금융 FDS · 보안
            시스템을 설계하는 풀스택 엔지니어{" "}
            <span className="bg-gradient-to-r from-tertiary to-secondary bg-clip-text font-extrabold text-transparent drop-shadow-[0_0_20px_rgba(47,217,244,0.28)]">
              홍승현
            </span>
            입니다.
          </h1>

          <div className="glass-card rounded-brand p-6 sm:p-8">
            <div className="space-y-5 text-base leading-[1.85] text-on-surface-variant sm:text-lg sm:leading-[1.8]">
              <p className="break-keep text-pretty">
                데이터 무결성과 방어적 아키텍처를 중심으로 개발합니다.
                <br />
                단순히 동작하는 코드가 아닌, 진입점부터 외부 공격을 차단하는 보안
                인프라 설계를 지향합니다.
              </p>
              <p className="break-keep text-pretty">
                JWT RTR 전략, AES-256 암호화, Bucket4j Rate Limiter로 Zero-Trust
                백엔드를 구축하고,
                <br />
                MLP → Bi-LSTM Cascade 앙상블과 SHAP 기반 설명 가능한 AI(XAI)를 직접
                설계·구현한 경험이 있습니다.
              </p>
              <p className="break-keep text-pretty">
                보안과 안정성이 요구되는 환경에서, 백엔드부터 AI까지 풀사이클로 신뢰할
                수 있는 시스템을 만드는 것을 목표로 준비 중입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-12 flex items-center justify-center lg:col-span-5 lg:mt-0">
          <div className="relative aspect-square w-full max-w-[500px]">
            <div
              className="absolute inset-0 animate-pulse rounded-full bg-tertiary/20 blur-[100px]"
              aria-hidden
            />
            <div className="glass-card absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-white/20">
              <div className="absolute h-3/4 w-3/4 animate-spin-slow rounded-full border border-tertiary/30" />
              <div className="absolute h-1/2 w-1/2 animate-spin-slower rounded-full border border-secondary/40" />
              <div className="absolute h-1/4 w-1/4 animate-pulse rounded-full bg-tertiary/10 blur-xl" />
              <img
                src={HERO_IMG}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-max-width flex-col items-center gap-4 px-margin-mobile md:px-margin-desktop">
        <span className="font-code-md text-sm uppercase tracking-[0.3em] text-on-surface-variant sm:text-code-md">
          아래로 스크롤
        </span>
        <div className="judo-line relative h-16 overflow-hidden">
          <div className="absolute left-0 top-0 h-4 w-full animate-bounce bg-tertiary" />
        </div>
      </div>
    </section>
  );
}
