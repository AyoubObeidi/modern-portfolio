import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" tabIndex={-1} className="py-20 outline-none md:py-28">
      <Container>
        <SectionHeading id="about-title" index="03" label="About" title="A bit about me" />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:pl-50">
          <Reveal className="flex max-w-2xl flex-col gap-5 text-lg leading-relaxed text-muted md:col-span-8">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          {profile.photo && (
            <Reveal delay={0.1} className="md:col-span-4">
              <Image
                src={profile.photo.src}
                alt={profile.photo.alt}
                width={profile.photo.width}
                height={profile.photo.height}
                sizes="(min-width: 768px) 25vw, 100vw"
                className="aspect-4/5 w-full rounded-xl border border-line object-cover"
              />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
