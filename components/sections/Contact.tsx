import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { profile } from "@/content/profile";
import { gmailComposeUrl, whatsappUrl } from "@/lib/utils";

export function Contact() {
  const composeUrl = gmailComposeUrl(profile.email);

  return (
    <section id="contact" aria-labelledby="contact-title" tabIndex={-1} className="py-20 outline-none md:py-32">
      <Container>
        <div className="border-t border-line pt-6">
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">04</span> / Contact
          </p>
          <RevealText
            id="contact-title"
            as="h2"
            text="Have a role or a project in mind?"
            className="mt-6 max-w-4xl text-display font-semibold text-balance"
          />

          <Reveal className="mt-10 flex flex-col gap-8 md:mt-14">
            <a
              href={composeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-2xl font-medium break-all text-accent underline decoration-accent decoration-2 underline-offset-8 transition-colors duration-200 hover:text-accent-hover hover:decoration-accent-hover md:text-4xl"
            >
              {profile.email}
              <span className="sr-only"> (opens Gmail in a new tab)</span>
            </a>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={composeUrl} newTab>
                <Icon name="mail" />
                Email me
                <span className="sr-only"> (opens Gmail in a new tab)</span>
              </ButtonLink>
              {profile.whatsapp && (
                <ButtonLink href={whatsappUrl(profile.whatsapp)} variant="secondary" newTab>
                  <Icon name="whatsapp" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              )}
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
