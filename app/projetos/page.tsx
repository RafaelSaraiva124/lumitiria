import type { Metadata } from "next";

import ProjectsGrid from "../components/projetos/ProjectsGrid";

const description =
  "Projetos de caixilharia, fachadas, vidro e estores desenvolvidos pela Lumitiria.";

export const metadata: Metadata = {
  title: "Projetos",
  description,
  openGraph: {
    title: "Projetos | Lumitiria",
    description,
  },
  twitter: {
    title: "Projetos | Lumitiria",
    description,
  },
};

export default function ProjetosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ProjectsGrid />
    </main>
  );
}
