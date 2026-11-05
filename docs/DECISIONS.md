# Decision log

Newest changes first in the "Change history" table; full records below. Status values: Accepted, Proposed (needs owner confirmation), Superseded.

## Change history

| Date | Decision | Change |
|---|---|---|
| 2026-11-06 | ADR-014 | Nothing is gated; the gate code is removed. Supersedes ADR-003, 004, 008 and 009. |
| 2026-11-06 | ADR-015 | JPMorganChase figures appear as masked values (X%, Y×, Z%). |
| 2026-11-06 | ADR-016 to 018 | Work lineup, content model v2, US spelling. |
| 2026-11-05 | ADR-008 | Gated depth moves from v2 into the MVP, to protect JPMorganChase accomplishments. Supersedes ADR-002. |
| 2026-11-05 | ADR-009 | Accepted: `content-private/` is gitignored in the site repo and kept in its own private repo. |
| 2026-11-05 | ADR-010 | Profile facts: resume wins for recent roles; LinkedIn wins for titles. |
| 2026-11-05 | ADR-001 to 007 | Initial architecture decisions recorded. |

## ADR-001: Content lives in files, not code
- **Status:** Accepted
- **Decision:** All copy is JSON and markdown in `content/`; components only render it.
- **Gains:** one edit updates every place a metric appears; git history; no database for public content.
- **Costs:** no visual editor; every change is edit, commit, merge, Publish.
- **Revisit if:** writing posts become frequent; move only `writing.json` to a CMS.

## ADR-002: v1 is public only; gated depth in v2
- **Status:** Superseded by ADR-008 (2026-11-05)
- **Original rationale:** ship sooner, nothing sensitive deployed, private content not yet drafted.

## ADR-003: Gate model is one shared password
- **Status:** Superseded by ADR-014 (2026-11-06)
- **Decision:** One salted hash, one edge function, no accounts.
- **Gains:** simplest backend; no friction for readers.
- **Costs:** the password can be forwarded; one person cannot be revoked; no view analytics.
- **Revisit if:** the gated content becomes more sensitive (see ADR-008), or you need to know who read what. Then move to per-person codes with expiry and a view log.

## ADR-004: Backend lives in your own Supabase project
- **Status:** Superseded by ADR-014 (2026-11-06)
- **Decision:** Table, RLS, edge function and secrets are managed with the Supabase CLI from `supabase/`; Lovable publishes only the frontend.
- **Gains:** portable backend; secrets stay out of Lovable; frontend depends on one URL.
- **Costs:** a second system to manage; free tier may pause idle projects (verify current limits).

## ADR-005: Lovable creates the project first, then we extend it locally
- **Status:** Accepted
- **Decision:** Path B. Lovable's Git sync can only create a new repo, so the project starts in Lovable.
- **Costs:** two tools; only `main` syncs; merging does not publish, so click Publish in Lovable.

## ADR-006: One Open Graph card for link previews
- **Status:** Accepted
- **Decision:** A single tested card in `index.html`; per-route titles still set for tabs and search.
- **Costs:** every shared link previews as the home page. Routes come from `content/`, so a prerender step can be added later.

## ADR-007: Contact is links only
- **Status:** Accepted
- **Decision:** `/contact` shows email, LinkedIn and calendar links from `site.json`. No form.

## ADR-008: Gated depth moves into the MVP to protect JPMorganChase accomplishments
- **Status:** Superseded by ADR-014 and ADR-015 (2026-11-06)
- **Context:** The resume lists JPMorganChase accomplishments with internal metrics. The earlier rule was to show only the role line. (The metrics themselves are deliberately not repeated here; this file ships with the repo.)
- **Decision:**
  1. The public site still shows only the JPMorganChase role line.
  2. The accomplishments live in `content-private/experience/jpmorgan.private.md` (gate key `experience-jpmorgan`) and appear on `/journey` only after the password.
  3. The gate (Supabase table, RLS, `verify-password` edge function, `content:sync`, mock gate) is built in v1. `features.gatedDepth` is `true`.
  4. The gate API takes any private content key, not only case slugs. One correct password unlocks every gated block for the session.
  5. Nothing sensitive is synced or published until the private-window gate test passes.
