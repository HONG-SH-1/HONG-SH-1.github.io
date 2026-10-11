/** Observatory — cosmic backdrop + editorial content layer */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fg: {
          DEFAULT: "#e8e6e1",
          muted: "#9a968e",
          faint: "#6b6760",
        },
        accent: {
          DEFAULT: "#d4a853",
          bright: "#e8c078",
          dim: "rgba(212, 168, 83, 0.14)",
        },
        surface: {
          DEFAULT: "#0a0a0c",
          raised: "rgba(255, 255, 255, 0.035)",
          overlay: "rgba(8, 8, 10, 0.78)",
        },
        line: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.14)",
        },
        /** legacy aliases — gradual migration */
        primary: "#e8e6e1",
        "on-surface": "#e8e6e1",
        "on-surface-variant": "#9a968e",
        tertiary: "#d4a853",
        outline: "#6b6760",
        "outline-variant": "rgba(255, 255, 255, 0.08)",
        background: "transparent",
        "surface-container": "rgba(255, 255, 255, 0.04)",
        "surface-container-low": "rgba(255, 255, 255, 0.02)",
        "surface-dim": "#0a0a0c",
      },
      spacing: {
        gutter: "1.5rem",
        "margin-mobile": "1.25rem",
        "margin-desktop": "4rem",
        "section-y": "5.5rem",
        "content-max": "44rem",
        "wide-max": "72rem",
      },
      maxWidth: {
        content: "44rem",
        wide: "72rem",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Pretendard Variable", "Pretendard", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.25rem,5vw,3.25rem)", { lineHeight: "1.12", letterSpacing: "-0.03em", fontWeight: "700" }],
        h1: ["clamp(1.75rem,3.5vw,2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["clamp(1.35rem,2.5vw,1.65rem)", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        h3: ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.75", fontWeight: "400" }],
        sm: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        xs: ["0.75rem", { lineHeight: "1.5", fontWeight: "500" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em", fontWeight: "600" }],
      },
      borderRadius: {
        panel: "0.875rem",
        pill: "9999px",
      },
      boxShadow: {
        panel: "0 4px 32px rgba(0, 0, 0, 0.35)",
        glow: "0 0 24px rgba(212, 168, 83, 0.12)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
