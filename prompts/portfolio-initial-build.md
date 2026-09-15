# Implementation prompt: Portfolio initial build

## Goal

Turn the fresh `create-next-app` scaffold into a complete, static, mobile-first portfolio for Ayoub Obeidi. A recruiter should be able to tell in under 30 seconds what Ayoub builds, see proof, and reach him. Build every route in AGENTS.md §4. Use only real content taken from Ayoub's own repositories. Anything unknown gets a clearly marked `TODO` and is never invented.

## Skills read

- `AGENTS.md`: product brief, structure, stack rules, checks.
- `.claude/skills/build-awwwards-quality-sites`: art direction, honest assets, hero, GSAP choreography, one smooth-scroll engine, Three.js only with a purpose, reduced motion, validation.
- `.claude/skills/animation-systems`: motion tokens, choreography, performance, reduced-motion policy.
- `.claude/skills/animation-on-scroll`: reveal-once trigger at about 20% visibility. Its IntersectionObserver snippet is **not** used, because GSAP ScrollTrigger covers the same job and the skill system says to use one motion library.
- Next.js 16 docs in `node_modules/next/dist/docs/`: `static-exports.md`, `upgrading/version-16.md` (async `params`, `data-scroll-behavior`), `opengraph-image.md`, `sitemap.md`, `robots.md`, `generate-static-params.md`, `fonts`, `images`.

## Code inspected

