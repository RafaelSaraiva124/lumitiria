import type { ReactNode } from "react";
import { HardHat, Landmark, Mail, MapPin, Phone, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import LocationMap from "./LocationMap";

type ContactItem = {
  icon: typeof MapPin;
  label: string;
  lines: ReactNode[];
};

const contactItems: ContactItem[] = [
  {
    icon: MapPin,
    label: "Morada",
    lines: [
      "Rua do Comércio Lote 30",
      "4760-739 Vilarinho das Cambas",
      "Vila Nova de Famalicão",
    ],
  },
  {
    icon: Phone,
    label: "Telefone",
    lines: [
      <a key="tel" href="tel:+351252315049" className="hover:text-foreground">
        +351 252 315 049
      </a>,
    ],
  },
  {
    icon: Mail,
    label: "Email",
    lines: [
      <a
        key="email"
        href="mailto:lumitiria@sapo.pt"
        className="hover:text-foreground"
      >
        lumitiria@sapo.pt
      </a>,
    ],
  },
  {
    icon: Landmark,
    label: "Departamento Financeiro",
    lines: [
      <a key="tel" href="tel:+351252315049" className="hover:text-foreground">
        +351 252 315 049
      </a>,
    ],
  },
  {
    icon: HardHat,
    label: "Departamento de Produção",
    lines: [
      "Pedro Moreira",
      <a key="tel" href="tel:+351252315049" className="hover:text-foreground">
        +351 252 315 049
      </a>,
      <span key="mobile" className="inline-flex items-center gap-1.5">
        <Smartphone className="size-3.5" />
        <a href="tel:+351966918355" className="hover:text-foreground">
          966 918 355
        </a>
      </span>,
    ],
  },
];

export default function Contactos() {
  return (
    <section className="bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        <div>
          <Badge
            variant="outline"
            className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Contactos
          </Badge>

          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
            Fala connosco.
          </h1>

          <div className="mt-10 flex flex-col gap-3">
            {contactItems.map(({ icon: Icon, label, lines }) => (
              <div
                key={label}
                className="group flex gap-4 rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:bg-muted/60"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
                  <Icon className="size-4" />
                </div>

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-0.5 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {lines.map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[360px] md:min-h-[560px]">
          <LocationMap />
        </div>
      </div>
    </section>
  );
}
