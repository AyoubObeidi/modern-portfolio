# Implementation prompt: Remove "Copy email", lime hover on nav and footer links

## Goal

1. Remove the **Copy email** button from Contact.
2. Header nav links, mobile menu links and footer links stay muted grey at rest. On hover they turn the lime of the **Email me** button (`--color-accent` #c8f560).

## Skills read

- `AGENTS.md`:
  - Change one thing at a time.
  - Tailwind tokens.
  - No dead code left behind.
  - Checks in §6.
- `prompts/contact-email-whatsapp-link-color.md`: the previous change this one adjusts.

## Code inspected

- `components/sections/Contact.tsx`: renders `<CopyButton>` with `copy` / `check` icons.
- `components/ui/CopyButton.tsx`: the only user of `buttonClasses` outside `ButtonLink.tsx`, and the only user of the `copy` / `check` icons.
- `components/ui/ButtonLink.tsx`: `buttonClasses` is exported only for CopyButton.
- `components/sections/SiteHeader.tsx`: nav `<ul>` is `text-muted` and links use `hover:text-bone`.
- `components/sections/MobileNav.tsx`: links are `text-bone` with no hover color.
- `components/sections/SiteFooter.tsx`: links are `text-accent hover:text-accent-hover`, set by the last change.

## Decisions & assumptions

- **Delete** `components/ui/CopyButton.tsx`.
- Remove the `copy` / `check` icon registrations.
- Un-export `buttonClasses` (keep it as an internal helper in `ButtonLink.tsx`).
- **Header nav**: `hover:text-bone` becomes `hover:text-accent`.
- **Footer links**: back to muted at rest (inherited `text-muted`) with `hover:text-accent`. This matches the request "when I hover the color changes".
- **Mobile menu links**: add `transition-colors hover:text-accent` for consistency. On touch devices hover rarely applies, so there's no visual change there.
- Unchanged: text links in content (Case study, Live demo, Source, All projects, Contact email) stay lime. Gmail compose and the WhatsApp TODO stay as they are.

## Files to touch

- `components/sections/Contact.tsx`
- `components/ui/CopyButton.tsx` (delete)
- `components/ui/Icon.tsx`
- `components/ui/ButtonLink.tsx`
- `components/sections/SiteHeader.tsx`
- `components/sections/MobileNav.tsx`
- `components/sections/SiteFooter.tsx`

## Security considerations

- None new. External footer links keep `rel="noopener noreferrer"`.

## Acceptance criteria

- No "Copy email" button anywhere, and no leftover imports or files.
- Header nav and footer links are grey and turn lime on hover.
- Keyboard focus ring still visible.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Manual test steps

1. `npm run dev`, open http://localhost:3000.
2. Contact section: only Email me, GitHub (and WhatsApp once set).
3. Hover Work / Skills / About / Contact in the header. Each turns lime.
4. Hover Email / GitHub in the footer. Grey at rest, lime on hover.
5. Tab through header and footer: focus ring visible.
