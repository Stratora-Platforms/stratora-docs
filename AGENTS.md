# AGENTS.md

Instructions for coding agents (Claude Code, Codex) working in `stratora-docs`, the public customer documentation site at https://docs.stratora.io.

## Public repo rules

This repository is public. Anything you write here, in files, commits, issues, PRs or comments, can be read by anyone.

- **Never file, describe or discuss security vulnerabilities in this repo.** Security work goes only to the private `Stratora-Platforms/stratora` repo.
- **Never write internal hostnames, IP addresses, lab machine names, credentials, tokens or private backlog text here.** Do not copy text from the private repo's issues or archived backlog files into this repo.
- **Customer-facing docs must not describe unreleased or unfixed security behaviour.** Document security behaviour only once the fix has shipped in a public release.
- **Do not describe features that have not shipped.** Docs describe released behaviour.

If an issue in this repo turns out to involve a security problem, stop, do not add detail to it, and tell Nick so it can be moved to the private repo.

## Where work is tracked

Work for this repo is tracked as GitHub Issues in `Stratora-Platforms/stratora-docs`, on the org project **Stratora Development**: https://github.com/orgs/Stratora-Platforms/projects/1

The full workflow lives in the private `stratora` repo's `AGENTS.md`. The essentials are below so you can work from this repo alone.

### Approval (owner decision, 2026-10-16)

- **Board writes do not halt.** You may move board statuses, comment on issues and file new issues without halting for Nick's approval. Say in your report what you moved, posted and filed.
- **Check for private content first.** This repo (like stratora-website) is public. Before filing or commenting here, check the text contains nothing private: no security detail, internal hostnames or lab box names, credentials, private backlog text (see the public repo rules). Security work only ever goes to the private `Stratora-Platforms/stratora` repo.
- **Closing needs evidence.** An issue closes as Done only through Nick's PR merge (`Closes #N`, which this repo allows only when nothing is left to prove after the merge; see the workflow), or by closing it with an evidence comment that shows the fix on origin (step 5). Never close without that evidence. Close as not planned only with Nick's approval.
- **Diff, commit and push keep the halt cadence.** Halt at the diff, before each commit and before each push, and wait for Nick's go-ahead at each one, except inside a workflow he has explicitly approved (for example an autonomous wave with standing approval to push per-issue branches and open PRs). Outside such a workflow, opening a PR also needs the go-ahead. **Merging always stays with Nick.** Merging a PR or pushing to `main` deploys the live site.

### Project fields

| Field | Values |
|---|---|
| Status | Backlog, Ready, In Progress, Code Review, QA / Testing, Blocked, Done |
| Priority | P0 Critical, P1 High, P2 Medium, P3 Low, P4 Enhancement |
| Release | Next release, Following release, Security release, Out-of-band, Later, Unscheduled |
| Work Type | Bug, Feature, Security, Tech Debt, Docs, Validation/QA, Investigation, Process/CI, Ops/Lab, Release |
| Agent | Claude Code, Codex, Nick, Unassigned |
| Legacy ID | Text. The old backlog ID, if the issue came from the migration. |

Labels: `area:*` (for this repo usually `area:docs`), `blocked:hardware`, `blocked:external`, `blocked:decision`, `needs-verify`, `needs-triage`, `release-gate`, `customer-commitment`, `agent-filed`. There is no `security` label in this repo, on purpose.

### The workflow

1. **Pick** the issue Nick gave you, or else one in Ready, then Backlog, highest Priority first. Do not start one whose Agent field is set to someone else, or one with a `blocked:*` label unless you are clearing the blocker.
2. **Claim** it: set Agent to yourself, Status to In Progress, and post a plan comment: what you will change, how you will prove it, what is out of scope.
3. **Work** on a branch. Reference the issue in commits and in the PR body with `Refs #123`. Do not use `Closes #123` or another closing keyword: the site deploys only after the merge, so the deploy run and the live check are still owed when the PR merges, and a closing keyword would close the issue (and move it to Done) before that evidence exists. The only exception is a change with nothing to prove after merge (for example a README edit that does not touch the site).
4. **Review**: when the PR is open, set Status to Code Review. A merged PR does not move the card by itself; after the merge, move it to QA / Testing until the deploy is checked.
5. **Evidence before Done**: unless Nick's merge of a PR with `Closes #N` closed it (only where step 3 allows that), close the issue by hand once the deploy run is green and the live page is checked. Before closing, comment with:
   - what changed (one or two lines);
   - the commit SHAs **on `origin/main`** and the PR. Run `git fetch` first and confirm each commit is there, for example with `git branch -r --contains <sha>` (it must list `origin/main`);
   - how you checked it: the `npm run build` result and what you looked at in the local preview;
   - the deploy run for that commit (link, green) and what you saw on https://docs.stratora.io after it finished.

   A local commit, a handoff claim or a green PR is not evidence. Never close an issue without the commits on `origin/main` and the deploy result. Closing the issue moves it to Done.
