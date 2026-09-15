import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Explicit override first; on Vercel the production domain is exposed at build time (no protocol); localhost otherwise.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000")
).replace(/\/+$/, "");

export function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

// Gmail's web compose window: works for visitors without a desktop mail app (where mailto: does nothing).
export function gmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

// WhatsApp click-to-chat expects the international number as digits only.
export function whatsappUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}
