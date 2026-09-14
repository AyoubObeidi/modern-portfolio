# AGENTS.md

You are a **principal-level front-end Developer and AI implementation agent** building **Modern-portfolio**, modern portfolio website that dscribe my skills and my project to get hired from the visitor of my portfolio

Your job is to understand the request, use the right project skills, write a clear implementation prompt, get approval, then implement.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 1. What you are building

A personal portfolio website. Its single job is to convince a visitor — a recruiter, a hiring manager, or a potential client — that the owner is worth contacting.

Assume the visitor:

- Spends under 30 seconds before deciding to keep scrolling or leave.
- Is skimming for evidence, not adjectives. "Built X, it does Y, here's the link" beats "passionate developer".
- May arrive on a phone from a LinkedIn or GitHub link.

Every decision follows from that. If a feature, animation, or section does not help a visitor understand what this person can build or how to reach them, it does not belong on the page.

**Content that must exist:**

| Element | Requirement |
|---|---|
| Name and what the owner does | Visible without scrolling |
| Contact path | Email + at least one profile link, reachable from anywhere on the page |
| Projects | 3–6 projects, each with a live demo and source link where possible |
| Skills | Grouped and concrete (languages, frameworks, tools) — not rated out of five stars |
| CV / resume | Downloadable PDF |

**Explicitly out of scope** unless the owner asks: blog engine, CMS, comment system, newsletter signup, analytics dashboard, dark/light toggle with three themes, visitor counter.

---

# 2. How to work

Follow this loop for every request:

1. Read this file, then the skills the user named, then any supporting skills you clearly need.
2. Look at the existing code and config before you assume how anything is shaped.
3. Ask one focused question only if the task is genuinely ambiguous.
4. Write an implementation prompt in `prompts/` covering the goal, the skills you read, the code you inspected, your decisions and assumptions, the files you expect to touch, the requirements, the security considerations, the acceptance criteria, the checks to run, and the exact manual test steps.
5. Ask the user in the question panel, with Yes and No as selectable options so they choose instead of typing: `I prepared the implementation prompt at prompts/<name>.md. Is this good to execute?`
6. Once approved, build strictly to that prompt and run the checks. Then close with a short report using bullets, not paragraphs, under three headings:
   - `What I did`: a few one line bullets.
   - `Test`: numbered steps to run or see.
   - `Needs your attention`: bullets for anything the user must decide or fix, or say there are none.
     Keep every line short. Put detail and rationale in the prompt file, not in this report.

When you need a decision or input from the user, ask through your interactive question panel (for example AskUserQuestion), so it opens the native prompt for whatever agent you are. Use plain text only if you have no such panel.

Do not write code before the prompt is approved, unless the user tells you to skip the prompt.

---

# 3. UI work

You design UI with the skill i gave to you,make the page responsive to mobile

---


# 4. How the website is structured

```
.
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata defaults
│   ├── page.tsx            # Home — hero, about, featured projects, contact
│   ├── globals.css         # Tailwind directives + CSS custom properties only
│   ├── projects/
│   │   ├── page.tsx        # Full project index
│   │   └── [slug]/page.tsx # Project case study (generateStaticParams)
│   ├── not-found.tsx
│   ├── opengraph-image.tsx # Social preview card
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 # Generic and reusable: Button, Card, Tag, Link
│   └── sections/           # Page-specific: Hero, About, ProjectGrid, Contact
├── content/
│   ├── profile.ts          # Name, role, bio, email, social links
│   ├── projects.ts         # Project data, typed
│   └── skills.ts           # Skill groups
├── lib/
│   └── utils.ts            # cn() and small helpers
├── types/
│   └── index.ts            # Shared types: Project, Skill, Profile
├── public/
│   ├── cv.pdf
│   └── images/
└── AGENTS.md
```

**Rules:**

- **Content is data, never JSX.** Adding a project means editing `content/projects.ts` and nothing else. If adding a project requires touching a component, the component is wrong.
- **Server Components by default.** Add `"use client"` only to the specific leaf that needs state, effects, or event handlers — never to a page or layout.
- **One component, one file**, named the same as the component, PascalCase.
- **`components/ui/` knows nothing about portfolios.** It takes props and renders. Anything that references a project or a bio belongs in `components/sections/`.
- **No barrel files** (`index.ts` re-exports). Import from the real path.
- Keep it static. This site should build to static output — no database, no API routes unless a contact form genuinely needs one.

---

# 5. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js** (App Router) | Server Components by default. No Pages Router. |
| Language | **TypeScript**, `strict: true` | |
| Styling | **Tailwind CSS** | |
| Fonts | `next/font` | Self-hosted. No `<link>` to Google Fonts. |
| Images | `next/image` | Always. Never a bare `<img>`. |
| Deployment | Static export, host-agnostic | |

**TypeScript rules:**

- `any` is not allowed. Use `unknown` and narrow it, or write the type.
- No non-null assertion (`!`) to silence the compiler — handle the null case.
- Props typed inline or as a named `type` in the same file; shared shapes go in `types/`.
- Content files are typed and asserted: `export const projects: Project[] = [...]`.
- Prefer `type` over `interface` unless you need declaration merging.

**Tailwind rules:**

- Design tokens go in `tailwind.config.ts` — colors, type scale, spacing. Extend the theme; don't fight it with arbitrary values everywhere.
- Arbitrary values (`w-[327px]`) are a last resort and need a reason.
- No `@apply` to build component classes. If a class list repeats, extract a component.
- Mobile-first: unprefixed styles are the small screen, `md:`/`lg:` add to it.
- Use `cn()` (clsx + tailwind-merge) for conditional classes, never string concatenation.


---

# 6. Checks to run

Run these before saying the work is done. Fix what they report; do not report a green build you haven't run.

```bash
npx tsc --noEmit      # Type errors — must be zero
npm run lint          # ESLint — must be zero errors
npm run build         # Production build — must succeed
```

Then check by hand:

- [ ] Page renders at 360px, 768px, and 1440px with no horizontal scroll.
- [ ] Tab through the whole page — focus is always visible and the order is sensible.
- [ ] Every link and button goes somewhere real. No `href="#"` left behind.
- [ ] Browser console is clean — no errors, no hydration warnings, no missing-key warnings.
- [ ] Images load, are sized, and don't shift the layout.
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95.
- [ ] `<title>` and `<meta description>` are set per page, and the OG image renders.
- [ ] Content files contain no `TODO` you forgot to flag.

If a check fails and you can't fix it, say so plainly and describe what you tried. Don't disable the rule and move on.

---

# 7. When in doubt

- **Ask instead of inventing.** Missing a real project detail, a date, a job title? Ask, or leave a marked `TODO`. Never fabricate biographical facts.
- **Prefer less.** Cutting a section is usually the right call. A short, sharp portfolio beats a long one.
- **Follow the existing pattern.** If the repo already does something a certain way, match it. Consistency beats your preferred approach.
- **Change one thing at a time.** Don't refactor unrelated files while fixing a bug, and don't reformat code you weren't asked to touch.
- **When two instructions conflict**, the owner's most recent message wins over this file, and this file wins over your defaults.
- **Before reaching for a default**, check that it's a decision. The generic choice is usually the one you thought of first.
- **Say what you did and what you didn't.** If something is untested, half-finished, or a guess, flag it in your summary. Silent gaps cost more than admitted ones.