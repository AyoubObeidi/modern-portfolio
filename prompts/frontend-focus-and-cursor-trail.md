# Implementation prompt: Front-end positioning, remove Theft Detection, shader cursor trail

## Goal

1. Present Ayoub as a **front-end developer** only. Remove every "full-stack" and "computer vision" claim from copy, skills and metadata.
2. **Remove the Theft Detection project** completely: its content, images, and any hero or showcase use.
3. Add the **shader cursor trail** exactly as defined by the owner's `shader-cursor-trail` skill: a white twinkling halftone trail (ChromaFlow → DotGrid mask → CursorRipples → FilmGrain) built with the `shaders` package on WebGPU, with the skill's fallbacks and gates.

## Skills read

- `AGENTS.md`: content is data, never invent facts, prefer less, Lighthouse ≥ 90 / ≥ 95.
- `.claude/skills/shader-cursor-trail/SKILL (5).md`: the workflow. Progressive enhancement; install `shaders`; exact six-node graph; lightweight gate separate from the heavy shader module; one full-bleed `aria-hidden` layer behind section content; gates for WebGPU, fine hover pointer, motion, transparency, visibility, focus and intersection; unmount offscreen; no WebGL or Three.js; no hotlinks.
- The skill's implementation contract (the file delivered as `verify-cursor-trail (1).mjs` actually contains `references/implementation.md`): exact node props and order, layering tree, gate list, CSS fallbacks, blend-mode guidance, common failures.
- The skill's verifier (delivered as `CursorTrailGate (1).tsx`, actually `scripts/verify-cursor-trail.mjs`): the exact string patterns the Graph, Gate and CSS files must contain.
- `cursor-trail (1).css` is the skill's agent YAML metadata, not CSS. The `assets/react/` templates were **not** included, so the three files are written from the contract and verifier above.
- `.claude/skills/build-awwwards-quality-sites` and `animation-systems`: pointer effects additive, reduced motion, no offscreen GPU work.

## Code inspected

- `content/profile.ts`: role "Full-stack developer", headline and intro mention computer vision and YOLOv8, bio mentions Python.
- `content/projects.ts`: Theft Detection (featured, 4 images) and Vertex (no images).
- `content/skills.ts`: Python, FastAPI, SQLite, OpenCV, YOLOv8, face_recognition, Recharts (Recharts came from Theft Detection only).
- `components/sections/Hero.tsx`: showcase = first featured project with images. None remain after removal, so the hero becomes type-only.
- `components/sections/About.tsx`: title "Interfaces backed by real systems".
- `components/sections/Contact.tsx`: near-black closing section, a second natural host for the trail.
- `app/globals.css`: `.motion-ok` reveal rules. The static background is `bg-ink` on `html` and `body`.
- `public/images/projects/theft-detection/*.webp`: 4 files.
- **`shaders@3.2.470`** (unpacked in the scratchpad for inspection only; only public `.d.ts` typings and README were read):
  - `Shader` props include `disableTelemetry`, `onUnavailable(reason)`, `className` and `style`.
  - `DotGrid`, `ChromaFlow`, `LinearGradient`, `CursorRipples` and `FilmGrain` all accept `id`, `visible`, `maskSource`, `opacity` and `blendMode`.
  - Map driver shape: `{ type: "map", source, channel, inputMin, inputMax, outputMin, outputMax }`.
  - `LinearGradient` props are `colorA`, `colorB`, `start`, `end` and `colorSpace` (`"hsl"` supported).
  - Its only dependency is `typegpu`.
- **`shaders` license (Shader Effects License v1.5):** free for personal, non-commercial and evaluation use. **"Any public-facing deployment" requires an active Pro or Team license.** It also forbids removing attribution and reverse engineering. A deployed portfolio is public-facing.
- Headless Chrome on this machine exposes WebGPU on `localhost` (AMD adapter), so visual verification is possible.
- Vertex evidence (`~/vertex/prompts/*`, git log): design system built from a reference sheet; catalog, course, lesson and search pages matched to desktop designs and made responsive; search results with video-moment cards; Clerk sign-in, learner progress, My Learning page, dark-mode toggle.
- `~/vertex/.agents/design/*.png` are design reference mockups, not app screenshots, so they are not used.

