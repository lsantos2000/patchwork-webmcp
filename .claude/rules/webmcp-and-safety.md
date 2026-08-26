# WebMCP and safety rules

- Keep the visible UI and WebMCP tools backed by the same project records.
- Preserve the stable public tool names documented in README.md.
- Use JSON Schema-compatible input schemas with required fields explicit.
- Return structured, serializable results.
- Treat pledges, registrations, messages, purchases, and external writes as consequential.
- Consequential tools must prepare a draft and require explicit human confirmation before any side effect.
- Never add credentials, private data, tracking identifiers, or hidden network calls to tool results.
