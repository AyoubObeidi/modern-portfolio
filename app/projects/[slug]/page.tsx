import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Tag } from "@/components/ui/Tag";
import { ProjectMedia } from "@/components/sections/ProjectMedia";
import { projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: `${project.tagline} ${project.summary}`,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  const [cover, ...gallery] = project.images;

  return (
    <article className="pt-10 pb-24 md:pt-16 md:pb-32">
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent-hover"
        >
          <Icon name="arrow-left" />
          All projects
        </Link>

        <header className="mt-10 md:mt-14">
          <p className="font-mono text-sm text-muted">
            {[project.year, project.role].filter(Boolean).join(" · ") || "Case study"}
          </p>
          <RevealText
            as="h1"
            trigger="load"
            text={project.title}
            className="mt-4 text-display font-semibold text-balance"
          />
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted md:text-2xl">{project.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo && (
              <ButtonLink href={project.links.demo} newTab>
                Live demo
                <Icon name="arrow-up-right" />
                <span className="sr-only"> (opens in a new tab)</span>
              </ButtonLink>
            )}
            {project.links.source && (
              <ButtonLink href={project.links.source} variant="secondary" newTab>
                <Icon name="github" />
                Source code
                <span className="sr-only"> (opens in a new tab)</span>
              </ButtonLink>
            )}
          </div>
        </header>

        <div className="mt-14 md:mt-20">
          {cover ? (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                sizes="(min-width: 1152px) 1088px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="h-auto w-full"
              />
            </div>
          ) : (
            <ProjectMedia project={project} sizes="100vw" />
          )}
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <h2 className="font-mono text-xs tracking-wide text-muted uppercase">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="flex flex-col gap-12 md:col-span-8">
            <Reveal>
              <h2 className="font-mono text-xs tracking-wide text-muted uppercase">Overview</h2>
              <p className="mt-4 text-xl leading-relaxed text-bone">{project.summary}</p>
            </Reveal>

            <Reveal>
              <h2 className="font-mono text-xs tracking-wide text-muted uppercase">What it does</h2>
              <ul className="mt-4 flex flex-col">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-4 border-t border-line py-4 text-lg leading-relaxed text-muted">
                    <span className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="mt-20 md:mt-28">
            <h2 id="gallery-title" className="font-mono text-xs tracking-wide text-muted uppercase">
              Screens
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {gallery.map((image) => (
                <li key={image.src}>
                  <Reveal>
                    <div className="overflow-hidden rounded-xl border border-line bg-surface">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="h-auto w-full"
                      />
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}

        {next && (
          <nav aria-label="Next project" className="mt-24 border-t border-line pt-8 md:mt-32">
            <Link href={`/projects/${next.slug}`} className="group flex flex-col gap-2">
              <span className="font-mono text-sm text-muted">Next project</span>
              <span className="flex items-center gap-4 text-title font-semibold transition-colors duration-200 group-hover:text-accent">
                {next.title}
                <Icon name="arrow-right" className="transition-transform duration-200 group-hover:translate-x-2" />
              </span>
            </Link>
          </nav>
        )}
      </Container>
    </article>
  );
}
