# Implementation prompt: Complete the Vertex project (live link, screenshots, year and role)

## Goal

Finish the Vertex entry so it shows real proof: the live demo link `https://vertex-iota-ashy.vercel.app/`, real screenshots captured from that deployment, and the project's year and role. After this, the home hero, the Selected Work card and the case study all display actual imagery instead of the typographic fallback.

## Skills read

- `AGENTS.md`:
  - Content is data: adding the project's media means editing `content/projects.ts` plus assets in `public/`.
  - `next/image` always.
  - Never fabricate; images load, are sized and don't shift the layout.
- `.claude/skills/build-awwwards-quality-sites` §2:
  - Honest assets with provenance kept in source.
  - Deliberate aspect ratios, alt text and loading behaviour.
  - No copied mockups. Vertex's own design reference PNGs are **not** used; only real screenshots of the running app.

## Code inspected

- `content/projects.ts`:
  - Vertex has `links.source` only, `images: []`, and TODOs for the demo URL, year, role and screenshots.
- `types/index.ts`: `Image` = `{ src, alt, width, height }`.
- `components/sections/Hero.tsx`:
  - Showcase = first featured project with images, using `images[0]`, `loading="eager"` and `fetchPriority="high"`.
  - The intro column widens to `md:col-span-7` when there is no showcase, and goes back to `col-span-5` automatically.
- `components/sections/ProjectCard.tsx` / `ProjectMedia.tsx`: uses `images[0]` and shows a "Live" badge and a "Live demo" link when `links.demo` is set.
- `app/projects/[slug]/page.tsx`: `images[0]` is the cover; the rest become the "Screens" gallery (2 columns on md+).
- Existing pipeline from the first build: sharp converts to WebP at 1440 px wide, q74. `next.config.ts` has `images.unoptimized`.
- Live site probe (1440×900, headless Chrome, public pages only):
  - `/`: hero "Search your learning in plain English." with a search box and course cards (the card images lazy-load, so capture must wait for them).
  - `/courses/next-js-for-production`: course hero, meta and progress bar.
  - `/lessons/app-router-file-conventions`: module sidebar, lesson header and video embed.
  - `/search?q=…`: public page. `POST /api/search` is rate-limited, not auth-gated, and runs the AI search, so it uses the owner's model credits.
  - A theme toggle in the nav switches light and dark.
  - `/my-learning` requires sign-in, so it isn't captured.
- `~/vertex` git history:
  - First commit 2026-09-02, last 2026-09-06, 32 commits.
  - 31 by AyoubObeidi, 1 by `coderabbitai[bot]` (automated review).

## Decisions & assumptions

1. **Screens to capture:** 5, all 16:10, in this order.
   1. **Home** (light): the product pitch with the search box. Becomes the cover, hero showcase and card image.
   2. **Search results** for one query (`caching`): the signature feature, with video-moment cards. Wait up to 60s for results.
   3. **Lesson page** (`/lessons/app-router-file-conventions`): sidebar with modules and the video embed.
   4. **Course page** (`/courses/next-js-for-production`).
   5. **Home in dark theme** (click the nav theme toggle): shows the light/dark theme claim.
   - If search errors or is rate-limited, retry once after 60s. If it still fails, drop that screen and report it; never mock it.
2. **Capture settings:**
   - Viewport 1440×900 at `deviceScaleFactor: 2` for crisp text.
   - Wait for `networkidle2`, then scroll through the page to trigger lazy images, return to the top, and wait 2s.
   - Convert with sharp to WebP 1600×1000, q78, into `public/images/projects/vertex/{home,search,lesson,course,home-dark}.webp`.
   - Raw PNGs stay in the scratchpad.
   - Nothing in the Vertex app is modified; only its public pages are read.
   - Only one search query is run.
