---
description: Run independent WebMCP and hackathon-judge reviews, then synthesize a release decision.
allowed-tools: Agent, Read, Glob, Grep, Bash(git status:*), Bash(git diff:*)
---

Run the `webmcp-architect` and `hackathon-judge` agents in parallel. Keep their contexts independent. If fork mode is available, use conversation forks so the reviews remain observable and steerable; otherwise use background subagents. Synthesize their evidence into one ordered release decision without modifying files.
