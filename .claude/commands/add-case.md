---
description: Add a new case study from raw notes, following the content format
argument-hint: <path to notes file or pasted notes>
---

Add a new case study using $ARGUMENTS as the source.

1. Read `CLAUDE.md` (Content format and golden rules), `src/lib/content-schema.ts` and `content/taxonomy.json`.
2. Create `content/work/<slug>.json` with every required field. The slug is lowercase with hyphens and equals the file name. Respect the length limits and use only values from the taxonomy.
3. For a `full` case, also create `content/work/<slug>.md` with the four `##` sections (Context, Users and pain points, Solution, What I owned). A `snapshot` case has no body.
4. Use only facts present in the source. Where a fact is missing, write `TODO:` in the content file. Never invent a metric.
5. Never name a client whose name the user has not approved for publication. Withheld figures use masked values (X%, Y×), never real numbers.
6. Flag at most four KPIs across all cases as `featured`; check the existing ones first.
7. Run `npm run content:validate` and fix every error.
8. Report the new files and every `TODO:` that remains. Do not edit any component.