## Decisions & assumptions

### Content (unchanged from the previous draft of this prompt)

- `role`: "Front-end developer".
- `headline`: "I build interfaces for the web with React and Next.js." (`TODO: confirm wording`)
- `intro`: "Most recently Vertex — a learning platform whose search opens a lesson video at the exact second a topic is taught."
- `bio` (`TODO: replace with your own words`):
  1. "I'm a front-end developer working mainly in TypeScript, React and Next.js, styled with Tailwind CSS."
  2. "On Vertex I built the design system and turned desktop designs into responsive pages (catalog, course, lesson and search) wired to content in Sanity."
- About title: "A bit about me".
- Vertex highlights, front-end only:
  - Design system as Tailwind v4 tokens and reusable React components.
  - Catalog, course, lesson and search pages matched to desktop designs and adapted to mobile.
  - Search results with video-moment cards that open the lesson at the matched second.
  - Clerk sign-in, learner progress and My Learning pages, plus a light/dark theme.
  - Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, Sanity, Clerk, PostHog.
  - The back-end pipeline and agentic search highlights are removed.
- `skills.ts`:
  - Languages: TypeScript, JavaScript.
  - Front end: React, Next.js, Tailwind CSS.
  - Content, auth & analytics: Sanity, Clerk, PostHog.
  - Tooling: Git, Vercel.
  - `TODO: confirm and add HTML/CSS, Redux, React Router, Vite… if you use them`.
- Keep "add 2–5 more projects" as a TODO, and flag it.

### Removal

- Delete the Theft Detection entry and `public/images/projects/theft-detection/`.
- The hero keeps its generic "showcase if a project has images" logic. With no showcase, the intro and CTAs column widens to `md:col-span-7`.

### Cursor trail: where

- **Home hero and Contact section**, the skill's two named use cases ("hero/contact background"). Each is a separate `cursor-trail-region` with its own gate. The gate mounts only when its section is near the viewport and unmounts when it leaves, so at most one shader canvas runs at a time (they're far apart on the page). The projects index and case studies stay plain, which keeps attention on the work.

### Cursor trail: exact graph (`components/ui/CursorTrailShader.tsx`, client)

```tsx
<Shader disableTelemetry className="cursor-trail-canvas">
  <DotGrid id="trailDots" density={40} twinkle={0.9} visible={false}
    dotSize={{ type: "map", source: "trailFlow", channel: "alpha", inputMin: 0, inputMax: 1, outputMin: 0, outputMax: 1 }} />
  <ChromaFlow id="trailFlow" intensity={1.4} radius={2.9} visible={false} />
  <LinearGradient colorA="#1e1e1f" colorB="#070708" colorSpace="hsl" start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} />
  <LinearGradient colorA="#000000" colorB="#ffffff" colorSpace="hsl" start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} maskSource="trailDots" />
  <CursorRipples />
  <FilmGrain strength={0.1} />
</Shader>
```

- All props are static literals. `onUnavailable` notifies the gate so it unmounts for good and the static background remains.

### Cursor trail: gate (`components/ui/CursorTrailGate.tsx`, client, lightweight)

- `const CursorTrailShader = lazy(() => import("./CursorTrailShader"))`, so the shader chunk is requested **only** after every check passes:
  - `(navigator as Navigator & { gpu?: unknown }).gpu` exists.
  - `(hover: hover) and (pointer: fine)` matches.
  - `prefers-reduced-motion: reduce` does not match.
  - `prefers-reduced-transparency: reduce` does not match.
  - `document.visibilityState === "visible"` and `document.hasFocus()`.
  - `IntersectionObserver` (`rootMargin: "200px"`) reports the host section near the viewport.
