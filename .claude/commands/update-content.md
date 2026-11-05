---
description: Change existing content (a metric, a link, a bio line) without touching components
argument-hint: <what to change>
---

Make this content change: $ARGUMENTS

1. Find the single source file in `/content` that holds it. Search the whole repo for the old value to catch duplicates.
2. Edit only content files. If the change seems to need a component edit, stop and explain why.
3. Run `npm run content:validate`.
4. If the change belongs in gated text, do not write it here: tell the user to edit the separate private repo and run `content:sync`.
5. Summarise the diff in two lines and remind the user that merging does not publish: they click Publish in Lovable.
