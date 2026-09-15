"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type MobileNavProps = {
  links: { href: string; label: string }[];
  menuIcon: ReactNode;
  closeIcon: ReactNode;
};

export function MobileNav({ links, menuIcon, closeIcon }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-line text-xl text-bone transition-colors hover:bg-surface"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? closeIcon : menuIcon}
      </button>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-ink"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line/60 last:border-0">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center text-lg text-bone transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
