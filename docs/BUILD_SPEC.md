> **Amended 2026-11-05.** Read the Amendments section at the end first: the content format (sections 2 and 3), the synced branch (`lovable-sync`, not `main`) and the stack (TanStack Start) changed after the Lovable project was created.

# Build spec: Angad Singh AI PM portfolio

## 1. Goal
Public portfolio plus a password-gated depth layer. Content is data, not code: Angad can replace or add content files later without touching components. Hosting: Lovable (free `lovable.app` URL for now; target name `angadsingh.lovable.app`, confirmed at publish), code in GitHub.

## 2. Architecture

```
content/                 PUBLIC data (bundled into the site)
  site.json              name, headline, current role, links, photo path, SEO defaults
  timeline.json          roles and education
  proof.json             awards, recognition, certifications
  builds.json            live builds and GitHub projects
  writing.json           curated posts (empty at v1; includes LinkedIn link)
  cases/<slug>.md        one file per case: frontmatter + markdown body
content-private/         GATED data (never imported by src/; gitignored here, kept in its own private repo)
  cases/<slug>.private.md   decisions, evals, failures, what I'd change
  experience/<key>.private.md   role accomplishments too sensitive for public (JPMorganChase)
scripts/
  schemas.ts             zod schemas for every content file
  validate-content.ts    fails the build on bad content
  sync-private.ts        uploads content-private to Supabase
supabase/
  functions/verify-password/   edge function (checks password, returns gated content)
src/                     components and pages only; no copy
```

Swapping content: edit or replace files in `/content`, commit, and Lovable redeploys from `main` (confirm in the Lovable UI whether a manual Publish click is needed). Gated content: edit `/content-private`, then run `npm run content:sync`.

## 3. Content model

**`content/cases/<slug>.md` frontmatter**
```yaml
slug: string            # url segment
title: string
org: string             # e.g. Zeta; client is never named
period: string
role: string
domain: string
summary: string         # one line for cards
order: number           # display order
brief:                  # the 5-line Leader Brief
  problem: string
  call: string          # the decision made
  result: string
  lesson: string        # "TODO:" allowed; UI hides empty
kpis: [{label, value, how}]
proof: [{type: video|link|pdf|repo, label, url, priority}]   # priority 1 = shown first
tags: [string]
hasPrivateDepth: boolean
```
Body sections (markdown `##` headings): Context, Users and pain points, Solution, What I owned.

**`content-private/cases/<slug>.private.md`**: same `slug`; sections: Decisions and trade-offs, Evals, Failure modes, What I would change.

**`content-private/experience/<key>.private.md`**: frontmatter `slug` (the gate key, for example `experience-jpmorgan`), `company`, `title`, `period`; one section, Accomplishments. A `timeline.json` role links to it with `hasPrivateDepth: true` and `privateKey`. The public site shows only the role line for that company.

All other files are JSON validated by `scripts/schemas.ts`. Unknown fields are an error.

