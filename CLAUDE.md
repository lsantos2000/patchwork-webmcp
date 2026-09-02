# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project mission

Patchwork is a WebMCP Challenge submission (creator: Leonardo Santos-Macias, individual entry). It demonstrates that agents can discover and organize public opportunities while people keep control of real-world commitments. Live target: https://patchwork-webmcp.pages.dev/

## Commands

Package manager is **pnpm** (lockfile + `pnpm-workspace.yaml`); CI uses pnpm 11.19 on Node 22.

```bash
pnpm install
pnpm dev                    # vinext dev on http://localhost:3000
pnpm exec tsc --noEmit      # type check (CI gate)
pnpm lint                   # eslint flat config (next core-web-vitals + typescript)
pnpm run build:pages        # vinext build + package pages-dist/ for Cloudflare Pages
pnpm run capture:evidence   # regenerate resources/evidence/negotiated-planning-native.json
```

`pnpm` must be on PATH — Playwright's `webServer` literally shells out to `pnpm dev`, so an npm-only machine fails the local suite. Node 25+ no longer ships corepack; install it with `npm install -g pnpm@11.19.0`.

### Tests

Playwright is the runner for **both** unit and browser tests (`testDir: './tests'`). `tests/unit/*` import `app/*` modules directly and run in-process; `tests/e2e/*` drive a real page.

```bash
pnpm run test:e2e:install                        # one-time: playwright install chromium
PLAYWRIGHT_USE_LOCAL=1 pnpm test:e2e             # start pnpm dev and test local source
PLAYWRIGHT_USE_LOCAL=1 pnpm exec playwright test tests/unit/negotiation.spec.ts
PLAYWRIGHT_USE_LOCAL=1 pnpm exec playwright test tests/e2e/webmcp-agent.spec.ts -g "registers exactly four"
pwsh -NoProfile -File tests/scripts/publish-github.test.ps1   # offline publish-helper cases
```

**`PLAYWRIGHT_USE_LOCAL=1` matters.** With neither it nor `PLAYWRIGHT_BASE_URL` set, `baseURL` defaults to the public Pages deployment, so a local run silently tests production instead of your changes. Always use the local-source variant when verifying work.

E2E specs reach the tools through `tests/fixtures/modelContext.ts`, which installs a `document.modelContext` shim, seeds `localStorage`, and waits for exactly four registered tools before the page is considered ready.

Manual WebMCP verification needs ChatGPT's in-app browser or Chrome 149+ with `chrome://flags/#enable-webmcp-testing`; prompts and pass criteria live in `resources/docs/browser-test.md`.

## Architecture

Next-compatible app served by **Vinext + Vite** onto the Cloudflare Workers runtime. There is no server state, database, or backend API — all six WebMCP tools mutate in-browser React state only.

### Two independent workflows in one page

`app/page.tsx` renders three tabs — Discover, Plan together, Action history — over **two** state worlds:

| | Discover (tab 0) | Plan together / Action history (tabs 1-2) |
| --- | --- | --- |
| State | `usePersistentState` -> `localStorage` | `createNegotiationStore`, session only |
| Data | `PROJECTS` + approved community projects | the four `PROJECTS` only |
| Tools | `search_neighborhood_projects`, `build_action_plan`, `propose_neighborhood_project`, `pledge_support` | `get_workspace`, `propose_plan_revision` |

Tabs 1 and 2 are rendered by a **single** `NegotiationWorkspace` instance whose panel `id`/`aria-labelledby` are swapped (`tab===2?2:1`) so the session store survives switching between them; a decoy always-hidden panel keeps both tab ids present for ARIA. Do not "simplify" this into two mounted components — it would reset the workspace on every tab switch.

Six tools exist across the app but **never simultaneously**: `useWebMCP(active ? tools : [])` in each workflow registers only the active tab's set.

### WebMCP registration — `app/useWebMCP.ts`

Single reusable hook. Prefers `document.modelContext`, falls back to `navigator.modelContext`. Registration passes an `AbortController` signal; cleanup aborts it (the current unregistration path) and then calls `unregisterTool(name)` as a legacy fallback. The effect keys on the `tools` array, so tool arrays must be `useMemo`'d or every render re-registers. The hook is **not** a schema validator — each `execute` handler normalizes and validates its own input.

### Negotiated planning — `app/negotiationStore.ts`

Imperative store consumed with `useSyncExternalStore`. Its guarantees are the point of the demo and the unit tests assert each one:

- **Revision-based optimistic concurrency.** Every UI edit bumps `revision`; `propose_plan_revision` requires a matching `base_revision` and returns `stale_revision` otherwise, so an agent cannot overwrite an edit made between its read and its proposal.
- **Constraints checked twice** — at proposal time and again at acceptance (pinned projects must survive, `totalHours` must fit `budget`). Conflicts return `constraint_conflict` with an explanation rather than a silent compromise.
- **The agent cannot accept its own proposal.** `accept()` is reachable only from a UI action.
- Each operation is one synchronous transition (`record` -> `publish`) to avoid stale React closures. `events` keeps the last 50 actions; the Action history tab labels them by entry path (`WebMCP tool` / `UI action` / `Example preview`), never as verified identity or model reasoning. `example()` is deterministic and must stay labeled as a preview, not an agent call.

