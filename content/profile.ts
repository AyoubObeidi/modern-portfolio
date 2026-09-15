import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Ayoub Obeidi",
  role: "Front-end developer",
  // TODO: confirm wording.
  headline: "I build interfaces for the web with React and Next.js.",
  intro:
    "Most recently Vertex — a learning platform whose search opens a lesson video at the exact second a topic is taught.",
  bio: [
    "I'm a frontend developer specializing in Next.js, TypeScript, and Tailwind CSS. I build fast, type-safe, and responsive web applications with a strong focus on clean architecture and pixel-perfect UI. I enjoy working across the stack when needed, optimizing performance, and crafting interfaces that feel intuitive and polished.",
  ],
  // TODO: confirm this is the address you want public.
  email: "ayoubmacos05@gmail.com",
  whatsapp: "+213 673208373",
  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/AyoubObeidi" },
    // TODO: add LinkedIn — { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/…" }
  ],
  // TODO: add public/cv.pdf, then set cvUrl: "/cv.pdf".
  cvUrl: undefined,
  // TODO: add a real photo at public/images/profile.webp, then set photo.
  photo: undefined,
};
