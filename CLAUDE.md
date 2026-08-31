# CLAUDE.md

## Project mission

Patchwork demonstrates a humane future for the open web: agents can discover and organize public opportunities, while people remain in control of real-world commitments.

## Product principles

1. **Human agency first.** Never turn a draft, plan, or recommendation into a real commitment without an explicit confirmation step.
2. **Same truth for people and agents.** WebMCP tools must use the same project data and semantics as the visible interface.
3. **Explainable outcomes.** Plans should include the projects selected and their total time; avoid opaque ranking.
4. **Accessible by default.** Preserve semantic HTML, labels, keyboard access, visible focus states, and responsive layouts.
5. **No hidden credentials.** Never commit `.env*`, Cloudflare/GitHub auth state, access tokens, local logs, or generated credential files.

## Architecture

- Framework: Next.js-compatible app built with Vinext and Vite
- UI: `app/page.tsx`
- Styling: `app/globals.css`
- Metadata: `app/layout.tsx`
- Hosting target: Cloudflare Pages
- WebMCP integration: definitions in `app/page.tsx`, registration and cleanup in `app/useWebMCP.ts`
- Creator: Leonardo Santos-Macias; individual submission
- Persistence: browser-local search, category, per-project time limit, plan, and approved project records; not a shared database

## Additional workflow tabs

- Discover preserves the original four tools and browser-local saved plan.
- Plan together and Action history share a separate session-only workspace in `app/negotiationStore.ts` and `app/NegotiationWorkspace.tsx`.
- Two tools (`get_workspace`, `propose_plan_revision`) are registered only while a new tab is active. Six tools exist across workflows, not simultaneously.
- Preserve pinned choices, validate combined time limits, and check the revision on both proposal creation and acceptance. Never let the agent directly accept its own proposal.
- History records entry paths, not verified identities or hidden model reasoning. Do not label the deterministic example as an agent invocation.

## WebMCP contract

- Tool names are stable public API. Do not rename them without updating the README and demo.
- Schemas must remain JSON Schema-compatible.
- Read tools must return structured serializable objects.
- `pledge_support` may update a visible draft, but must never submit or contact an organizer. Local review is not a real-world commitment.
- Plan results report persistence as pending; only the UI can report a completed storage write. Keep session-only operation usable if storage fails.
- Add tests or manual verification notes whenever tool behavior changes.

## Working conventions

- Use realistic, concise project copy rather than placeholders.
- Keep the primary experience usable without an agent.
- Prefer small focused dependencies and platform-native browser APIs.
- Run `pnpm exec tsc --noEmit`, `pnpm run build:pages`, and the local-source Playwright suite before proposing a release; CI performs these checks.
- Review `git diff --cached` and run the credential scan in `scripts/publish-github.ps1` before every public push.
- Do not commit `dist/`, `pages-dist/`, `node_modules/`, `.wrangler/`, `.openai/`, local caches, or environment files.

## Definition of done

- The page builds successfully and works at mobile and desktop widths.
- All four WebMCP tools register in a compatible browser.
- Search and plan interactions work without an agent.
- Consequential actions require human confirmation.
- README, license, live URL, repository URL, and demo video are ready for submission.
