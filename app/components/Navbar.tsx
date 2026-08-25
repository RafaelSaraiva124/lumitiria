import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Projetos", href: "/projetos" },
  { label: "Contactos", href: "/contactos" },
];

export default function Navbar() {
  return (
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between gap-6 px-6 py-5 md:px-10 md:py-6 lg:px-12">


          <Link
              href="/"
              className="
            text-2xl
            font-semibold
            uppercase
            tracking-[0.08em]
            text-white
            no-underline
          "
          >
            Lumitiria
          </Link>

          <div className="flex items-center gap-6">

            <div className="hidden items-center gap-6 sm:flex">

              {NAV_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="
                text-sm
                font-medium
                text-white
                no-underline
                transition-opacity
                hover:opacity-60
              "
                >
                  {link.label}
                </Link>
              ))}

            </div>

            <Link
                href="/#orcamento"
                className="
              hidden
              rounded-full
              border
              border-white
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-black
              no-underline
              transition
              hover:opacity-80
              sm:inline-block
            "
            >
              Pedir orçamento
            </Link>

            <Sheet>
              <SheetTrigger
                  aria-label="Abrir menu"
                  className="text-white sm:hidden"
              >
                <Menu className="size-6" />
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Lumitiria</SheetTitle>
                  <SheetDescription>Menu de navegação</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => (
                    <SheetClose
                        key={link.href}
                        render={
                          <Link
                              href={link.href}
                              className="rounded-lg px-2 py-3 text-base font-medium text-foreground no-underline transition-colors hover:bg-muted"
                          />
                        }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-4 p-4">
                  <Separator />

                  <SheetClose
                      render={
                        <Link
                            href="/#orcamento"
                            className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground no-underline transition hover:opacity-80"
                        />
                      }
                  >
                    Pedir orçamento
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

          </div>

        </nav>
      </header>
  );
}
