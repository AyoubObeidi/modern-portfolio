import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternal } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  newTab?: boolean;
  download?: boolean;
  className?: string;
};

const variants = {
  primary: "bg-accent text-ink hover:bg-accent-hover",
  secondary: "border border-line text-bone hover:border-bone/60 hover:bg-surface",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-12 px-5 text-base",
};

type ButtonStyle = Pick<ButtonLinkProps, "variant" | "size" | "className">;

function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyle = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,transform] duration-200 active:scale-98",
    variants[variant],
    sizes[size],
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  newTab = false,
  download = false,
  className,
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });

  if (isExternal(href) || download) {
    return (
      <a
        href={href}
        className={classes}
        download={download || undefined}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
