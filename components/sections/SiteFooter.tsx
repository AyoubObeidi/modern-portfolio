import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { gmailComposeUrl, whatsappUrl } from "@/lib/utils";

export function SiteFooter() {
  const links = [
    { label: "Email", href: gmailComposeUrl(profile.email), note: " (opens Gmail in a new tab)" },
    ...(profile.whatsapp ? [{ label: "WhatsApp", href: whatsappUrl(profile.whatsapp), note: " (opens in a new tab)" }] : []),
    ...profile.socials.map((social) => ({ label: social.label, href: social.href, note: " (opens in a new tab)" })),
  ];

  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col gap-3 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex flex-wrap gap-5">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {link.label}
                <span className="sr-only">{link.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