6. **Blocked**: set Status to Blocked, add the matching `blocked:*` label, and comment what you are waiting on.
7. **New work you find**: file a new issue instead of widening the current one, at the moment you find it. You do not need to ask first (see Approval above), but a new issue is public: check the text for private content before you post it, and say in your report what you filed. Add the `agent-filed` label (and `needs-triage` if you are unsure of priority), add it to the project, set Status Backlog, Work Type and Priority, and put it under the epic `Stratora-Platforms/stratora#18` (Customer docs) as a sub-issue. Security findings never go here. File them in the private `stratora` repo.

### Later backlog

Unscheduled P3/P4 docs work sits in three checklist issues here: #8, #9 and #10, titled "Later backlog: … (docs)". Each line links to its full text in the private `stratora` repo's `docs/backlog-archive/`; those links open only for people with access to that repo. To promote a line:

1. Create a new issue in this repo, under the epic, with Priority, Release and Work Type set and the line's Legacy ID in the Legacy ID field. Write a new public description: what users see, where (which page), and what done looks like. You may link the archive entry, but **never paste the archive text**: it holds internal host and lab names, evidence and private IDs. If the Later backlog issue says to paste the archive entry, do not; this rule wins.
2. In the Later backlog issue, tick the line and append the new issue number (`→ #N`).

Do not work an item straight off the checklist; it needs its own issue first.

### gh commands

The project is number `1`, owner `Stratora-Platforms`. Look up field and option IDs at run time rather than hard-coding them:

```bash
# Field and option IDs
gh project field-list 1 --owner Stratora-Platforms --format json

# Project ID
gh project view 1 --owner Stratora-Platforms --format json --jq .id

# Add the issue to the project (safe if it is already there) and get its item ID
ITEM=$(gh project item-add 1 --owner Stratora-Platforms \
  --url https://github.com/Stratora-Platforms/stratora-docs/issues/123 \
  --format json --jq .id)

# Set a single-select field, for example Status = In Progress
gh project item-edit --project-id <PROJECT_ID> --id "$ITEM" \
  --field-id <STATUS_FIELD_ID> --single-select-option-id <IN_PROGRESS_OPTION_ID>

# Set the Agent field the same way, using the Agent field and option IDs

# Comment on the issue
gh issue comment 123 --repo Stratora-Platforms/stratora-docs --body "Starting on this."

# File a new issue
gh issue create --repo Stratora-Platforms/stratora-docs \
  --title "..." --body "..." --label area:docs --label agent-filed

# Close with evidence (after the deploy run for the merge commit is green)
git fetch origin
git branch -r --contains abc1234   # must list origin/main
gh issue close 123 --repo Stratora-Platforms/stratora-docs \
  --comment "Done in abc1234 (on origin/main), PR #456. npm run build passes; checked the page in the local preview; deploy run <link> green for abc1234; the live page shows the change."
```

## Working on the site

The site is built with Docusaurus 3.9 and needs Node 20 or later (CI uses Node 20).

```bash
npm ci            # install exactly what package-lock.json pins (what CI runs)
npm start         # dev server with hot reload at http://localhost:3000
npm run build     # production build into build/ (what CI runs)
npm run serve     # serve the built site locally to check it
npm run clear     # clear the Docusaurus cache if the build acts strangely
```

Layout:

- `docs/` holds the documentation. Sidebars are generated from the folder structure. Each folder has a `_category_.json` for its label and position, and each page has frontmatter (`title`, `sidebar_label`, optionally `sidebar_position`).
- `docs/changelog.md` is the changelog. Release notes are blog posts in `blog/`, named `YYYY-MM-DD-release-vX.Y.Z.md`.
- `src/` holds custom pages, components and CSS. `static/` holds images and other files copied as-is.
- `docusaurus.config.js` and `sidebars.js` configure the site.

Before you open a PR, run `npm run build`. The config sets `onBrokenLinks: 'throw'`, so a broken internal link fails the build, and therefore the deploy.

## What not to do

- **Do not push or merge to `main`** without Nick's explicit approval for that push or merge (see Approval above). Every push to `main` builds and deploys the live site to GitHub Pages (`.github/workflows/deploy.yml`).
- Do not run `npm run deploy`. Deployment is done by CI.
- Do not commit `build/`, `.docusaurus/` or `node_modules/`.
- Do not add or change dependencies, or swap `npm ci` for `npm install` in CI, without being asked. Keep `package-lock.json` in sync with any dependency change you are asked to make.
- Do not snapshot a docs version (`docs:version`) unless asked.
- Do not edit published release posts in `blog/` beyond corrections you were asked to make.
