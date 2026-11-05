---
description: Add a new case study from raw notes, following the content format
argument-hint: <path to notes file or pasted notes>
---

Add a new case study using $ARGUMENTS as the source.

1. Read `CLAUDE.md` (Content format and golden rules) and `src/lib/content-schema.ts`.
2. Create `content/work/<slug>.json` with every required field, and `content/work/<slug>.md` with the four `##` sections (Context, Users and pain points, Solution, What I owned). The slug is lowercase with hyphens and equals the file name.
3. Use only facts present in the source. Where a fact is missing, write `TODO:` in the content file. Never invent a metric.
4. Never name a client whose name the user has not approved for publication.
5. Flag at most four KPIs across all cases as `featured`; check the existing ones first.
6. Do not create gated text in this repo. If the source has private depth, tell the user to add it to the separate private repo (`content-private/cases/<slug>.private.md`).
7. Run `npm run content:validate` and fix every error.
8. Report the new files and every `TODO:` that remains. Do not edit any component.
