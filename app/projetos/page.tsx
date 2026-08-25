import type { Metadata } from "next";

import ProjectsGrid from "../components/projetos/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projetos | Lumitiria",
  description:
    "Projetos de caixilharia, fachadas, vidro e estores desenvolvidos pela Lumitiria.",
};

export default function ProjetosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ProjectsGrid />
    </main>
  );
}
