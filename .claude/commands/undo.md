---
description: Undo a published content change by opening a revert PR
argument-hint: <PR number/link, or a description of the change>
---

Undo a published (merged) change by opening a revert PR, following CLAUDE.md ("Undoing a
published change").

Change to undo: $ARGUMENTS

1. Find the merged PR. If I described the change instead of giving a number, list the
   matching recently merged PRs (title, date, what changed) and ask me to confirm which one.
   If the PR is not merged yet, don't revert: say it is not live and offer to close it instead.
2. Create a branch from the latest main (`revert/<original-branch>`) and revert the PR's
   merge commit (`git revert -m 1 <merge-commit>`, or `git revert <commit>` if it was
   squash-merged). If later changes conflict with the revert, stop and explain in plain words.
3. Run `npm run build:<site>`; check `git diff` is exactly the original change in reverse.
4. Push and open a PR titled `Revert "<original title>"`, with "Reverts #<number>" and the
   before → after (the other way round) in the description, plus "Merge to publish the undo."
5. Wait for the Cloudflare preview, then reply with the preview link, the page to open, what
   will go back to what, and the PR link. Never merge.
