import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  const allProjects = getProjects();

  return (
    <section className="bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <Badge
          variant="outline"
          className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Projetos
        </Badge>

        <h1 className="max-w-2xl font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
          Trabalhos que dão forma ao que fazemos.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Uma seleção de projetos de caixilharia, fachadas, vidro e estores
          desenvolvidos para clientes particulares e empresariais.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