3. **Content edits** (`content/projects.ts` only):
   - `links.demo: "https://vertex-iota-ashy.vercel.app/"`.
   - `year: "2026"` (from git history).
   - `role: "Solo project"` (from git authorship; the only other author is a review bot). `TODO: confirm`.
   - `images`: the 5 screens with descriptive alt text. Width 1600 and height 1000 match the files, so there's no layout shift.
   - Provenance comment: "Screenshots captured from the live deployment on 2026-09-14."
   - Summary, highlights and stack are unchanged, since the screenshots confirm them.
4. **No component changes.** Hero, card and case study already handle images, the demo link and the Live badge. With two images or more, the case-study gallery shows screens 2–5 in a 2×2 grid.
5. **Performance:** the hero cover becomes the LCP image on desktop. The file is expected to be ≤ about 80 KB. If Lighthouse mobile Performance drops below 90, reduce WebP quality or width before changing anything else.

## Files to touch

- **Modify:** `content/projects.ts`.
- **Create:** `public/images/projects/vertex/home.webp`, `search.webp`, `lesson.webp`, `course.webp`, `home-dark.webp`.
- **Scratchpad only:** capture script and raw PNGs.

## Requirements

- Every image is a real capture of `vertex-iota-ashy.vercel.app`, with no edits beyond resizing and compression.
- The Vertex card shows the home screenshot, the "Live" badge, and "Live demo", "Source" and "Case study" links.
- The home hero shows the Vertex screenshot with the caption and Live badge.
- The case study shows the cover, a 2×2 "Screens" gallery and a "Live demo" button.
- No `TODO` left for the Vertex demo, year or screenshots. The role TODO is marked "confirm".

## Security considerations

- Only public pages are visited. There is no sign-in and no credentials.
- One AI search request is made; it's rate-limited and consumes a small amount of the owner's model credits.
- Screenshots contain only seeded course content and no personal data. The logged-out nav shows "Sign in/Sign up" and no user avatar.

## Acceptance criteria

- `npx tsc --noEmit`, `npm run lint` and `npm run build` show zero errors.
- Puppeteer: no horizontal overflow at 360, 768 and 1440 on `/`, `/projects` and `/projects/vertex`; all 5 images load (`naturalWidth > 0`); CLS is 0.
- Visual check of the home, `/projects` and case-study screenshots.
- Lighthouse mobile: Performance ≥ 90 and Accessibility ≥ 95 on `/`, `/projects` and `/projects/vertex`.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Plus the existing puppeteer layout and trail scripts, and Lighthouse on the local gzip server.

## Verification results

- **Captured and in use:** 4 screens (`home` 33 KB, `lesson` 54 KB, `course` 58 KB, `home-dark` 31 KB), all 1600×1000 WebP.
- **Search screen dropped:** both attempts on `/search?q=caching` (60s apart) showed the app's own "Search is unavailable right now." message. The search screenshot was left out, and a TODO in `content/projects.ts` notes it. That makes 2 search requests in total.
- **Build:** `tsc`, `lint` and `build` show zero errors.
- **Pages and images:**
  - `/`, `/projects` and `/projects/vertex` at 360, 768 and 1440 show no overflow, all images have `naturalWidth > 0`, and CLS is 0.
  - The case study meta reads "2026 · Solo project".
  - The Live demo link is present on each page.
  - The hero shows the Vertex home screenshot.
  - The case study shows the cover plus 3 screens (lesson, course, dark home).
- **Lighthouse mobile:** `/` 95/100/96/100, `/projects` 93/100/96/100, `/projects/vertex` 93/100/96/100.

## Manual test steps

1. `npm run dev` and open http://localhost:3000.
2. The hero's right side shows the Vertex home screenshot with a "Live" badge. Click it to open the case study.
3. Under Selected work, the Vertex card shows the screenshot, and "Live demo" opens https://vertex-iota-ashy.vercel.app/ in a new tab.
4. On `/projects/vertex`, check the meta line "2026 · Solo project", the Live demo and Source buttons, the cover image, and the 2×2 Screens gallery (search, lesson, course, dark home).
5. At 360px wide, the images scale down with no sideways scroll.
