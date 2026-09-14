import Link from "next/link";
import { MobileNav } from "@/components/sections/MobileNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { gmailComposeUrl } from "@/lib/utils";

const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-line/70 bg-ink/95">
      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex items-baseline gap-2 font-semibold tracking-tight text-bone">
          {profile.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors duration-200 hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={gmailComposeUrl(profile.email)} size="sm" newTab>
            <Icon name="mail" className="text-base" />
            Email me
            <span className="sr-only"> (opens Gmail in a new tab)</span>
          </ButtonLink>
          <MobileNav
            links={navLinks}
            menuIcon={<Icon name="menu" />}
            closeIcon={<Icon name="close" />}
          />
        </div>
      </div>
    </header>
  );
}
