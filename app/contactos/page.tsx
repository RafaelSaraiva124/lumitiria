import type { Metadata } from "next";

import Contactos from "../components/contactos";
import Cta from "../components/cta";

const description =
  "Contacta a Lumitiria — Rua do Comércio Lote 30, Vilarinho das Cambas, Vila Nova de Famalicão.";

export const metadata: Metadata = {
  title: "Contactos",
  description,
  openGraph: {
    title: "Contactos | Lumitiria",
    description,
  },
  twitter: {
    title: "Contactos | Lumitiria",
    description,
  },
};

export default function ContactosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Contactos />
      <Cta />
    </main>
  );
}
