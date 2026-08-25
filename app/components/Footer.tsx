import Link from "next/link";
import { BookText } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Sobre", href: "/#sobre" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Contactos", href: "/contactos" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-base font-semibold uppercase tracking-[0.08em] text-foreground">
              Lumitiria
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Soluções de caixilharia de alumínio, vidro e fachadas desde
              1974.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Navegação
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Contactos
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground/80">
              <li>
                <a
                  href="tel:+351252315049"
                  className="no-underline transition-colors hover:text-foreground"
                >
                  +351 252 315 049
                </a>
              </li>
              <li>
                <a
                  href="mailto:lumitiria@sapo.pt"
                  className="no-underline transition-colors hover:text-foreground"
                >
                  lumitiria@sapo.pt
                </a>
              </li>
              <li className="text-muted-foreground">
                Rua do Comércio Lote 30, Vilarinho das Cambas
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Lumitiria. Todos os direitos reservados.
          </p>

          <a
            href="https://www.livroreclamacoes.pt/Inicio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground no-underline transition-colors hover:bg-muted"
          >
            <BookText className="size-4" />
            Livro de Reclamações
          </a>
        </div>
      </div>
    </footer>
  );
}
