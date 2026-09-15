import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/content/skills";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" tabIndex={-1} className="py-20 outline-none md:py-28">
      <Container>
        <SectionHeading id="skills-title" index="02" label="Skills" title="What I build with" />

        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 md:pl-50 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <dt className="font-mono text-xs tracking-wide text-muted uppercase">{group.title}</dt>
              <dd className="mt-3">
                <ul className="flex flex-col gap-1.5 text-lg text-bone">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
