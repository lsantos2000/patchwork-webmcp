---
description: Validate the Pages build, inspect the public diff for secrets, and report release readiness without deploying.
allowed-tools: Read, Glob, Grep, Bash(git status:*), Bash(git diff:*), Bash(git ls-files:*), Bash(npm run build:pages)
---

Use the `judge-readiness` and `webmcp-review` skills. Build the Pages bundle, inspect tracked and staged files for secret-like paths or values, verify the documented WebMCP tools exist, and return a concise release checklist. Never push, deploy, or submit.
