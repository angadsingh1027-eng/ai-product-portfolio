# Foundation audit (PR 2, 2026-11-06)

An audit of the current look against the foundation requirements (DS-01 to DS-07). No redesign: the serif headings, the single orange accent and the white background stay. Changes are limited to two gaps that need no visual decision.

## Findings

| Requirement | Finding | Action |
| --- | --- | --- |
| DS-01 Type scale | Serif headings (Instrument Serif) and a sans body (Geist). The code uses nine sizes: `text-xs` 4, `text-sm` 41, `text-lg` 4, `text-xl` 5, `text-2xl` 12, `text-3xl` 3, `text-4xl` 3, `text-5xl` 2, `text-6xl` 1. The requirement is six. | No change now. Consolidating to six is a visual decision, so it is listed under the later visual review. New components use `xs`, `sm`, `lg`, `xl`, `2xl` and `3xl` only. |
| DS-02 Color | One accent and neutrals, defined once as `oklch` tokens. Every text and background pair in use meets WCAG AA (table below). | Added a test that fails if a token change breaks AA. |
| DS-03 Spacing and widths | Tailwind's default spacing scale. Pages sit in a `max-w-3xl` column. Prose width is capped by the column. | None. |
| DS-04 Breakpoints | Tailwind defaults (`sm` 640, `md` 768, `lg` 1024) rather than 375, 768 and 1280. Layouts are mobile-first and were checked at 375 and 1280 with no horizontal scroll. | None. The test pages are 375 and 1280 pixels wide. |
| DS-05 Focus | There was no global focus style. | Added a 2-pixel outline in the ring color on every `:focus-visible`. |
| DS-06 Motion | Motion comes only from `tw-animate-css` and a few hover color changes. | Added a `prefers-reduced-motion` rule that disables transitions and animations. |
| DS-07 Imagery | One portrait, now with `width` and `height` set on the Home photo. | None. |
| DS-08 Dark mode | Dark tokens exist in `.dark` but nothing uses them. | None; dark mode is a later item. |
| Arbitrary values | One in the app code: `-left-[29px]` on the Journey dot. | Replaced by `-left-7.25` in the new `TimelineEntry` component; the Journey page adopts it in PR 4. A test now blocks arbitrary values in components. |

## Contrast of the pairs in use (light theme, AA needs 4.5)

| Pair | Ratio |
| --- | --- |
| Text on background | 18.12 |
| Muted text on background | 5.52 |
| Muted text on muted surface | 5.13 |
| Accent text on background | 5.05 |
| Accent text on muted surface | 4.70 |
| Light text on accent fill | 4.91 |
| Light text on destructive fill | 4.63 |

The accent on the muted surface (4.70) is the tightest pair. It is used for the brief heading on case pages, so any future darkening of the surface should be checked against this test.

## Added in this PR

- Components: `Chip`, `MaskedValue`, `KpiRow`, `StatTile`, `ContentCard`, `Section`, `TimelineEntry`, `MediaBlock`, `NextStep`, and the `visibleNav` rule for the navigation.
- A hidden `/gallery` route that shows every component in every state with sample data. It is not linked and carries `noindex`.
- Tests: contrast, focus and motion, no arbitrary sizes in components, no hardcoded copy in components and routes, the navigation rule, and component behavior.