- `package.json`: next 16.3.5, react 19.2.8, Tailwind v4 (`@tailwindcss/postcss`), ESLint 9 flat config. No other dependencies.
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`: untouched template. Tailwind v4 tokens live in `@theme` inside `globals.css`, and there is no `tailwind.config.ts`.
- `next.config.ts`: empty. `tsconfig.json`: `strict: true`, `@/*` alias.
- `public/`: template SVGs only. There is no CV, no photo and no project images.
- Real project sources on this machine:
  - `~/Theft-Detection/README.md`: AI anti-theft CV system, live demo `https://theft-detection-dusky.vercel.app/`, remote `github.com/AyoubObeidi/Theft-Detection`, screenshots in `docs/` (`dashboard.png`, `cameras.png`, `faces.png`, `history.png`, `settings.png`).
  - `~/vertex/CLAUDE.md` + `web/package.json`: learning platform with courses in Sanity and natural-language search that deep-links to the exact second in a lesson video. Stack: Next.js 16, Clerk, Sanity, Vercel AI SDK, PostHog, Tailwind v4. Remote `github.com/AyoubObeidi/vertex-learning-platform`. Deployed to Vercel, but the public URL is unknown.
  - `~/react-ecommerce`, `~/react-router-demo`, `~/redux-with-react`, `~/react-2026`: Vite template READMEs only, so there is not enough evidence to present them. Not included.

## Art direction

- **Visual thesis: "Evidence first."** A dark, editorial "build log". Real screenshots of shipped work are the imagery. The typography is large and confident, and small monospace metadata (year, stack, status) reads like a changelog. No gradient blobs, no glass, no bento grid.
- **Hero focal asset:** a real Theft Detection dashboard screenshot in a quiet frame, sitting beside the name, the role and a one-line proof statement. It shows actual work rather than decoration.
- **Type:** `Bricolage Grotesque` (variable; display and body) + `Geist Mono` (labels and metadata), both through `next/font/google`, which self-hosts them at build time. Scale: display clamps about 44px on mobile to 112px on desktop.
- **Color (single committed dark look, no toggle):** ink `#0E0F0C` background, raised surface `#171915`, bone text `#ECEBE4`, muted `#9A9A90`, hairline `#2A2C27`, one accent signal-lime `#C8F560`, used only for CTAs, focus rings and the "live" status. Contrast is checked so body text stays ≥ 7:1 and muted text ≥ 4.5:1.
- **Section sequence (home):** Header, Hero, Selected Work, Skills, About, Contact, Footer.
- **Motion narrative:** the hero intro plays once (headline words rise with a 60ms stagger, then the proof line, CTAs and the screenshot, about 1.2s total). Section headings reveal word by word when they are about 20% in view, and it plays once. Cards fade and rise 16px. Hover and focus use CSS only (lift of 4px, border becomes the accent).
- **Smooth-scroll engine:** **Lenis**, chosen over Locomotive Scroll because it is smaller, maintained, and plugs straight into ScrollTrigger. Only Lenis gets installed.
- **Three.js: not used.** No spatial or shader idea helps this story, and it would hurt the Lighthouse ≥ 90 mobile target.
- **Asset provenance:** project screenshots come from Ayoub's own `Theft-Detection/docs/`, are converted to WebP, and have their source noted in a comment in `content/projects.ts`. There are no stock images, no generated people and no drawn illustrations. Icons are Solar via Iconify (`@iconify-json/solar`), and GitHub and LinkedIn marks come from `@iconify-json/logos`. Icons are rendered to inline SVG **on the server**, so they add no client JS or runtime fetch. No avatar is shown until Ayoub provides a real photo.

## Decisions & assumptions

1. **Tailwind v4:** design tokens go in `@theme` in `app/globals.css`, not in `tailwind.config.ts`. That file does not exist in v4 and the repo already uses `@theme`, and AGENTS.md §7 says to follow the existing pattern.
2. **Static export:** `output: "export"` plus `images: { unoptimized: true }`, because default image optimization is unsupported in export. Images are pre-sized WebP with explicit `width`/`height` so the layout doesn't shift. `sitemap.ts`/`robots.ts` export `dynamic = "force-static"`.
3. **Site URL:** `NEXT_PUBLIC_SITE_URL` env var, falling back to `http://localhost:3000` with a `TODO`. It is used for `metadataBase`, sitemap and robots.
4. **Motion gating without hiding content:** a tiny inline script in `<head>` adds `motion-ok` to `<html>` only when JS runs **and** `prefers-reduced-motion` is not `reduce`. CSS hides reveal targets only under `.motion-ok`, so no-JS and reduced-motion users see everything immediately. `<html>` gets `suppressHydrationWarning` for this one attribute.
5. **Client boundaries (leaf only):** `SmoothScroll` (Lenis + ScrollTrigger wiring, cleanup on unmount), `RevealText` (word split with an unsplit `aria-label`, and split spans set to `aria-hidden`), `Reveal` (fade/rise wrapper), `HeroIntro` (GSAP timeline), `MobileNav` (disclosure menu). Everything else stays a Server Component.
6. **Contact reachable everywhere:** sticky header with a persistent "Email me" button (visible on mobile too) plus a nav anchor to `#contact`.
7. **Conditional rendering for missing assets:** CV button, LinkedIn link, About photo and project demo/image render only when the data exists. Projects without a screenshot show a typographic fallback panel (title + stack in mono), which is not an illustration.
8. **Case study pages:** `/projects/[slug]` with `generateStaticParams`, `dynamicParams = false`, async `params` (Next 16), and per-page `generateMetadata`.

## Content (real facts only)

- `content/profile.ts`: name `Ayoub Obeidi`. email `ayoubmacos05@gmail.com` (the git account email; `TODO: confirm this is the public contact email`). GitHub `https://github.com/AyoubObeidi`. `role: "TODO"`, `bio: "TODO"`, `location: "TODO"`, `linkedin: undefined // TODO`, `cvUrl: undefined // TODO add public/cv.pdf`, `photo: undefined // TODO`. The hero headline uses a neutral fallback built from real work ("I build full-stack web apps and computer-vision systems.") and is marked `TODO: confirm wording`.
- `content/projects.ts`:
  - **Theft Detection**: real-time retail anti-theft system. Multi-camera YOLOv8 pose and object detection, loitering and zone-intrusion alerts, face recognition blacklist/VIP, Telegram and email alerts, Next.js control-room dashboard. Stack: Python, FastAPI, OpenCV, YOLOv8, face_recognition, SQLite, Next.js, Tailwind CSS, Recharts. Demo and source links, screenshots from `docs/`. `year: "TODO"`, `role: "TODO"`.
  - **Vertex**: learning platform where authors create courses in Sanity. Natural-language search returns ranked cards that jump to the exact second in a lesson video. Stack: Next.js 16, TypeScript, Sanity, Clerk, Vercel AI SDK, PostHog, Tailwind CSS. Source link, `demo: undefined // TODO live URL`, no image (`TODO screenshot`).
  - `TODO: add 1–4 more projects (AGENTS.md requires 3–6).`
- `content/skills.ts`: grouped only from the stacks above and marked `TODO: confirm`. Languages: TypeScript, JavaScript, Python. Frontend: React, Next.js, Tailwind CSS, Recharts. Backend & data: FastAPI, SQLite, Sanity, Clerk. AI & computer vision: OpenCV, YOLOv8, face_recognition, Vercel AI SDK. Tooling: Git, Vercel, PostHog.

## Files to touch

- **Modify:** `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `package.json` (via npm install).
- **Delete:** `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (unused template assets).
- **Create:**
  - `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/not-found.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`
  - `components/ui/`: `Button.tsx`, `ButtonLink.tsx` if needed, `Tag.tsx`, `TextLink.tsx`, `Icon.tsx`, `Container.tsx`, `SectionHeading.tsx`, `Reveal.tsx`, `RevealText.tsx`
  - `components/sections/`: `SiteHeader.tsx`, `MobileNav.tsx`, `Hero.tsx`, `HeroIntro.tsx`, `ProjectGrid.tsx`, `ProjectCard.tsx`, `ProjectMedia.tsx`, `Skills.tsx`, `About.tsx`, `Contact.tsx`, `SiteFooter.tsx`
  - `components/SmoothScroll.tsx`
  - `content/profile.ts`, `content/projects.ts`, `content/skills.ts`
  - `lib/utils.ts` (`cn`, `siteUrl`), `lib/motion.ts` (motion tokens: durations, eases, offsets, stagger)
  - `types/index.ts` (`Profile`, `Project`, `ProjectImage`, `SkillGroup`, `SocialLink`)
  - `public/images/projects/theft-detection/*.webp` (converted with sharp from `~/Theft-Detection/docs/`)
- **Dependencies:** `gsap`, `lenis`, `clsx`, `tailwind-merge`, `@iconify/utils`, `@iconify-json/solar`, `@iconify-json/logos`.

## Requirements

- Name + role + primary CTAs visible at 360×640 without scrolling.
- Adding a project means editing only `content/projects.ts`, and the home, index, case study, sitemap and OG image all pick it up.
- Featured projects on home (`featured: true`) and all projects on `/projects`.
- Each project card: title, one-line summary, stack tags, demo/source/case-study links (`target="_blank" rel="noopener noreferrer"` for external), screenshot or fallback.
- Case study: summary, highlights list, stack, links, image gallery, a "Next project" link and a back link.
- Skills as grouped plain lists, with no ratings or bars.
- Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`), a skip-to-content link, one `h1` per page.
- Visible `:focus-visible` ring (2px accent + offset) on every interactive element.
- Motion: GSAP + ScrollTrigger + Lenis wired through `gsap.ticker`, with `ScrollTrigger.refresh()` after fonts load. `lagSmoothing(0)`. All timelines, triggers and Lenis are destroyed on unmount. Under reduced motion there is no Lenis, no GSAP and final states show immediately. Only `transform`/`opacity` are animated, and the blur from the scroll skill is dropped for performance.
- Anchor links work with Lenis (`lenis.scrollTo`) and without it (native scroll). `scroll-margin-top` accounts for the sticky header.
- No `any`, no `!` assertions, no barrel files, no `@apply`, no bare `<img>`, no `href="#"`.
- Per-page `title` (template `%s · Ayoub Obeidi`) and `description`. OG image generated with `ImageResponse` (name, role, accent rule).

## Security considerations

- Static site with no API routes, forms, env secrets or third-party runtime scripts.
- External links use `rel="noopener noreferrer"`.
- Email shown as a `mailto:` link. It is public by design, and scraping is accepted as the cost of zero friction. Flagged for confirmation.
- Inline `<head>` script is a static constant string with no user input.
- Only screenshots are copied from `Theft-Detection/docs/`. Nothing from `.env`, `alerts/`, `uploads/` or `analyzed/`.
- **Found during inspection (not changed by this task):** the `Theft-Detection` git remote URL has a GitHub personal access token embedded in it. It should be revoked and the remote reset. Reported to the owner, and the token is not repeated anywhere.

## Acceptance criteria

- `npx tsc --noEmit`: 0 errors. `npm run lint`: 0 errors. `npm run build`: succeeds and produces `out/` with `index.html`, `projects/index.html`, `projects/theft-detection/index.html`, `projects/vertex/index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `opengraph-image`.
- No horizontal scroll at 360, 768 and 1440px.
- Content fully visible with JS disabled and with reduced motion on.
- Console clean in dev (no hydration or key warnings).
- Every `TODO` in `content/` is listed in the final report.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Plus: serve `out/` and smoke-check routes with an HTTP request; grep the source for `any`, `href="#"`, `<img`, and `TODO`.

## Changes made during implementation

- **Hero intro uses CSS keyframes instead of a GSAP timeline.** With GSAP, the headline stayed hidden until JS hydrated, and Lighthouse mobile measured LCP at 6.3s (Performance 77). With a CSS `intro-rise` keyframe that starts on first paint, LCP is 1.7s (Performance 100). GSAP still drives the scroll reveals and Lenis. `HeroIntro.tsx` was removed. `RevealText` takes `trigger="load"` (CSS) or `"scroll"` (GSAP). The `/projects` and case-study titles also use `load`.
- Used the sharper `Theft-Detection/docs/shots/*.png` (3200×2000), exported as 1440×900 WebP. Dropped `video-analysis` because that screen is mostly empty.
- Added `turbopack.root` to `next.config.ts` because a stray `~/package-lock.json` was being treated as the workspace root.
- Removed the gallery `figcaption`s because they repeated the image alt text (Lighthouse `image-redundant-alt`).
- Known Next.js 16.3.5 bug on **Windows builds only**: segment prefetch files are written as nested folders (`__next.projects/$d$slug/__PAGE__.txt`), but the client requests dotted names. Prefetch then 404s once and navigation falls back to working normally. Linux builds (Vercel, Netlify, CI) are unaffected. Cause: `convertSegmentPathToStaticExportFilename` only replaces `/`, not `\`.

## Verification results

- `tsc`, `lint` and `build` all pass with zero errors.
- Puppeteer at 360, 768 and 1440 on all 5 routes shows no horizontal overflow. Nothing is left hidden with reduced motion or with JS disabled. The tab order is sensible. Anchor scrolling moves focus to the section. The mobile menu closes on Esc and returns focus to the toggle.
- Lighthouse mobile, local gzip server: `/` 100/100/96/100, `/projects` 94/100/96/100, case study 94/100/96/100 (Performance/Accessibility/Best practices/SEO). Best practices is 96 only because of the Windows prefetch 404 above.

## Manual test steps

1. `npm run dev`, then open http://localhost:3000.
2. At 360px width (DevTools device toolbar), confirm name, role and "Email me" are visible without scrolling, and that there is no horizontal scroll. Repeat at 768 and 1440.
3. Reload and watch the hero intro play once. Scroll and confirm the headings reveal word by word, only once.
4. Enable DevTools > Rendering > "Emulate prefers-reduced-motion: reduce" and reload. Everything appears instantly and scrolling is native.
5. Disable JavaScript and reload. All content is visible.
6. Press Tab from the top: the skip link comes first, then the nav and every link, each with a visible lime focus ring.
7. Click "Work" in the nav to smooth-scroll to the section, which is not hidden under the header. Open the mobile menu at 360px, navigate, and press Esc to close it.
8. Open a Theft Detection card and check that the "Live demo" link opens in a new tab and the case-study page loads with its title in the tab.
9. Visit `/does-not-exist` to see the custom 404 page with a link home.
10. `npm run build`, then `npx serve out` and repeat step 2 on the static build. Run Lighthouse (mobile) and target Performance ≥ 90 and Accessibility ≥ 95.
