import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternal } from "@/lib/utils";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  newTab?: boolean;
  className?: string;
};

export function TextLink({ href, children, newTab = false, className }: TextLinkProps) {
  const classes = cn(
    "group inline-flex items-center gap-1.5 font-medium text-accent underline decoration-accent/40 decoration-1 underline-offset-6 transition-colors duration-200 hover:text-accent-hover hover:decoration-accent-hover",
    className,
  );

  if (isExternal(href)) {
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