- Listens to `change` on all three media queries, `visibilitychange`, `blur` and `focus`. Any failing condition unmounts the shader, which is the pause mechanism.
- Cleanup: `visibilityObserver?.disconnect()` and every listener removed.
- Renders `<div className="cursor-trail-layer" aria-hidden="true">` with `<Suspense fallback={null}>`.

### Cursor trail: CSS (`components/ui/cursor-trail.css`, imported by the gate)

- The skill's verifier requires a CSS file. It holds only the layer rules below: no `@apply` and no Tailwind component classes.
- `.cursor-trail-region { position: relative; isolation: isolate; overflow: hidden; }`
- `.cursor-trail-layer { position: absolute; inset: 0; z-index: 0; }`, with a soft top and bottom `mask-image` fade (presentation only) so the graph's `#1e1e1f→#070708` gradient blends into the site's `ink` background with no seam.
- `.cursor-trail-content { position: relative; z-index: 1; }`
- The layer is hidden (`display: none`) under `@media (prefers-reduced-motion: reduce)`, `(prefers-reduced-transparency: reduce)`, `(hover: none), (pointer: coarse)` and `@media (forced-colors: active)`, in addition to the JS gates.
- **Blend mode: normal.** Both sections are near-black and standalone, so per the contract the graph's dark gradient becomes the section background. Text contrast stays ≥ 4.5:1 for muted text (`#a3a399` on `#1e1e1f` ≈ 5.9:1).

### Cursor trail: pointer events

- Per the skill, **no** `pointer-events: none` on the canvas until tracking is verified.
- During implementation I'll test in WebGPU headless Chrome whether the trail responds when the cursor is over the content layer (text and links above the canvas).
  - **If tracking is global:** nothing else is needed, and the content stays fully interactive.
  - **If tracking is canvas-local:** set `.cursor-trail-content { pointer-events: none }` and `.cursor-trail-content :is(a, button, [tabindex]) { pointer-events: auto }`, so the empty space and plain text pass the pointer to the canvas while links and buttons stay clickable. Trade-off: text in these two sections can't be mouse-selected. The result will be reported.

### Static fallback

- The sections keep `bg-ink` and all server-rendered content. With JS off, no WebGPU, touch, reduced motion, reduced transparency or forced colors, the page looks exactly as it does today.

## Files to touch

- **Modify:** `content/profile.ts`, `content/projects.ts`, `content/skills.ts`, `components/sections/Hero.tsx`, `components/sections/Contact.tsx`, `components/sections/About.tsx`, `package.json` (via npm).
- **Create:** `components/ui/CursorTrailGate.tsx`, `components/ui/CursorTrailShader.tsx`, `components/ui/cursor-trail.css`.
- **Delete:** `public/images/projects/theft-detection/`.
- **Dependency:** `shaders@3.2.470` (exact version pinned).

## Requirements

- No text anywhere (source, `out/`, OG image, metadata) containing "full-stack", "computer vision", "YOLO", "Theft", "OpenCV", "FastAPI" or "Python".
- Only `/projects/vertex` is generated. `/projects/theft-detection` returns the 404 page.
- The six nodes appear in exact order with exact props and both ID links. The skill's verifier passes.
- The shader chunk is not requested under touch, reduced motion or without WebGPU.
- No requests to `previews.shaders.com` or `data.shaders.com`. Telemetry is disabled.
- Links, buttons and keyboard focus in the hero and contact sections still work.
- TypeScript strict, no `any` and no `!` in project code.

## Security & licensing considerations

- **License: the owner needs a Shaders Pro or Team license before deploying publicly.** Local development and evaluation are allowed on the free tier. This will be flagged in the final report.
- `disableTelemetry` is set. I'll confirm with a network log that no runtime requests go to shaders.com domains.
- No user input reaches the shader. The layer is `aria-hidden`.

## Acceptance criteria

