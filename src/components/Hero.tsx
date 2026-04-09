import { Sparkles } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

/** 역할 칩 — 각각 테마 색으로 구분 (풀스택 / AI·ML / 데이터) */
const ROLE_CHIPS = [
  {
    label: "Full-Stack Developer",
    className:
      "border-accent/40 bg-accent/10 text-accent shadow-[0_0_20px_-8px_rgba(34,211,238,0.35)]",
  },
  {
    label: "AI/ML Engineer",
    className:
      "border-violet-400/35 bg-violet-500/10 text-violet-200 shadow-[0_0_20px_-8px_rgba(167,139,250,0.25)]",
  },
  {
    label: "Data Engineer",
    className:
      "border-emerald-400/35 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_-8px_rgba(52,211,153,0.22)]",
  },
] as const;

/** 히어로: 지정 문구 그대로 표시 (메인 인트로) */
export function Hero() {
  return (
    <section
      id="intro"
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pt-16"
    >
      {/* 배경 글로우 장식 (성능: CSS만 사용) */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl">
        {/* 소개 타이포는 폭을 좁혀 한 줄 길이(약 45~65자)를 맞춰 가독성 확보 */}
        <div className="max-w-[40rem]">
          <div
            className="mb-5 flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5"
            aria-label={ROLE_CHIPS.map((c) => c.label).join(", ")}
          >
            <Sparkles
              className="h-3.5 w-3.5 shrink-0 text-accent opacity-90"
              aria-hidden
            />
            {ROLE_CHIPS.map(({ label, className }) => (
              <span
                key={label}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium backdrop-blur-sm sm:px-3 sm:text-[13px] ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: ".78rem",
              color: "#4ade80",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#64748b" }}>root@hsh-server:~$</span>
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
              style={{ color: "#4ade80" }}
            />
          </div>

          <h1 className="mb-10 text-balance break-keep text-[1.375rem] font-bold leading-[1.65] tracking-normal text-zinc-100 sm:text-2xl sm:leading-[1.62] lg:text-[1.65rem] lg:leading-[1.68]">
            JWT 인증 시스템, AES-256 암호화, Rate Limiter 등
            <br />
            보안과 안정성을 함께 설계하는 풀스택 개발자{" "}
            <span className="font-extrabold text-accent drop-shadow-[0_0_20px_rgba(34,211,238,0.28)]">
              홍승현
            </span>
            입니다.
          </h1>
        </div>

        <div className="max-w-[40rem] rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-glass backdrop-blur-md sm:p-8">
          {/* 본문은 문장 단위로 나눠 시선이 머물기 쉽게, 대비는 zinc-300으로 상향 */}
          <div className="space-y-5 text-[1.0625rem] leading-[1.85] text-zinc-300 sm:text-lg sm:leading-[1.82]">
            <p className="break-keep text-pretty">
              데이터 무결성과 방어적 아키텍처를 중심으로 개발합니다.
              <br />
              단순히 동작하는 코드가 아닌, 보안과 안정성을 함께 설계하는 것을 지향합니다.
            </p>
            <p className="break-keep text-pretty">
              JWT RTR 전략, AES-256 암호화, Bucket4j Rate Limiter 등
              <br />
              보안 시스템을 직접 설계하고 구현한 경험이 있으며,
              <br />
              금융권·보안·SI 풀스택 포지션을 목표로 준비 중입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
