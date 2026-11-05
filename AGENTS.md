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
- Case studies are `content/work/<slug>.json` (fields, 5-line brief, KPIs, chips, proof) paired with `<slug>.md` for `full` cases (body with four `##` sections); `snapshot` cases have no body. Why: structured fields without a frontmatter parser. KPIs flagged `featured` feed the home numbers; never repeat a metric elsewhere. Allowed values live in `content/taxonomy.json`.
- No invented facts. Unconfirmed facts are written as `TODO:` in the content file; the loader hides any item that contains one. Schemas live in `src/lib/content-schema.ts`; `npm run content:validate` must pass.
- Client anonymity: never name the card issuer behind the Zeta work; write "a card issuer". The employer Zeta may be named.
- Nothing is gated: no password, backend or private folder (ADR-014). JPMorganChase figures appear only as masked values (X%, Y×, Z%); the real figures stay in the owner's shared resume (ADR-015).
- Work on a feature branch and open a pull request into `lovable-sync`. Merging does not publish; the owner clicks Publish in Lovable.
- Full rules: `CLAUDE.md` and `docs/DECISIONS.md`.
