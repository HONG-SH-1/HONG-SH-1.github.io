import type { ReactNode } from "react";
import type { SectionId } from "../constants/sections";

type AnimatedSectionProps = {
  id: SectionId;
  children: ReactNode;
  className?: string;
};

export function AnimatedSection({
  id,
  children,
  className = "",
}: AnimatedSectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
