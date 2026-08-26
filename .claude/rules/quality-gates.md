# Quality gates

- Build with `npm run build:pages` before calling a release ready.
- Keep the page functional without an agent and progressively enhance it when WebMCP is present.
- Preserve semantic HTML, accessible names, keyboard operation, responsive layouts, and reduced-motion compatibility.
- Use concrete project copy; never introduce unverifiable impact claims.
- Inspect the staged diff for `.env*`, tokens, keys, credentials, local auth state, generated bundles, and unrelated files.
- Do not deploy or push without explicit authorization in the current conversation.
- Prefer independent review agents in parallel; use the isolated release agent for edits.
