import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getProjects } from "@/lib/data/projects";
import ProjectCard from "./ProjectCard";

const FEATURED_COUNT = 3;

export default function Projects() {
  const featuredProjects = getProjects().slice(0, FEATURED_COUNT);

  return (
    <section id="projetos" className="bg-background py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Projetos
            </Badge>

            <h2 className="max-w-xl font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Alguns dos projetos que já demos forma.
            </h2>
          </div>

          <Link
            href="/projetos"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "self-start md:self-auto",
            })}
          >
            Ver todos os projetos
            <ArrowUpRight />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
