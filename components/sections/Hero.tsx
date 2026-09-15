import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RevealText } from "@/components/ui/RevealText";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const showcase = projects.find((project) => project.featured && project.images.length > 0);
  const showcaseImage = showcase?.images[0];

  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-20 md:pt-20 md:pb-28">
      <Container>
        <h1 id="hero-title" data-intro-item className="font-mono text-sm text-muted">
          {profile.name} <span className="text-accent">—</span> {profile.role}
        </h1>

        <RevealText
          as="p"
          trigger="load"
          delayMs={120}
          text={profile.headline}
          className="mt-5 max-w-5xl text-display font-semibold text-balance"
        />

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className={cn("flex flex-col gap-8", showcase ? "md:col-span-5" : "md:col-span-7")}>
            <p data-intro-item style={delay(450)} className="max-w-md text-lg leading-relaxed text-muted">
              {profile.intro}
            </p>

            <div data-intro-item style={delay(550)} className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#work">
                See my work
                <Icon name="arrow-right" />
              </ButtonLink>
              {profile.cvUrl && (
                <ButtonLink href={profile.cvUrl} variant="secondary" download>
                  <Icon name="document" />
                  Download CV
                </ButtonLink>
              )}
              {profile.socials.map((social) => (
                <ButtonLink key={social.platform} href={social.href} variant="secondary" newTab>
                  <Icon name={social.platform} />
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              ))}
            </div>
          </div>

          {showcase && showcaseImage && (
            <figure data-intro-item style={delay(650)} className="md:col-span-7">
              <Link
                href={`/projects/${showcase.slug}`}
                className="block overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-bone/40"
              >
                <Image
                  src={showcaseImage.src}
                  alt={showcaseImage.alt}
                  width={showcaseImage.width}
                  height={showcaseImage.height}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  className="h-auto w-full"
                />
              </Link>
              <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-muted">
                <span>
                  {showcase.title} — {showcase.tagline}
                </span>
                {showcase.links.demo && (
                  <span className="flex shrink-0 items-center gap-1.5 text-accent">
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Live
                  </span>
                )}
              </figcaption>
            </figure>
          )}
        </div>
      </Container>
    </section>
  );
}
