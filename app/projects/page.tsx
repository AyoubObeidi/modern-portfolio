import type { Metadata } from "next";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Container } from "@/components/ui/Container";
import { RevealText } from "@/components/ui/RevealText";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `Projects built by ${profile.name}: ${projects.map((project) => project.title).join(", ")}.`,
};

export default function ProjectsPage() {
  return (
    <section aria-labelledby="projects-title" className="pt-14 pb-24 md:pt-24 md:pb-32">
      <Container>
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">{String(projects.length).padStart(2, "0")}</span> / Projects
        </p>
        <RevealText
          id="projects-title"
          as="h1"
          trigger="load"
          text="Everything I've built"
          className="mt-5 max-w-4xl text-display font-semibold text-balance"
        />
        <div className="mt-16 md:mt-24">
          <ProjectGrid projects={projects} headingLevel="h2" />
        </div>
      </Container>
    </section>
  );
}