## 4. Pages and routes
| Route | Visibility | Source |
|---|---|---|
| `/` | Public | site.json, top cases (by `order`), top proof |
| `/work` and `/work/:slug` | Public | cases/*.md |
| `/work/:slug` depth block | Gated | Supabase, after password |
| `/journey` role accomplishments (JPMorganChase) | Gated | Supabase, after password |
| `/builds` | Public | builds.json |
| `/writing` | Public | writing.json |
| `/journey` | Public | timeline.json |
| `/proof` | Public | proof.json |
| `/contact` | Public | site.json |

Home order: positioning line, current-role line, StatStrip (4 numbers pulled from case KPIs flagged `featured`), 2 CaseCards, the top-priority video, links.

## 5. Gating flow
1. `GatedSection` renders a locked state with a password field.
2. On submit it calls the `verify-password` edge function with the password and the content key (a case slug, or an experience key such as `experience-jpmorgan`). One correct password unlocks every gated block for the session.
3. The function (in your own Supabase project, deployed with the Supabase CLI) compares a salted hash (stored as an edge-function secret, never in the repo or client) in constant time (the hash is Argon2 or bcrypt, and the password is a long passphrase), rate-limits by IP, and on success returns that slug's private content from Supabase.
4. The client keeps the result in memory (and `sessionStorage` wrapped in try/catch) so a refresh asks again or restores for the session.
5. RLS on the gated table denies all direct reads; only the function (service role) reads it.

## 6. SEO and sharing
The app renders in the browser, so set per-route `<title>` and meta description, add Open Graph and Twitter tags (with the photo) in `index.html`, and check the LinkedIn link preview before sharing widely. Add a sitemap.

## 6b. Lovable facts that shape the workflow (from Lovable docs, Nov 2026; re-verify)
- Git sync can only create a NEW repo from a Lovable project; it cannot attach to an existing repo. Workaround: zip the code and use Lovable's "Upload code", then set up Git sync (check this is available on the free plan).
- Lovable syncs one branch (`main`). Do your work on feature branches and merge to `main`.
- Pushing or merging to GitHub does NOT publish. The live site changes only when you click Publish in Lovable.
- With Lovable Cloud, edge functions are deployed by asking Lovable in chat, and secrets may not work locally. With your OWN Supabase project you manage the backend yourself.

## 6c. Decoupling rule (frontend vs backend)
- The frontend is a static app. It talks to the gated backend only through one documented API: `POST {VITE_GATE_API_URL}/verify-password` with `{ slug, password }` (`slug` is any private content key), returning `{ content }` or 401. Nothing else about the backend may leak into `src/`.
- Backend = your own Supabase project (free tier), managed with the Supabase CLI from this repo (`supabase/` folder): table, RLS, edge function, secrets. Lovable only publishes the frontend.
- Local dev uses a mock of the same API (`scripts/mock-gate.ts`), so the site runs without the backend.
- Only public values go in `.env` for the frontend (`VITE_GATE_API_URL`, `VITE_SUPABASE_ANON_KEY` if needed). The service-role key and the password hash live only in Supabase secrets and your local shell.

## 7. Phases (decided: Path B; the gate moved into v1 on 2026-11-05, see `docs/DECISIONS.md` ADR-008)
Three independent layers, each changeable by its own commits: `content/` (data), `src/` (frontend), `supabase/` (backend). No layer imports another's internals.

**v1: public site plus gated depth**
1. Create the project in Lovable with the prompt in section 8 and connect GitHub (this creates the repo).
2. Clone the repo locally and add this pack (`CLAUDE.md`, `docs/`, `content/`, `content-private/`).
3. In Claude Code: schemas, validation, content loaders, components (including `GatedSection`), public pages from the seed content, and the mock gate for local dev. `features.gatedDepth` is `true` in `content/site.json`.
4. Own Supabase project: gated table, RLS and `verify-password` edge function, deployed with the Supabase CLI; then `content:sync`.
5. Gate test in a private window: with no password, the JPMorganChase accomplishments appear nowhere in page source or network responses. Nothing sensitive is synced or published before this passes.
6. Polish: responsive pass, SEO, link-preview test. Merge to `main`, click Publish in Lovable.

**v2 (later, optional):** per-person access codes with revoke and a view log, if the confidential material raises the stakes; case-study private depth as it is drafted (set `hasPrivateDepth: true` per case).

**Ongoing change loop:** branch, edit content or code in Claude Code, merge to `main`, click Publish in Lovable.

## 8. First Lovable prompt
"Create a clean, white, minimal personal portfolio for an AI Product Manager using React, TypeScript and Tailwind. Pages: Home, Work (with a case-study detail page), Builds, Writing, Journey, Proof, Contact. Do not hardcode any copy: load all text from JSON and markdown files in a /content folder using Vite's import.meta.glob. Use one accent colour as a Tailwind token and a serif headline font. Case pages start with a 5-line Leader Brief and a Proof row of links, then the body. Include a locked 'Depth' block on case pages and on Journey role entries that shows a password field and, on submit, calls a URL read from the VITE_GATE_API_URL environment variable (use a placeholder; do not build the backend). Mobile-first."

## 9. Acceptance criteria
- Changing a metric in a case file changes it everywhere it appears, with no code edit.
- Adding a new `cases/<slug>.md` creates a card and a page with no code edit.
- With no password, the gated content cannot be found in the page source or network responses.
- `npm run content:validate` fails on a missing required field.
- The client issuer name appears nowhere in the repo.
- The JPMorganChase accomplishments (`experience-jpmorgan`) appear nowhere in the public bundle, page source or network responses until the correct password is entered.
- `content-private/` is gitignored in the site repo, kept in its own private repo, and never pasted into Lovable chat (ADR-009).

## 10. Amendments (2026-11-05)
- **Content format (replaces the case format in sections 2 and 3):** `content/work/<slug>.json` plus `<slug>.md`; `journey.json` replaces `timeline.json`; see `CLAUDE.md` and ADR-011. Private text is not in this repo (ADR-009).
- **Branch:** the Lovable-synced branch is `lovable-sync`. Feature branch, pull request, merge, then Publish in Lovable.
- **Stack:** Lovable generated TanStack Start (server-rendered, Cloudflare), not a browser-only Vite app (ADR-012).
- **Gate:** contract unchanged. The client is `src/components/DepthGate.tsx`; `scripts/mock-gate.mjs` replaces `mock-gate.ts` for local development. The backend phase (Supabase table, RLS, edge function, `content:sync`) is still to build.
- **Validation:** `npm run content:validate` runs `src/test/content.test.ts`.