- **Gains:** the strongest recent accomplishments reach recruiters without being public.
- **Costs:** v1 now needs the backend, so launch is later than a public-only site; more to test.
- **Risks:**
  - A shared password can be forwarded, and it is a weaker control than access for named people. Check the content against your JPMorganChase policy on sharing internal metrics, even behind a password.
  - Anything in the Lovable-synced repo is visible to Lovable's tools; see ADR-009.
- **Revisit if:** you want to revoke one recipient or see who read what (per-person codes with expiry), or your employer objects.

## ADR-009: `content-private/` stays out of the site repo and Lovable
- **Status:** Superseded by ADR-014 (2026-11-06)
- **Context:** The spec kept `content-private/` in the same repo as the site, and Lovable reads that repo. A public repo or Lovable's tools would expose the gated text.
- **Decision:**
  1. `content-private/` is listed in the site repo's `.gitignore`, so the site's GitHub repo and Lovable never hold it. Add the ignore rule before the first commit; a file already committed stays in history.
  2. It is versioned in its own separate private repo, for history and backup.
  3. It reaches Supabase only through `npm run content:sync`, run from the laptop.
  4. Real private text is never pasted into Lovable chat.
- **Gains:** the gated text is out of reach of Lovable and of any mistake with the site repo's visibility; history and backup are kept.
- **Costs:** one extra private repo to set up; private edits happen only where that repo is cloned.
- **Not covered:** the machine you work on, including Claude Code sessions, can still read the folder; Supabase holds the text behind the gate.
- **Gate hardening that goes with this:** Argon2 or bcrypt hash, long passphrase, rate limiting, `no-store` responses, session-only memory, `noindex` on gated pages, password rotation between job-search waves.
- **Revisit if:** the content becomes more sensitive than the resume, you want to revoke one recipient, or your employer objects (see ADR-003, ADR-008).

## ADR-010: Which source wins when profile facts conflict
- **Status:** Accepted (owner decision, 2026-11-05)
- **Decisions:**
  - Recent roles and accomplishments: the Turing resume (v3) is authoritative.
  - Job titles: LinkedIn wins (VP, Product Manager at JPMorganChase; Senior Product Manager at HashedIn).
  - Osmo scale: 100K+ devices and $26M+ revenue (resume), not "K12 students".
  - Accenture: Product Manager on a B2B procurement analytics platform for Fortune 500 clients (resume), not Technology Consulting Analyst.
  - HashedIn: the agent ROI metrics (about 10% ineligible volume, 3 intents driving 76% of deflection, 1.9x lift) are added to the timeline.
  - Zeta: LLM-as-a-judge automating about 20% of evaluations is added to the case.
- **Not on the site:** the resume phone number.

## Open items (as of 2026-11-05; see the backlog for the current list)

- Ace Award issuer and year, and the issuer of the Agentic AI Product Management certification (LinkedIn lists it three times).
- Confirm the GitHub URL in `site.json`; it appears in none of the source PDFs.

## Amendments after the Lovable project was created (2026-11-05)

### ADR-011: Content follows Lovable's file format
- **Status:** Accepted (owner decision)
- **Decision:** A case study is `content/work/<slug>.json` (metadata) plus `<slug>.md` (body). No frontmatter parser. Our richer fields (KPIs, `featured`, tags, role, domain, `hasPrivateDepth`) live in the JSON. The Leader Brief is up to 5 lines (Problem, Call, Role, Result, Lesson); a line containing `TODO:` is hidden. `featuredStats` was removed: home and Proof numbers come from KPIs flagged `featured`, so a metric is edited once. Journey replaces timeline.json and includes education.
- **Gains:** the same loader Lovable generated, so Lovable's tools and its build keep working; no extra parser to break the Cloudflare build.
- **Costs:** two files per case; the spec's frontmatter format is superseded.
- **Validation:** zod schemas in `src/lib/content-schema.ts`, run by `npm run content:validate` (a vitest file). It is not yet part of `npm run build`; adding it would make a content typo block Publish.

