import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutUs() {
  return (
    <section
      id="sobre"
      className="bg-background py-24 md:py-32"
      style={
        {
          "--background": "#1c2620",
          "--foreground": "#f5f3ee",
          "--muted-foreground": "#9fae9f",
          "--border": "rgba(245, 243, 238, 0.14)",
        } as CSSProperties
      }
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        <div>
          <Badge
            variant="outline"
            className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Desde 1974 · Vila Nova de Famalicão
          </Badge>

          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
            Mais de cinco décadas a trabalhar o detalhe.
          </h2>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            A Lumitiria desenvolve soluções de caixilharia de alumínio, vidro
            e fachadas para projetos onde a arquitetura, o desempenho e a
            precisão precisam de coexistir.
          </p>

          <div>
            <Separator className="mb-6" />
            <p className="font-[family-name:var(--font-fraunces)] text-xl italic text-foreground md:text-2xl">
              Experiência que evolui. Soluções que permanecem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
