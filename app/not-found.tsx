import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="py-24 md:py-40">
      <Container>
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">404</span> / Not found
        </p>
        <h1 className="mt-5 max-w-3xl text-display font-semibold text-balance">This page doesn&apos;t exist.</h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">
            <Icon name="arrow-left" />
            Back home
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            See projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
