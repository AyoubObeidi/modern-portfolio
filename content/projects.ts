import type { Project } from "@/types";

// TODO: add 2–5 more projects — a portfolio should show 3–6.
export const projects: Project[] = [
  {
    slug: "vertex",
    title: "Vertex",
    tagline: "Learning platform with search that jumps to the exact second.",
    summary:
      "Authors publish courses in Sanity and learners watch them on a Next.js site. Learners search in plain language and get ranked cards that open the lesson video at the exact moment the topic is taught.",
    highlights: [
      "Design system built from a reference sheet as Tailwind v4 tokens and reusable React components.",
      "Catalog, course, lesson and search pages matched to desktop designs, then adapted down to mobile.",
      "Search results page with video-moment cards that open the lesson video at the matched second.",
      "Clerk sign-in, learner progress and a “My Learning” page, plus a light/dark theme.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Sanity", "Clerk", "PostHog"],
    featured: true,
    // Year and role from the repo's git history (all commits by Ayoub, plus one review bot). TODO: confirm role.
    year: "2026",
    role: "Solo project",
    links: {
      demo: "https://vertex-iota-ashy.vercel.app/",
      source: "https://github.com/AyoubObeidi/vertex-learning-platform",
    },
    // Screenshots captured from the live deployment on 2026-09-14.
    // TODO: add a search-results screenshot once live search works again (it returned "Search is unavailable right now.").
    images: [
      {
        src: "/images/projects/vertex/home.webp",
        alt: "Vertex home page with the headline “Search your learning in plain English.”, an Explore Courses button and a plain-language search box.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/projects/vertex/lesson.webp",
        alt: "Vertex lesson page with the course's module list in a sidebar, lesson badges, breadcrumb and the embedded lesson video.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/projects/vertex/course.webp",
        alt: "Vertex course page for Next.js for Production with cover image, level, duration, modules, Start Learning button and a progress bar.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/projects/vertex/home-dark.webp",
        alt: "Vertex home page in the dark theme.",
        width: 1600,
        height: 1000,
      },
    ],
  },
];