### ADR-012: The app is server-rendered (TanStack Start on Cloudflare)
- **Status:** Observed
- **Effect on ADR-006:** per-page titles and meta tags are rendered on the server, so link previews can differ per page. Still to do: an absolute `og:image` once the final address is known, and a LinkedIn preview test after the first publish.

### ADR-013: Branch workflow
- **Status:** Accepted
- **Decision:** the synced branch is `lovable-sync` (not `main`). Work on a feature branch, open a pull request into `lovable-sync`, merge with a merge commit, then click Publish in Lovable. Never rewrite pushed history.

### Public wording changes
- "a US card issuer" became "a card issuer": none of the source documents states the country.
- Contact page text no longer promises a reply time (that line was Lovable placeholder copy).

### Amendments to earlier records
- ADR-005 and the change history: read "main" as `lovable-sync`.
- The gate API contract (ADR-004, ADR-008) is unchanged: `POST {VITE_GATE_API_URL}/verify-password` with `{ slug, password }`.

## Decisions after the content review (2026-11-06)

### ADR-014: Nothing is gated; there is no backend
- **Status:** Accepted (owner decision)
- **Decision:** The site has no password, gate, backend or private folder. The gate code (`DepthGate`, the mock gate, the gate URL setting and gate wording) was removed in PR 1; git history keeps it. A test fails if gate code or wording returns.
- **Supersedes:** ADR-003 (shared password), ADR-004 (Supabase backend), ADR-008 (gate in v1), ADR-009 (private content stays out of git).
- **Gains:** no backend to build, host or secure; one consistent public site; nothing to leak.
- **Costs:** real confidential figures cannot appear on the site; they stay in the owner's shared resume (ADR-015).
- **Revisit if:** the owner decides to publish real figures behind access control.

### ADR-015: JPMorganChase figures appear as masked values
- **Status:** Accepted (owner decision)
- **Decision:** The work can be described in public. Withheld figures show as masked values (X%, Y×, Z%) with no footnote, and specific metric names. A masked KPI or chip holds no digits (enforced by schema tests). Masked values appear only on the JPMorganChase card, never in the Home impact strip or on the Recognition page. No toolstack names appear; model names may.
- **Gains:** the card keeps the same anatomy as the others and shows that results were measured.
- **Costs:** masked values can read as placeholders and are less convincing than real numbers.

### ADR-016: Work lineup, Nexus placement and scope
- **Status:** Accepted (owner decision)
- **Decision:** Work shows Zeta (voice, full case), then JPMorganChase (agentic ways of working, snapshot) and HashedIn (agent ROI, snapshot). Nexus Fleet Intelligence is a build with its own case-study page, linked from Builds (`placement: builds`). Osmo and Accenture stay in Journey only. Writing, the Journey themes chronology and a visual redesign are outside Phase 1.

### ADR-017: Content model v2
- **Status:** Accepted
- **Decision:** Cases gain `tagline`, `status`, `depth` (full or snapshot), `placement`, `featured` and up to three `chips`; KPIs gain `scope`, `masked` and `featuredOrder`; builds gain `kind`, `status` and `caseStudy`. Allowed values live in `content/taxonomy.json`. Length limits (title 60, tagline 110, chip 24, KPI value 18, summary 280) are enforced by tests. Highlight and site-settings schemas arrive with their pages in PR 3 and PR 4.

### ADR-018: US spelling
- **Status:** Accepted (owner decision)
- **Decision:** All copy uses US spelling. A clean-up of existing content lands in PR 4.