- `npx tsc --noEmit`, `npm run lint` and `npm run build` have zero errors.
- `node ".claude/skills/shader-cursor-trail/verify-cursor-trail (1).mjs"` can't be used because that file is the markdown contract. Instead, the verifier logic from `CursorTrailGate (1).tsx` is run against the three new files and prints "verified".
- **WebGPU headless Chrome** at 1440: after scripted mouse moves in the hero there is a visible halftone trail in a screenshot, one canvas, no console errors, and no shaders.com requests.
- **Touch or reduced-motion emulation:** no canvas and no shader chunk request.
- Scrolling the hero out of view removes its canvas.
- Puppeteer at 360, 768 and 1440 shows no horizontal overflow, and nothing is left hidden with no JS.
- Lighthouse mobile: Performance ≥ 90 and Accessibility ≥ 95 on `/`, `/projects` and `/projects/vertex`.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
node <verifier> components/ui/CursorTrailShader.tsx components/ui/CursorTrailGate.tsx components/ui/cursor-trail.css
```

Plus the puppeteer checks above and Lighthouse on the local gzip server.

## Changes made during implementation

- **Pointer tracking is global:** the trail responds with the cursor over headline text, so no `pointer-events` changes were needed. Links still receive clicks (`elementFromPoint` on "See my work" resolves to the link).
- `cursor-trail.css` is imported in `app/layout.tsx` rather than the gate. As a home-only chunk, Next preloaded it during prefetch of `/` from other pages, which triggered Chrome's "preloaded but not used" warning.
- `.claude/**` is excluded in `eslint.config.mjs` and `tsconfig.json`. The skill files were delivered with swapped names (a markdown file named `.mjs`), which broke lint.
- The verifier was run from a scratchpad copy named `verify-cursor-trail.mjs`, because the skill file is misnamed `CursorTrailGate (1).tsx`.

## Verification results

- `tsc`, `lint` and `build` show zero errors. The skill verifier prints "Cursor trail graph, gates, fallbacks, and cleanup verified."
- **WebGPU headless Chrome** (AMD adapter) at 1440:
  - The halftone trail is visible in both the hero and Contact, including over text.
  - One canvas at a time: the hero canvas unmounts when scrolled away and Contact mounts near view.
  - No page errors, and zero requests outside `localhost` (no shaders.com).
- Touch (390px) and reduced motion: 0 canvases and no shader or TypeGPU script downloaded.
- 360, 768 and 1440 on all routes show no overflow. No-JS and reduced motion leave nothing hidden. Keyboard order is correct and the mobile menu passes.
- Lighthouse mobile: `/` 96/100/96/100, `/projects` 95/100/96/100, `/projects/vertex` 96/100/96/100.
- **Known costs:**
  - The shader chunk is 2.4 MB raw / ~700 KB gzipped. `shaders/react` is a barrel export with no per-component React entry points. It downloads only for eligible desktop WebGPU visitors, after the gate passes.
  - Chrome on Windows logs "The powerPreference option is currently ignored…" (crbug 369219127) when the library requests an adapter. This comes from the browser and is harmless.

## Manual test steps

1. `npm run dev` and open http://localhost:3000 in desktop Chrome or Edge (WebGPU).
2. The hero reads "Ayoub Obeidi — Front-end developer" and nothing mentions full-stack or computer vision.
3. Move the mouse across the hero: a white twinkling halftone trail with ripples and grain follows it.
4. Click "See my work" and the GitHub button while the trail is active. Both work.
5. Scroll to Contact: the trail works there too. The hero's canvas is gone (DevTools > Elements).
6. Switch tabs and come back: the trail resumes and no errors appear.
7. DevTools > Rendering > `prefers-reduced-motion: reduce`, then reload. No trail and a plain dark background.
8. Device toolbar (iPhone), then reload. No trail, and in Network there's no shader chunk.
9. Open the page in Firefox (WebGPU off by default): plain dark background, everything works.
10. Selected work and `/projects` show only Vertex, and `/projects/theft-detection` shows the 404 page.
