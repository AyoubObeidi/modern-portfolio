import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/types";

type ProjectGridProps = {
  projects: Project[];
  headingLevel?: "h2" | "h3";
};

export function ProjectGrid({ projects, headingLevel }: ProjectGridProps) {
  return (
    <ol className="flex flex-col gap-20 md:gap-28">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Reveal>
            <ProjectCard project={project} index={index} headingLevel={headingLevel} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
