# Implementation prompt: Shader cursor trail across the entire website

## Goal

Replace the two per-section trails (home hero and Contact) with **one** shader cursor trail that runs behind every page and section: home, `/projects`, case studies and 404. Keep the skill's exact graph, gates and fallbacks.

## Skills read

- `AGENTS.md`: Server Components by default with client leaves only, clean console, Lighthouse ≥ 90 / ≥ 95, one change at a time.
- `.claude/skills/shader-cursor-trail` (SKILL, implementation contract, verifier):
  - Exact six-node graph.
  - One canvas and one engine.
  - Gates: WebGPU, fine hover pointer, reduced motion, reduced transparency, visibility, focus, intersection.
  - Unmount as the pause mechanism.
  - CSS fallbacks.
  - Never sacrifice text contrast.
  - Content stays above the layer.

## Code inspected

- `components/ui/CursorTrailGate.tsx`: observes `layerRef.current.parentElement` with `IntersectionObserver`, lazy-loads `CursorTrailShader` and renders `.cursor-trail-layer`.
- `components/ui/CursorTrailShader.tsx`: exact graph. It stays untouched.
- `components/ui/cursor-trail.css`: `.cursor-trail-region` is `relative`, `isolate` and `overflow: hidden`; the layer is `absolute`, `inset: 0`, with a top/bottom `mask-image` fade; content is `relative`, `z-index: 1`; accessibility media queries hide the layer. It's imported in `app/layout.tsx`.
- `components/sections/Hero.tsx` and `components/sections/Contact.tsx`: each has `cursor-trail-region`, its own `<CursorTrailGate />` and `Container className="cursor-trail-content"`.
- `app/layout.tsx`: `body` (`flex min-h-full flex-col bg-ink`) contains the skip link, `SiteHeader` (sticky, `z-40`, `bg-ink/95`), `main`, `SiteFooter` and `SmoothScroll`.
- Earlier WebGPU test (previous prompt): cursor tracking is **global**, so the trail follows the cursor over content that sits above the canvas.

## Decisions & assumptions

1. **One viewport-fixed layer, not a page-tall canvas.** An absolute full-bleed layer on the page would be as tall as the document (about 3–5k px). That wastes GPU memory and can exceed WebGPU's 8192 px texture limit. Instead, a single layer at `position: fixed; inset: 0` sits behind all content and always matches the viewport, so the trail is present everywhere you scroll.
   - The base `.cursor-trail-layer { position: absolute }` rule stays, so the section pattern and the skill verifier remain valid.
   - A modifier `.cursor-trail-region--viewport > .cursor-trail-layer { position: fixed }` switches it to viewport mode.
   - The layer's edge `mask-image` fade is removed, since a fixed layer has no section edges to blend.
2. **Placement:**
   - `<body>` gets `cursor-trail-region cursor-trail-region--viewport`.
   - `<CursorTrailGate />` sits right after the skip link.
   - `SiteHeader`, `main` and `SiteFooter` are wrapped in `<div className="cursor-trail-content flex flex-1 flex-col">`, so everything paints above the layer.
   - The sticky header keeps working because the wrapper is full-height and not a scroll container.
3. **No `overflow: hidden` on the region.** On `body` it would disable page scrolling. It isn't needed because a fixed layer can't overflow. Only the viewport modifier sets `overflow: visible`; the base section rule is unchanged.
4. **Gate unchanged.** It still observes its parent (now `body`, which is always intersecting). All other gates still unmount the shader: blur, hidden tab, preference changes, no WebGPU, coarse pointer. `layout.tsx` remains a Server Component, and the gate is the client leaf.
5. **Remove the per-section instances** from `Hero.tsx` and `Contact.tsx` (region class, gate and content class), so there's exactly one canvas site-wide.
6. **Look:** on eligible desktops, the graph's dark gradient (`#1e1e1f` → `#070708`) with film grain becomes the background of every page (normal blend). The static fallback everywhere else stays `bg-ink`. Text contrast: muted `#a3a399` on `#1e1e1f` is about 5.9:1 in the worst case, which passes AA. Header (`bg-ink/95`), cards and images sit above the trail as intended.

