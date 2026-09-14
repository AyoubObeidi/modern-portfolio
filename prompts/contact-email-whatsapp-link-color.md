# Implementation prompt: Working "Email me", WhatsApp contact, lime text links

## Goal

1. Make **Email me** work on any visitor's machine, including ones with no default mail app.
2. Add **WhatsApp** as a contact option.
3. Give text links the same lime color as the primary button (`--color-accent` #c8f560).

## Owner decisions (question panel)

- Email: **Gmail compose + copy**. "Email me" opens Gmail's web compose in a new tab with the address filled in. A "Copy email" button sits next to it.
- WhatsApp: **leave a TODO**. The button is built but stays hidden until a number is added in `content/profile.ts`.
- Link color scope: **content + footer links**. The header nav and mobile menu stay muted.

## Skills read

- `AGENTS.md`:
  - Content is data.
  - Server Components by default; `"use client"` only on the leaf that needs it.
  - `components/ui/` stays generic.
  - Tailwind tokens, no arbitrary values, `cn()`.
  - No `href="#"`.
  - Checks in §6.
- `build-awwwards-quality-sites`: honest icon sourcing (Iconify packages already installed), visible focus, accessibility.

## Code inspected

- `components/sections/SiteHeader.tsx` and `Contact.tsx`: both "Email me" buttons use `ButtonLink href="mailto:ayoubmacos05@gmail.com"`.
- `out/index.html`: 4 correct `mailto:` hrefs.
- `components/SmoothScroll.tsx`:
  - The click interceptor returns early for other origins, so `mailto:` clicks are **not** blocked.
  - The failure is the OS: on Windows with no mail handler set, clicking `mailto:` does nothing.
- `components/ui/cursor-trail.css`: the trail layer sits at `z-index: 0` under the content, so it doesn't block clicks.
- `components/ui/ButtonLink.tsx`: primary/secondary variants and sm/md sizes. The class list is private to the file.
- `components/ui/TextLink.tsx`: `text-bone` with a `decoration-line` underline. Used by ProjectCard (Case study, Live demo, Source) and home "All projects".
- `components/sections/SiteFooter.tsx`: Email and social links, `text-muted hover:text-bone`.
- `app/projects/[slug]/page.tsx`: "Back to projects" link, `text-muted hover:text-bone`.
- `components/sections/MobileNav.tsx`: an existing client leaf that receives `<Icon>` as props so the Iconify JSON stays server-side. The copy button follows the same pattern.
- `components/ui/Icon.tsx` registry. Confirmed these exist: `logos:whatsapp-icon`, `solar:copy-linear`, `solar:check-circle-linear`.
- `types/index.ts` `Profile`, `content/profile.ts`.

## Decisions & assumptions

- **Email URL helper** in `lib/utils.ts`: `gmailComposeUrl(email)`, which returns `https://mail.google.com/mail/?view=cm&fs=1&to=<encoded email>`.
  - Used everywhere the site offers email: header button, Contact button, the large address in Contact, and the footer "Email" link. This keeps behavior consistent.
  - All open in a new tab with `rel="noopener noreferrer"` and sr-only "(opens Gmail in a new tab)".
  - Visitors who don't use Gmail get the copy button.
- **WhatsApp helper**: `whatsappUrl(number)` strips everything except digits and returns `https://wa.me/<digits>`. This is WhatsApp's official click-to-chat format.
- **Data**: `Profile.whatsapp?: string` (international format, e.g. `"+216 12 345 678"`). `content/profile.ts` gets `whatsapp: undefined` with a TODO. The number isn't invented.
- **WhatsApp placement**, only when `profile.whatsapp` is set:
  - Secondary `ButtonLink` in Contact, after Copy email.
  - "WhatsApp" link in the footer.
  - Not in the header, to keep it compact at 360px.
- **Copy button**: new `components/ui/CopyButton.tsx`, `"use client"`, generic.
  - Props: `value`, `label`, `copiedLabel`, `icon`, `copiedIcon`.
  - Uses `navigator.clipboard.writeText`. If that throws or is unavailable, it shows "Copy failed" rather than faking success.
  - Label swaps to "Copied" for 2 s.
  - An `aria-live="polite"` region announces the result.
  - It's a real `<button type="button">`.
- **Shared button styles**: export `buttonClasses({ variant, size, className })` from `ButtonLink.tsx`, so the copy button reuses the exact secondary-button styling instead of duplicating it.
- **Link color**, all using existing tokens with no new colors:
  - `TextLink`: `text-accent`, underline `decoration-accent/40`, hover `text-accent-hover` + `decoration-accent-hover`.
  - Contact large email: `text-accent`, hover `text-accent-hover`, keeps the accent underline.
  - Footer links: `text-accent hover:text-accent-hover`.
  - Case study "Back to projects": `text-accent hover:text-accent-hover`.
  - Unchanged: header nav, mobile menu, and project-title / "Next project" heading links (they already hover to accent).
- Contrast: #c8f560 on #0e0f0c is about 15:1, far above AA.

## Files to touch

- `types/index.ts`: add `whatsapp?: string` to `Profile`.
- `content/profile.ts`: add `whatsapp: undefined` + TODO.
- `lib/utils.ts`: `gmailComposeUrl`, `whatsappUrl`.
- `components/ui/Icon.tsx`: register `whatsapp`, `copy`, `check`.
- `components/ui/ButtonLink.tsx`: export `buttonClasses`.
- `components/ui/CopyButton.tsx`: new.
- `components/ui/TextLink.tsx`: accent colors.
- `components/sections/SiteHeader.tsx`: Email me goes to Gmail compose in a new tab.
- `components/sections/Contact.tsx`: Gmail compose, Copy email, WhatsApp, accent email link.
- `components/sections/SiteFooter.tsx`: Gmail compose, WhatsApp, accent links.
- `app/projects/[slug]/page.tsx`: accent "Back to projects".

## Requirements

- No `any`, no `!`. Strict TS passes.
- `CopyButton` is the only new client component. Pages and sections stay server components.
- No layout shift when the copy label changes: set `min-w` via a token-based width (`min-w-40`) so "Copied" and "Copy email" take the same width.
- Contact buttons wrap cleanly at 360px (existing `flex-wrap`).
- Focus ring visible on every new control (global `:focus-visible` applies).

## Security considerations

- Every external link opened in a new tab has `rel="noopener noreferrer"`.
- The email is URL-encoded in the Gmail URL, and the WhatsApp number is reduced to digits. No user input is involved.
- The clipboard is only written on an explicit user click. Nothing is read.
- Publishing a phone number exposes it to scrapers. The owner decides by filling in the TODO.

## Acceptance criteria

- Clicking **Email me** (header or Contact) opens Gmail compose in a new tab with `ayoubmacos05@gmail.com` in "To".
- **Copy email** copies the address, shows "Copied" for about 2 s, and screen readers announce it.
- With `whatsapp` unset, no WhatsApp UI renders and there are no broken links.
- With `whatsapp: "+216 12 345 678"` set temporarily, Contact and footer show WhatsApp linking to `https://wa.me/21612345678`.
- Project Case study / Live demo / Source, "All projects", the Contact email, the footer links and "Back to projects" render lime and hover lighter.
- Header nav remains muted.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Also grep `out/` for `mail.google.com` and confirm there's no leftover `mailto:`.

## Manual test steps

1. `npm run dev`, open http://localhost:3000.
2. Click **Email me** in the header. A Gmail compose tab opens with the address in "To".
3. Scroll to Contact. Click the large email and **Email me**, and check the same result.
4. Click **Copy email**. The label shows "Copied"; paste somewhere to confirm the address.
5. Check that link colors are lime: project links, "All projects", footer links, and "Back to projects" on `/projects/vertex`. Header nav should still be grey.
6. In `content/profile.ts` set `whatsapp: "+<your number>"`. The WhatsApp button appears in Contact and the footer and opens a chat with you. Keep it or revert.
7. Resize to 360px: no horizontal scroll, and Contact buttons wrap.
8. Tab through Contact: focus ring is visible on each button.
