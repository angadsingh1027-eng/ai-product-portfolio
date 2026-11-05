<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All user-facing copy lives in `/content` (JSON + markdown) loaded via `import.meta.glob` in `src/lib/content.ts`; never hardcode copy in components. Why: owner edits content without touching code.
- Case studies are `content/work/<slug>.json` (meta, 5-line brief, KPIs, proof) paired with `<slug>.md` (body with four `##` sections). Why: structured fields without a frontmatter parser. KPIs flagged `featured` feed the home and Proof numbers; never repeat a metric elsewhere.
- No invented facts. Unconfirmed facts are written as `TODO:` in the content file; the loader hides any item that contains one. Schemas live in `src/lib/content-schema.ts`; `npm run content:validate` must pass.
- Client anonymity: never name the card issuer behind the Zeta work; write "a card issuer". The employer Zeta may be named.
- Depth gates POST `{slug, password}` to `{VITE_GATE_API_URL}/verify-password` and render the returned `content` (markdown). One password unlocks every gate for the tab session. The backend (own Supabase project) lives outside this repo.
- Gated text never lives in this repo. `content-private/` is gitignored and kept in its own private repo; never commit it, import it from `src/`, or paste it into chat. The public JPMorganChase entry shows only the role line.
- Work on a feature branch and open a pull request into `lovable-sync`. Merging does not publish; the owner clicks Publish in Lovable.
- Full rules: `CLAUDE.md` and `docs/DECISIONS.md`.
