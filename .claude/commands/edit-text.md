---
description: Change a text on one of the sites (site, page, what, new text)
argument-hint: <site> <page> <which text> <new text>
---

Change a text on one of the sites, following CLAUDE.md exactly.

Request: $ARGUMENTS

1. Read CLAUDE.md. Identify the site (Odd Academia, PolicyBox or Rithm), the page (home,
   privacy policy, terms) and the exact text to change, using the content file table. Open
   that file and find the current text. If the site, page or text is missing or ambiguous
   (several matches, or the text is also used elsewhere), ask me one short question, quoting
   the candidates, and wait.
2. If the request is really a design or code change, say it needs a developer and stop.
3. Create a new branch from the latest main (`content/<site>-<short-description>`).
4. Change only that text in the content file. Keep the site's spelling and tone, the
   heading markup (`<em>`, `<br>`, `&nbsp;`) unless told otherwise, and YAML quoting rules.
5. Run `npm ci` (if needed) and `npm run build:<site>`; fix any error it names. Check
   `git diff` touches only the intended line(s).
6. Commit, push, and open a PR to main with the CLAUDE.md description template.
7. Wait for the Cloudflare preview of that site, then reply with: the preview link and the
   page to open, the before → after text, the PR link, and "Merge to publish; revert this PR
   to undo." Never merge.
