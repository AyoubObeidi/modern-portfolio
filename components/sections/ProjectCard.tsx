import Link from "next/link";
import { ProjectMedia } from "@/components/sections/ProjectMedia";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
  index: number;
  headingLevel?: "h2" | "h3";
};

const visibleTags = 6;

export function ProjectCard({ project, index, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const caseStudy = `/projects/${project.slug}`;
  const hiddenTags = project.stack.length - visibleTags;

  return (
    <article className="group grid gap-8 md:grid-cols-12 md:items-center md:gap-10">
      <Link
        href={caseStudy}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("block md:col-span-7", index % 2 === 1 && "md:order-2")}
      >
        <ProjectMedia project={project} sizes="(min-width: 768px) 58vw, 100vw" />
      </Link>

      <div className="flex flex-col gap-5 md:col-span-5">
        <p className="flex items-center gap-3 font-mono text-xs text-muted">
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          {project.year && <span>{project.year}</span>}
          {project.links.demo && (
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Live
            </span>
          )}
        </p>

        <Heading className="text-3xl font-semibold tracking-tight md:text-4xl">
          <Link href={caseStudy} className="transition-colors duration-200 hover:text-accent">
            {project.title}
          </Link>
        </Heading>

        <p className="text-lg leading-relaxed text-muted">{project.summary}</p>

        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} tech stack`}>
          {project.stack.slice(0, visibleTags).map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
          {hiddenTags > 0 && (
            <li>
              <Tag>+{hiddenTags} more</Tag>
            </li>
          )}
        </ul>

        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
          <TextLink href={caseStudy}>
            Case study
            <span className="sr-only">: {project.title}</span>
            <Icon name="arrow-right" />
          </TextLink>
          {project.links.demo && (
            <TextLink href={project.links.demo} newTab>
              Live demo
              <Icon name="arrow-up-right" />
            </TextLink>
          )}
          {project.links.source && (
            <TextLink href={project.links.source} newTab>
              Source
              <Icon name="github" />
            </TextLink>
          )}
        </div>
      </div>
    </article>
  );
}
