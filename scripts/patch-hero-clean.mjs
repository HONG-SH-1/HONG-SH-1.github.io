import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const D = "div";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcPath = path.join(root, "scripts/hero-from-git.tsx");
const outPath = path.join(root, "src/components/Hero.tsx");
const MARKER = "\ud64d\uc2b9\ud604";

let h = fs.readFileSync(srcPath, "utf8");
if (!h.includes(MARKER)) {
  console.error("Korean not found in scripts/hero-from-git.tsx");
  process.exit(1);
}

h = h.replace(
  'import { TypeAnimation } from "react-type-animation";',
  'import { TypeAnimation } from "react-type-animation";\nimport { AnimatedSection } from "./AnimatedSection";\nimport { ScrollReveal } from "./ScrollReveal";\nimport { TiltCard } from "./TiltCard";'
);

h = h.replace(/const HERO_IMG =[^\n]+\n\n/, "");
h = h.replace(/\/\*\*[^\n]+\n/, "");

h = h.replace("<section", "<AnimatedSection");
h = h.replace("</section>", "</AnimatedSection>");

h = h.replace(
  `<${D} className="mx-auto grid w-full max-w-max-width grid-cols-1 items-center gap-gutter lg:grid-cols-12">\n        <${D} className="relative z-20 lg:col-span-7">`,
  `<${D} className="mx-auto w-full max-w-max-width">\n        <ScrollReveal>\n          <${D} className="relative z-20 max-w-4xl">`
);

h = h.replace(
  `</h1>\n\n          <${D} className="glass-card rounded-brand p-6 sm:p-8">`,
  `</h1>\n          </${D}>\n        </ScrollReveal>\n\n        <ScrollReveal delayMs={120}>\n          <TiltCard className="glass-card glass-panel-tilt rounded-brand p-6 sm:p-8">`
);

h = h.replace(
  new RegExp(
    `        <${D} className="relative mt-12 flex items-center justify-center lg:col-span-5 lg:mt-0">[\\s\\S]*?        </${D}>\\n`,
    "m"
  ),
  ""
);

h = h.replace(
  `            </${D}>\n          </${D}>\n        </${D}>\n\n          </${D}>\n        </${D}>\n      </${D}>`,
  `            </${D}>\n          </TiltCard>\n        </ScrollReveal>\n      </${D}>`
);

h = h.replace(
  `      <${D} className="mx-auto mt-16 flex max-w-max-width flex-col items-center gap-4 px-margin-mobile md:px-margin-desktop">`,
  `      <ScrollReveal\n        delayMs={200}\n        className="mx-auto mt-16 flex max-w-max-width flex-col items-center gap-4 px-margin-mobile md:px-margin-desktop"\n      >`
);

h = h.replace(
  `        </${D}>\n      </${D}>\n    </AnimatedSection>`,
  `        </${D}>\n      </ScrollReveal>\n    </AnimatedSection>`
);

h = h.replace('style={{ color: "#2fd9f4" }}', 'style={{ color: "#00f2ff" }}');
h = h.replace(
  "from-tertiary to-secondary bg-clip-text",
  "from-primary-fixed to-tertiary-fixed-dim bg-clip-text"
);
h = h.replace(
  "drop-shadow-[0_0_20px_rgba(47,217,244,0.28)]",
  "drop-shadow-[0_0_20px_rgba(0,242,255,0.35)]"
);

fs.writeFileSync(outPath, h, "utf8");
const out = fs.readFileSync(outPath, "utf8");
console.log("ok:", out.includes(MARKER), "bad:", out.includes("???"));
if (!out.includes(MARKER) || out.includes("???")) process.exit(1);
