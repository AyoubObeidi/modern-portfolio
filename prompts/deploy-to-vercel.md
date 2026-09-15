# Implementation prompt: Deploy the portfolio to Vercel

## Goal

Put the portfolio live on Vercel at a public `*.vercel.app` URL.

- Production deploys from `main` through Vercel's GitHub integration.
- Every push to `main` redeploys automatically.
- Absolute URLs (sitemap, robots, OG image, `metadataBase`) point at the real production domain instead of `http://localhost:3000`.

## Owner decisions (from the question panel)

- **Method:** GitHub integration. The owner imports `AyoubObeidi/modern-portfolio` in the Vercel dashboard. The CLI is not used for the deploy.
- **Branch:** fast-forward `main` to `feat/initial-portfolio` and push, so `main` is production.

## Skills read

- `AGENTS.md`:
  - The site must build to static output and stay host-agnostic.
  - Run the checks before reporting.
  - Flag remaining `TODO`s in content.
  - Change one thing at a time.
- `node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md` and `static-exports.md`:
  - A static export needs no server features.
  - Vercel's adapter uses the public adapter API.
- No UI skills are needed. There is no visual change.

## Code inspected

- `next.config.ts`:
  - `output: "export"` and `images.unoptimized: true`.
  - `turbopack.root: __dirname`.
  - Vercel's Next.js preset builds this with no extra config.
- `package.json`:
  - Next 16.3.5, React 19.2.8.
  - Scripts `build`/`lint` are the defaults Vercel runs.
- `lib/utils.ts`:
  - `siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`.
  - Has a TODO to set the domain before going live.
- `siteUrl` is used by:
  - `app/layout.tsx` (`metadataBase`)
  - `app/sitemap.ts`
  - `app/robots.ts`
  - The OG image URL resolution, through `metadataBase`.
  - All of these are evaluated at build time.
- `.gitignore`: already ignores `.vercel`, `.env*`, `/out/`, `/.next/`.
- No `vercel.json` exists, and none is needed.
- Git state:
  - Working tree is clean.
  - `feat/initial-portfolio` (34292bb) is pushed.
  - `origin/main` is at 2894fd8, a direct ancestor, so a fast-forward is possible.
- `gh` is authenticated as AyoubObeidi (scope `repo`).
- `npx vercel` works (CLI 59.17.0) but is not logged in. It isn't needed for this method.

## Decisions & assumptions

1. **Site URL without a manual env var.**
   - Vercel exposes the system env var `VERCEL_PROJECT_PRODUCTION_URL` at build time. It holds the production domain without a protocol, e.g. `modern-portfolio-xyz.vercel.app`, and becomes the custom domain once one is added.
   - Fallback order: `NEXT_PUBLIC_SITE_URL` (explicit override) → `https://${VERCEL_PROJECT_PRODUCTION_URL}` → `http://localhost:3000`.
   - This removes the "deploy, copy domain, set env var, redeploy" loop.
   - It stays host-agnostic: on other hosts, set `NEXT_PUBLIC_SITE_URL`.
   - The value is only read in server/build code (metadata, sitemap, robots), so the variable does not need the `NEXT_PUBLIC_` prefix.
   - Remove the TODO it resolves.
2. **No `vercel.json`.** The Next.js framework preset detects `output: "export"` and serves the `out/` result. Defaults are enough.
3. **Git.**
   - Commit the `lib/utils.ts` change and this prompt on `feat/initial-portfolio`, then push.
   - Then run `git checkout main`, `git merge --ff-only feat/initial-portfolio` and `git push origin main`.
   - No force-push and no history rewrite. If fast-forward fails, stop and report.
4. **The Vercel import is done by the owner** in the browser, because Git integration needs the Vercel GitHub App authorised on their account. I give exact steps and verify the live URL afterwards if the owner shares it.
5. **Content TODOs don't block the deploy.** Missing CV, LinkedIn, extra projects and photo are flagged in the report, not fixed here.

## Files expected to touch

- `lib/utils.ts`: the `siteUrl` fallback chain; remove the resolved TODO.
- `prompts/deploy-to-vercel.md`: this file, committed.

No component, content or config changes.

## Requirements

- `siteUrl` is always a valid absolute URL string with no trailing slash.
- No `any`, no `!`.
- The build still produces static output locally with no env vars set, falling back to localhost as before.

## Security considerations

- No secrets are added to the repo. `.env*` and `.vercel` stay git-ignored.
- `VERCEL_PROJECT_PRODUCTION_URL` is a public domain name, not a secret. It is safe to inline into sitemap and metadata.
- The Vercel GitHub App should be granted access to **only** the `modern-portfolio` repo, not all repositories.
- Publishing makes the profile content public: email, WhatsApp number and GitHub link. `content/profile.ts` still has `TODO: confirm this is the address you want public.` The owner should confirm before or right after going live.
- Fast-forward only on `main`, so no remote history is destroyed.

## Acceptance criteria

- `origin/main` points at the same commit as `origin/feat/initial-portfolio`.
- The Vercel project is linked to the repo with production branch `main`, and the first production deploy is **Ready**.
- The live site renders the home page, `/projects` and a project case study.
- `https://<domain>/sitemap.xml` and `/robots.txt` list the production domain, not localhost.
- The OG image URL in the page `<head>` is absolute on the production domain.

## Checks to run

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Then simulate Vercel's variable locally:

```powershell
$env:VERCEL_PROJECT_PRODUCTION_URL='example.vercel.app'; npm run build
```

After that build, confirm `out/sitemap.xml` and `out/robots.txt` contain `https://example.vercel.app`. Then rebuild without the variable to leave `out/` clean.

## Manual test steps (owner)

1. Go to https://vercel.com/new and sign in with GitHub.
2. Under **Import Git Repository**, pick `AyoubObeidi/modern-portfolio`. If it isn't listed, choose *Adjust GitHub App Permissions* and grant access to that repo only.
3. Leave the defaults: Framework **Next.js**, Root `./`, and the default build/output settings. No environment variables are needed. Click **Deploy**.
4. When it shows **Ready**, open the production URL.
5. Check that the home page, `/projects` and a case study render, and that the contact links work.
6. Open `<url>/sitemap.xml` and `<url>/robots.txt`. Both must show the vercel.app domain.
7. Paste the URL into https://www.opengraph.xyz to confirm the social card renders.
8. Open **Project → Settings → Git** and confirm the production branch is `main`.
9. Optional: add a custom domain under **Settings → Domains**, then redeploy so the sitemap picks it up.
