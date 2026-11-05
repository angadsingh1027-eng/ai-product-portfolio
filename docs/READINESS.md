# Phase 1 readiness report

Checked on branch `feat/phase1-ship` (stacked on PR 4), 6 November 2026, against the definition of done in `CLAUDE.md`.

## Passed
| Check | Result |
| --- | --- |
| `npm test` | 67 tests pass (11 files) |
| `npm run content:validate` | Pass |
| `npx tsc --noEmit` | Clean |
| `npm run build` | Pass |
| Per-route title and description | Set on Home, Projects, both case pages, Builds, Career Journey, Recognition and Connect |
| Layout at 375px and 1280px | No horizontal page overflow on any of 9 routes at either width; the nav scrolls sideways on purpose |
| Console errors | None, apart from the expected 404s from deliberately requesting a missing page and a snapshot address |
| Heading order | No skipped levels on any page (fixed in this PR: list pages now use h2 under the page title) |
| Landmarks, language, link names | main, nav, header and footer on every page; `lang="en"`; no empty links; external links carry `noreferrer` |
| Keyboard | Tab moves focus through the nav with a visible 2px ring; reduced-motion rule present |
| Scale test | With 10 extra sample cases, Projects lists all 13 and Home keeps its fixed slots; samples removed |
| Withheld figures | No real JPMorganChase figure in content; the card and Journey role are covered by tests; the card issuer is not named anywhere |
| Sitemap | `public/sitemap.xml` and a `Sitemap:` line in `robots.txt`; a test keeps the sitemap in step with the pages |

## Not done
- **Lighthouse score (95 or higher):** not run, because Lighthouse is not available in this environment. Run it once on the published site.
- **Skip-to-content link:** none. Keyboard users tab through six nav links on each page. Small, optional.
- **LinkedIn Post Inspector:** needs the published address and your LinkedIn sign-in.
- **404 pages** carry the Home title and description.

## Needs the owner (hidden until supplied)
Lesson lines (Zeta, Nexus, HashedIn); JPMorganChase problem, call and result wording; Ace Award and certification issuers; roles sought, public resume PDF and booking link; GitHub address confirmation; approval of the drafted principles and HashedIn brief.

## Assumption to confirm
`site.url` and the sitemap use `https://angadsingh.lovable.app`. If you add a custom domain, change `url` in `content/site.json` and the host in `public/sitemap.xml` and `public/robots.txt`; the sitemap test will fail until they match.
