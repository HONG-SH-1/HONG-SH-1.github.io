import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let h = fs.readFileSync(path.join(root, "scripts/hero-from-git.tsx"), "utf8");

if (!h.includes("홍승현")) {
  console.error("Korean missing in git source");
  process.exit(1);
}

h = h.replace(
  `import { TypeAnimation } from "react-type-animation";`,
  `import { TypeAnimation } from "react-type-animation";
import { AnimatedSection } from "./AnimatedSection";
import { ScrollReveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";`
);

h = h.replace(/const HERO_IMG =[^\n]+\n\n/, "");
h = h.replace(/\/\*\* 히어로[^\n]+\n/, "");

h = h.replace("<section", "<AnimatedSection").replace("</section>", "</AnimatedSection>");

h = h.replace(
  `<div className="mx-auto grid w-full max-w-max-width grid-cols-1 items-center gap-gutter lg:grid-cols-12">
        <motionless className="relative z-20 lg:col-span-7">`,
  `<div className="mx-auto w-full max-w-max-width">
        <ScrollReveal>
          <motionless className="relative z-20 max-w-4xl">`
);

h = h.replace(
  `<motionless className="relative z-20 lg:col-span-7">`,
  `<ScrollReveal>
          <motionless className="relative z-20 max-w-4xl">`
);
