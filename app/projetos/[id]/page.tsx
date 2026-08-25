import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectById, getProjects } from "@/lib/data/projects";

export function generateStaticParams() {
  return getProjects().map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projetos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return { title: "Projeto não encontrado | Lumitiria" };
  }

  return {
    title: `${project.title} | Lumitiria`,
    description: project.summary,
  };
}

export default async function ProjetoPage({
  params,
}: PageProps<"/projetos/[id]">) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-background pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <Link
            href="/projetos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar aos projetos
          </Link>

          <div className="mt-8">
            <Badge
              variant="outline"
              className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              {project.category} · {project.year}
            </Badge>

            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {project.location}
            </p>
          </div>

          <div className="relative mt-10 h-[320px] w-full overflow-hidden rounded-3xl md:h-[480px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-5">
              {project.description.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-foreground/90 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Detalhes
              </p>

              <Separator className="my-4" />

              <dl className="flex flex-col gap-4">
                {project.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/#orcamento"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "mt-8 w-full",
                })}
              >
                Pedir orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
