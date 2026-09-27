---
description: Find and return the Cloudflare preview link for the current PR
argument-hint: [PR number or link]
---

Find the preview link for a pull request, following CLAUDE.md ("Finding the preview link").

PR: $ARGUMENTS (if empty: the open PR for the current branch; if there is none, ask me which).

1. Find the PR and the site(s) it changes (from its files: `sites/<site>/...`).
2. Read the PR comments from the Cloudflare Pages bot ("Deploying <site>-astro with Cloudflare
   Pages") and the "Cloudflare Pages: <project>" check runs. If a deploy is still in progress,
   check again every minute for up to ~10 minutes.
3. Reply with, per changed site: the Branch Preview URL and the page(s) to open, the deploy
   status, and whether the "Check and build all sites" check passed. If a deploy failed, say
   so plainly, find why (the logs or a local `npm run build:<site>`), and offer to fix it.
4. End with the preview link.
