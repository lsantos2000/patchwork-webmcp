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
- WebMCP integration: `document.modelContext.registerTool(...)` in the client component

## WebMCP contract

- Tool names are stable public API. Do not rename them without updating the README and demo.
- Schemas must remain JSON Schema-compatible.
- Read tools must return structured serializable objects.
- `pledge_support` must remain confirmation-gated and must not perform a side effect directly.
- Add tests or manual verification notes whenever tool behavior changes.

## Working conventions

- Use realistic, concise project copy rather than placeholders.
- Keep the primary experience usable without an agent.
- Prefer small focused dependencies and platform-native browser APIs.
- Run `npm run build` before proposing a release.
- Review `git diff --cached` and run the credential scan in `scripts/publish-github.ps1` before every public push.
- Do not commit `dist/`, `pages-dist/`, `node_modules/`, `.wrangler/`, `.openai/`, local caches, or environment files.

## Definition of done

- The page builds successfully and works at mobile and desktop widths.
- All four WebMCP tools register in a compatible browser.
- Search and plan interactions work without an agent.
- Consequential actions require human confirmation.
- README, license, live URL, repository URL, and demo video are ready for submission.
