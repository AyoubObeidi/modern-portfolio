import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Skills } from "@/components/sections/Skills";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { projects } from "@/content/projects";

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Hero />

      <section id="work" aria-labelledby="work-title" tabIndex={-1} className="py-20 outline-none md:py-28">
        <Container>
          <SectionHeading id="work-title" index="01" label="Selected work" title="Things I've shipped" />
          <div className="mt-14 md:mt-20">
            <ProjectGrid projects={featured} />
          </div>
          {projects.length > 0 && (
            <div className="mt-16">
              <TextLink href="/projects">
                All projects
                <Icon name="arrow-right" />
              </TextLink>
            </div>
          )}
        </Container>
      </section>

      <Skills />
      <About />
      <Contact />
    </>
  );
}
