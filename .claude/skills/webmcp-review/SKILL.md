---
name: webmcp-review
description: Audit Patchwork's WebMCP implementation after tool, schema, project-data, or interaction changes.
allowed-tools: Read, Glob, Grep
---

# WebMCP review

1. Locate every `document.modelContext.registerTool` call and the visible UI for the same capability.
2. Check names, descriptions, input schemas, required fields, serialization, and failure behavior.
3. Confirm search and planning are read-only.
4. Confirm pledge-like actions return a draft or `confirmation_required` and cannot perform a side effect.
5. Verify tool results derive from the same records shown to users.
6. Produce a severity-ordered report and one reproducible agent demo flow.

Do not edit files while using this skill.
