import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projetos/${project.id}`}
      className="group relative block h-[340px] overflow-hidden rounded-2xl no-underline"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <p className="mb-2 font-mono text-xs tracking-[0.25em] text-white/60 uppercase">
          {project.category} · {project.location}
        </p>
        <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-medium text-white">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