### Discover persistence — `app/usePersistentState.ts`

Generic `localStorage` hook returning `[value, setValue, hydrated, storageStatus]`. Every key has a type-guard validator in `app/projectData.ts` (`isSavedPlan`, `isSavedProjects`, ...); invalid or unparsable stored values are removed and the page falls back to in-memory state with a visible "Storage unavailable" status. Keys are versioned (`patchwork.plan.v1`); bump the suffix when a shape changes rather than silently reinterpreting old data.

### Other files

- `app/projectData.ts` — the four demonstration projects, `searchProjects`, `createActionPlan`, and all storage validators. The UI and the tools read this same source.
- `app/ProposalReview.tsx` / `app/PledgeReview.tsx` — the human confirmation surfaces for `propose_neighborhood_project` and `pledge_support`.
- Styling is hand-written CSS imported in `app/layout.tsx` (`globals`, `persistence`, `focus`, `proposal`, `negotiation`); Tailwind is wired through PostCSS but only `@import 'tailwindcss'` is used.
- `scripts/build-pages.mjs` — copies `dist/server` and `dist/client` into `pages-dist/`, duplicates the server entry as `_worker.js`, and writes `_routes.json` excluding `/_next/static/*` and `/favicon.svg`. Without those exclusions Pages advanced mode routes CSS and client chunks through the worker and serves them as HTML.
- `scripts/publish-github.ps1` — the only sanctioned public-push path; it validates the origin remote, blocks `.env*`, `.wrangler/`, `.openai/` and key files, and greps the staged diff for credential patterns.
- `commit-and-push.ps1` (repo root) — a separate, simpler commit+push helper than `scripts/publish-github.ps1`; it defaults to branch `main` and prompts unless `-SkipConfirmation`. Do not confuse the two.
- `.claude/` — tracked agents (`hackathon-judge`, `release-engineer`, `webmcp-architect`), commands (`judge-swarm`, `release-check`), skills, and a `settings.json` permissions allowlist. The `patchwork-project-handoff` skill is deliberately gitignored.

### Code style

`app/page.tsx` and parts of `NegotiationWorkspace.tsx` are deliberately dense single-line JSX. Match the surrounding density when editing; do not reformat whole files.

## Deployment — Cloudflare Pages

Pages **advanced mode**: `pages-dist/` is uploaded as static assets plus a `_worker.js` that serves everything else. `pnpm run build:pages` is the only supported way to produce it; never hand-edit `pages-dist/`.

```bash
pnpm run build:pages
wrangler login                 # interactive only; expired tokens cannot refresh headlessly
wrangler pages project list    # confirm the project name before deploying
wrangler pages deploy pages-dist --project-name=<name>
```

- The live site is `patchwork-webmcp.pages.dev`, but **the Pages project name is recorded nowhere in the repo** — confirm it against the account rather than assuming it matches the hostname.
- `wrangler` is both a devDependency (4.92.0) and, on the maintainer's machine, a global install (4.120.0). Either can deploy; `pnpm exec wrangler` pins the project version.
- `pages-dist/wrangler.json` is a copied build artifact that names the worker `sites-project` with an assets dir of `../client`. It is inert because `pages-dist/.assetsignore` excludes `wrangler.json`, `.dev.vars`, and `.vite` from the upload. Don't "fix" it.
- CI (`.github/workflows/playwright.yml`) type-checks, runs the PowerShell publish tests, builds the Pages bundle, and runs Playwright against local source on Node 22 — but it does **not** deploy. Deployment is manual and requires explicit authorization.

## Product and safety rules

Full detail in `.claude/rules/webmcp-and-safety.md` and `.claude/rules/quality-gates.md`. The non-negotiables:

1. **Human agency first.** No draft, plan, or recommendation becomes a real commitment without an explicit confirmation step. `pledge_support` may update a visible draft but must never submit or contact an organizer.
2. **Same truth for people and agents.** Tools and UI read the same project records and semantics. Plans state the projects selected and their total time; avoid opaque ranking.
3. **Tool names are stable public API.** Renaming one requires updating README.md, the demo, and the tests that assert the exact registered set.
4. Input schemas stay JSON Schema-compatible with `required` explicit; read tools return structured serializable objects.
5. Plan results report persistence as pending (`persisted_on_device: false`, `storage_status: 'pending'`); only the UI can report a completed write, and session-only operation must stay usable when storage fails.
6. Preserve semantic HTML, accessible names, keyboard operation (including the tablist arrow/Home/End handling), visible focus, responsive layouts, and reduced-motion compatibility.
7. Never commit `.env*`, tokens, Cloudflare/GitHub auth state, `dist/`, `pages-dist/`, `.wrangler/`, `.openai/`, or `GitHub CLI/`. Review `git diff --cached` before any public push, and do not deploy or push without explicit authorization in the current conversation.
8. Use realistic, concise project copy; no placeholders and no unverifiable impact claims.
9. Keep the primary experience usable without an agent, and prefer small focused dependencies and platform-native browser APIs.

## Definition of done

Type check, `pnpm run build:pages`, and the local-source Playwright suite all pass; the page works at mobile and desktop widths and without an agent; consequential actions require human confirmation; tool behavior changes come with tests or documented manual verification; README, license, live URL, repository URL, and demo assets stay consistent with the code.
