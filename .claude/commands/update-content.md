---
description: Change existing content (a metric, a link, a bio line) without touching components
argument-hint: <what to change>
---

Make this content change: $ARGUMENTS

1. Find the single source file in `/content` that holds it. Search the whole repo for the old value to catch duplicates.
2. Edit only content files. If the change seems to need a component edit, stop and explain why.
3. Never add a real JPMorganChase figure or a client name. Use a masked value where a figure is withheld.
4. Run `npm run content:validate`.
5. Summarize the diff in two lines and remind the user that merging does not publish: they click Publish in Lovable.
