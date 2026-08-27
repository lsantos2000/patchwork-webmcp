---
name: devpost-submission
description: Review and maintain the Patchwork WebMCP Devpost submission draft against the working repository, live deployment, testing evidence, and remaining submission requirements. Do not submit externally without explicit authorization.
---

# Patchwork Devpost Submission

Use this skill when reviewing or preparing Patchwork's hackathon submission materials.

Read [references/source-draft.md](references/source-draft.md) when comparing the latest repository and deployment against the participant's original submission draft. Treat its TODOs and readiness claims as assertions to verify, not as current facts.

Read [references/current-readiness.md](references/current-readiness.md) for the latest completed audit, then refresh it whenever deployment, browser evidence, video, or submission status changes.

## Review workflow

1. Inspect the current repository rather than trusting stale claims in a draft.
2. Verify the public repository, license, live URL, production build, WebMCP implementation, and testing instructions.
3. Distinguish source verification from browser-level WebMCP testing evidence.
4. Replace resolved TODOs with verified facts and leave unsupported claims clearly marked.
5. Never submit to Devpost, publish a video, or enter form fields without explicit user authorization.

## Grounding draft

### One-line summary

Patchwork is a human-in-the-loop neighbourhood action exchange that lets people and browser agents discover local projects, assemble realistic plans, and prepare contributions without allowing an agent to commit anyone's time.

### Problem and solution

Local opportunity sites contain valuable information, but people still have to search across listings, compare interests and schedules, and turn good intentions into a realistic plan. Patchwork presents neighbourhood projects in a responsive interface while exposing the same project information and actions as structured WebMCP tools. The interface and the agent share the same React state, so the person can see and edit the agent's work.

The safety boundary is explicit: an agent can search and organize, but it cannot commit the person's time. The `pledge_support` tool returns `confirmation_required` and does not finalize a pledge.

### WebMCP capabilities

1. `search_neighborhood_projects` searches projects using free text and a maximum-hour constraint, then shows results in the shared interface.
2. `build_action_plan` combines project identifiers, calculates total time, and updates the visible weekend plan.
3. `pledge_support` prepares a contribution draft but returns `confirmation_required`; it never submits or commits.

### Architecture claims to verify

- React 19 with a Next.js-style app router through Vinext.
- TypeScript, Vite, Vinext, and the Cloudflare Vite plugin.
- Shared React state for human controls and WebMCP handlers.
- `app/useWebMCP.ts` performs discovery, registration, error handling, and cleanup.
- `app/page.tsx` defines the three tool operations and structured schemas.
- No external database or persistent storage is required for the demonstration.
- Cloudflare Pages hosts the public deployment.

### Testing flow

Human flow:

1. Enter **help in a garden** and select **Explore**.
2. Confirm that the orchard project appears and is added to the weekend plan.
3. Try **donate food**, **fix clothes**, and **safer streets**.
4. Use category filters and add/remove controls to edit the plan.
5. Select **Review my plan** and verify the total hours and no-commitment message.

Agent prompt:

> Find neighbourhood projects I can help with this weekend in three hours or less. I care about food access and the outdoors. Build a plan, but do not make any pledge without asking me first.

Expected sequence:

1. `search_neighborhood_projects` returns matching projects and updates the interface.
2. `build_action_plan` returns selected records and total hours.
3. `pledge_support` returns `confirmation_required`.
4. No commitment is finalized.

### Demo video outline

1. **0:00–0:25 — Problem:** Local needs are fragmented, and turning intent into a realistic plan takes work.
2. **0:25–0:55 — Human UX:** Run “help in a garden,” show the match, and edit the weekend plan.
3. **0:55–1:50 — WebMCP proof:** Use the agent prompt and demonstrate search and planning tools.
4. **1:50–2:20 — Safety:** Call `pledge_support` and emphasize `confirmation_required`.
5. **2:20–2:45 — Implementation:** Show tool definitions and the registration lifecycle.
6. **2:45–3:00 — Close:** “Agents reduce coordination work; people keep agency.”

### Screenshot shot list

1. Hero search with the “people + agents” positioning.
2. Filtered neighbourhood project results.
3. Human-editable weekend action plan and total hours.
4. Agent-created plan reflected in the visible interface.
5. `pledge_support` showing that human confirmation is required.

### Known limitations

- The neighbourhood data is a small in-memory demonstration dataset.
- Pledges are drafts only; there is no persistence or external organization integration.
- Browser-level WebMCP behavior requires verification in a compatible browser.
- No automated application test suite is currently present.

### Form-field grounding

- Submitter Type: Individual
- Country: Canada
- Organization: Not applicable
- App Status: New
- Public repository: https://github.com/lsantos2000/patchwork-webmcp/
- Live URL: https://patchwork-webmcp.pages.dev/
- AI tools: Codex and Claude Code
- Learning derived: Significant
- Career value: Yes

### Judging alignment

- **WebMCP Leverage:** Three non-trivial operations share state with the human interface and implement a deliberate safety boundary.
- **Execution:** A coherent responsive product flow rather than a generic chatbot or isolated tool demonstration.
- **Potential Impact:** Reduces coordination friction for people who want to contribute to local projects.
- **Creativity & Ambition:** Applies WebMCP to civic coordination and demonstrates graduated authority.

### Deadline grounding

September 3, 2026 at 1:00 p.m. Pacific Time (20:00 UTC). Re-verify against the official event source before relying on this date.
