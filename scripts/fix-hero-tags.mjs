import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const p = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/components/Hero.tsx"
);
const D = "div";
let s = fs.readFileSync(p, "utf8");

const bad = `            </${D}>
          </${D}>
        </${D}>

          </${D}>
        </${D}>
      </${D}>`;

const good = `            </${D}>
          </TiltCard>
        </ScrollReveal>
      </${D}>`;

if (!s.includes(bad)) {
  console.error("pattern not found");
  process.exit(1);
}

s = s.replace(bad, good);
fs.writeFileSync(p, s, "utf8");
console.log("fixed", s.includes("</TiltCard>"));
