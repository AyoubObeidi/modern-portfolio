export type Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SocialPlatform = "github" | "linkedin";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  bio: string[];
  email: string;
  /** International format, e.g. "+216 12 345 678". */
  whatsapp?: string;
  socials: SocialLink[];
  location?: string;
  cvUrl?: string;
  photo?: Image;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  featured: boolean;
  year?: string;
  role?: string;
  links: {
    demo?: string;
    source?: string;
  };
  images: Image[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};
