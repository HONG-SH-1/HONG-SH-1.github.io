import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/Hero.tsx"
);

const ko = {
  badge: "Portfolio \u00b7 \ubc31\uc5d4\ub4dc \u00b7 \ubcf4\uc548 \u00b7 AI",
  h1a:
    "JWT RTR, AES-256, MLP\u00b7Bi-LSTM Cascade \uc559\uc0c1\ube14\ub85c \uae08\uc735 FDS \u00b7 \ubcf4\uc548",
  h1b: "\uc2dc\uc2a4\ud15c\uc744 \uc124\uacc4\ud558\ub294 \ud480\uc2a4\ud0dd \uc5d4\uc9c0\ub2c8\uc5b4",
  name: "\ud64d\uc2b9\ud604",
  end: "\uc785\ub2c8\ub2e4.",
  p1a:
    "\ub370\uc774\ud130 \ubb34\uacb0\uc131\uacfc \ubc29\uc5b4\uc801 \uc544\ud0a4\ud14d\ucc98\ub97c \uc911\uc2ec\uc73c\ub85c \uac1c\ubc1c\ud569\ub2c8\ub2e4.",
  p1b:
    "\ub2e8\uc21c\ud788 \ub3d9\uc791\ud558\ub294 \ucf54\ub4dc\uac00 \uc544\ub2cc, \uc9c4\uc785\uc810\ubd80\ud130 \uc678\ubd80 \uacf5\uaca9\uc744 \ucc28\ub2e8\ud558\ub294 \ubcf4\uc548",
  p1c: "\uc778\ud504\ub77c \uc124\uacc4\ub97c \uc9c0\ud5a5\ud569\ub2c8\ub2e4.",
  p2a:
    "JWT RTR \uc804\ub7b5, AES-256 \uc554\ud638\ud654, Bucket4j Rate Limiter\ub85c Zero-Trust",
  p2b: "\ubc31\uc5d4\ub4dc\ub97c \uad6c\ucd95\ud558\uace0,",
  p2c:
    "MLP \u2192 Bi-LSTM Cascade \uc559\uc0c1\ube14\uacfc SHAP \uae30\ubc18 \uc124\uba85 \uac00\ub2a5\ud55c AI(XAI)\ub97c \uc9c1\uc811",
  p2d: "\uc124\uacc4\u00b7\uad6c\ud604\ud55c \uacbd\ud5d8\uc774 \uc788\uc2b5\ub2c8\ub2e4.",
  p3a:
    "\ubcf4\uc548\uacfc \uc548\uc815\uc131\uc774 \uc694\uad6c\ub418\ub294 \ud658\uacbd\uc5d0\uc11c, \ubc31\uc5d4\ub4dc\ubd80\ud130 AI\uae4c\uc9c0 \ud480\uc0ac\uc774\ud074\ub85c \uc2e0\ub8b0\ud560",
  p3b:
    "\uc218 \uc788\ub294 \uc2dc\uc2a4\ud15c\uc744 \ub9cc\ub4dc\ub294 \uac83\uc744 \ubaa9\ud45c\ub85c \uc900\ube44 \uc911\uc785\ub2c8\ub2e4.",
  scroll: "\uc544\ub798\ub85c \uc2a4\ud06c\ub864",
};

const content = `import { Sparkles } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";

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

export function Hero() {
  return (
    <AnimatedSection
      id="intro"
      className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center px-margin-mobile pb-16 pt-28 md:px-margin-desktop md:pt-32"
    >
      <div className="mx-auto w-full max-w-max-width">
        <ScrollReveal>
          <motionless className="relative z-20 max-w-4xl">
`.replace(/motionless/g, "div");

// Build rest in parts to avoid typo
const part2 = `
            <motionless className="mb-6 inline-block border border-tertiary/40 px-3 py-1">
`.replace(/motionless/g, "motionless");