## Files to touch

- **Modify:** `app/layout.tsx`, `components/ui/cursor-trail.css`, `components/sections/Hero.tsx`, `components/sections/Contact.tsx`.
- **Unchanged:** `CursorTrailGate.tsx`, `CursorTrailShader.tsx`. No new dependencies.

## Requirements

- Exactly one `.cursor-trail-layer` and at most one canvas on every route.
- The trail responds anywhere on any page, at any scroll position, including over text, cards and the footer.
- Links, buttons, the mobile menu, the skip link, keyboard focus and Lenis anchor scrolling all still work. The header still sticks.
- No canvas and no shader or TypeGPU download on touch, reduced motion, or without WebGPU. Nothing is hidden with JS off.
- The skill verifier still passes.

## Security considerations

- No change: telemetry disabled, no external requests, layer is `aria-hidden`.
- The licensing caveat still applies: a Shaders Pro or Team license is needed before public deployment.

## Acceptance criteria

- `npx tsc --noEmit`, `npm run lint` and `npm run build` show zero errors, and the verifier prints "verified".
- WebGPU headless Chrome at 1440, on `/`, `/projects` and `/projects/vertex`: one canvas the size of the viewport (1440×900-ish), a visible trail in screenshots at the top, middle and bottom of the page, the header still sticky, and no page errors or external requests.
- Touch (390) and reduced motion: 0 canvases and no shader script.
- No horizontal overflow at 360, 768 and 1440 on all routes. Keyboard and mobile menu checks pass.
- Lighthouse mobile: Performance ≥ 90 and Accessibility ≥ 95 on the three routes.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
node <verifier> components/ui/CursorTrailShader.tsx components/ui/CursorTrailGate.tsx components/ui/cursor-trail.css
```

Plus puppeteer (trail and layout scripts) and Lighthouse on the local gzip server.

## Verification results

- `tsc`, `lint` and `build` show zero errors. The skill verifier prints "verified".
- WebGPU headless Chrome at 1440 on `/`, `/projects`, `/projects/vertex` and the 404 page:
  - 1 layer and 1 canvas, fixed at `0,0` and 1440×900, at the top, middle and bottom of each page.
  - The header stays stuck (`top: 0`) at every scroll position.
  - The trail is visible in screenshots at every position.
  - No page errors and 0 external requests.
- "See my work", the header Contact link and the Vertex card links all receive the pointer. Clicking the Vertex link navigates to the case study.
- Touch (390) and reduced motion: 0 canvases and no shader or TypeGPU script downloaded.
- No overflow at 360, 768 or 1440 on all routes. No-JS and reduced motion leave nothing hidden. Anchor scrolling moves focus. The mobile menu closes on Esc and returns focus.
- Lighthouse mobile: `/` 96/100/96/100, `/projects` 93/100/96/100, `/projects/vertex` 96/100/96/100.
- **Observed trade-off:** while the cursor passes over them, bright dots sit behind small or muted text (tags, list items, footer links) and momentarily reduce local contrast. Headings stay legible. The contract allows tuning layer `opacity` or blend if the owner wants a quieter trail.

## Manual test steps

1. `npm run dev` and open http://localhost:3000 in desktop Chrome or Edge.
2. Move the mouse in the hero, then scroll to Work, Skills, About, Contact and the footer. The trail follows everywhere.
3. Open `/projects` and a case study: the trail is there too.
4. Scroll: the header stays stuck, and nav anchors scroll smoothly.
5. DevTools > Elements: there's only one `canvas` in the page.
6. Switch tabs and come back: the trail resumes and the console has no errors.
7. Reduced motion (DevTools > Rendering) or the phone device toolbar, then reload: no trail, and the page looks unchanged.
