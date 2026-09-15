# Implementation prompt: Rewrite "A bit about me"

## Goal

Replace the About section text with a short, professional bio that does not mention Vertex.

## Skills read

- `AGENTS.md`:
  - Content is data: edit `content/profile.ts` only.
  - Evidence over adjectives.
  - Never fabricate biographical facts.
  - Prefer less.

## Code inspected

- `components/sections/About.tsx`: renders `profile.bio` (string[]) as paragraphs under the "A bit about me" heading. No component change needed.
- `content/profile.ts`: current `bio` has 2 paragraphs, the second about Vertex, plus a TODO asking for your own words.
- `content/skills.ts`: TypeScript, JavaScript, React, Next.js, Tailwind CSS, Sanity, Clerk, Git, Vercel.
- `profile.intro` (hero, and the site meta description) also mentions Vertex. That's out of scope for this request; it's flagged in the report.

## Decisions & assumptions

- Use only facts already in the repo: role, stack, and the kind of work (responsive pages, components, CMS/auth integration). No years of experience, location, employers or degrees are invented.
- Two short paragraphs, about 45 words total.
- The "open to roles" line is an assumption based on the portfolio's purpose. Remove it if it's not true.

### New `bio` (owner's own wording, supplied at approval — replaces the draft)

One paragraph:

"I'm a frontend developer specializing in Next.js, TypeScript, and Tailwind CSS. I build fast, type-safe, and responsive web applications with a strong focus on clean architecture and pixel-perfect UI. I enjoy working across the stack when needed, optimizing performance, and crafting interfaces that feel intuitive and polished."

The old TODO is removed, since this is the owner's own text.

## Files to touch

- `content/profile.ts` (`bio` only; replace the old TODO with `// TODO: confirm wording.`)

## Security considerations

- None. Static text.

## Acceptance criteria

- About section shows the two paragraphs above.
- The About section no longer mentions Vertex.
- Layout is unchanged at 360 / 768 / 1440 px.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Manual test steps

1. `npm run dev`, open http://localhost:3000/#about.
2. Read the two paragraphs and confirm the wording is accurate for you.
3. Resize to 360px: text wraps, no horizontal scroll.
