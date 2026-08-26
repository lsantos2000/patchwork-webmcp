---
name: judge-readiness
description: Run a final hackathon-readiness audit covering product narrative, working experience, repository, WebMCP proof, demo, and submission assets.
allowed-tools: Read, Glob, Grep, Bash(git status:*), Bash(git diff:*), Bash(npm run build:pages)
---

# Judge-readiness audit

Review the repository as a complete submission, not only as code.

## Gates

- Clear real-world problem and a credible reason WebMCP is necessary.
- Working human interface plus discoverable agent tools.
- Demonstrable human-agent collaboration that was previously cumbersome.
- Explicit human approval for consequential action.
- Public URL, public repository, visible license, setup instructions, and no committed secrets.
- A truthful under-three-minute demo with a beginning, tool proof, safety moment, and memorable close.

Run `npm run build:pages` only when release validation was requested. Return a pass/fail table, evidence, blockers, and the next three actions. Never deploy or submit.
