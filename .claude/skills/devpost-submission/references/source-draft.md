# Patchwork

## One-line Summary

Patchwork is a human-in-the-loop neighbourhood action exchange that lets people and browser agents discover local projects, assemble realistic plans, and prepare contributions without allowing an agent to commit anyone's time.

## Problem

Local opportunity sites contain valuable information, but people still have to search across listings, compare interests and schedules, and turn good intentions into a realistic plan. That coordination cost creates friction between wanting to help and taking a manageable local action.

## Solution

Patchwork presents neighbourhood projects in a responsive visual interface while exposing the same project information and actions as structured WebMCP tools. A compatible browser agent can search opportunities by interest or time, combine selected projects into a weekend plan, and prepare a pledge draft. The interface and the agent share the same React state, so the person can see and edit the agent's work.

The safety boundary is explicit: an agent can search and organize, but it cannot commit the person's time. The `pledge_support` tool returns `confirmation_required` and does not finalize a pledge.

## Why This Matters

Patchwork demonstrates a practical model for the agent-native open web: websites describe safe operations directly instead of forcing agents to scrape pages, infer controls, or imitate clicks. Agents reduce discovery and coordination work while people retain agency over consequential decisions.

## How We Used AI

Patchwork does not embed a chatbot or run its own model. It exposes three structured capabilities to an AI agent operating in a WebMCP-compatible browser:

1. `search_neighborhood_projects` searches local projects using free text and a maximum-hour constraint, then shows the results in the shared interface.
2. `build_action_plan` combines project identifiers, calculates total time, and updates the visible weekend plan.
3. `pledge_support` prepares a contribution draft but returns `confirmation_required`; it never submits or commits.

This separation keeps read-only discovery and planning convenient while reserving consequential action for the person.

## How We Used Codex

Codex supported the hackathon workflow by registering the participant, grounding the project against the official rules and judging criteria, and preparing the Devpost narrative from the working repository. The repository also uses an AI-assisted development workspace with role-specific architecture, judging, and release reviews. Before finalizing this section, record the concrete implementation, debugging, testing, and iteration work completed with Codex.

## Key Features

- Responsive project discovery interface with free-text, intent-aware matching.
- Category filters for Outdoors, Skills, Food, and Community projects.
- Human-editable weekend action plan with calculated time.
- Shared visible state for manual and agent-generated plans.
- Three discoverable WebMCP tools with structured schemas and results.
- Explicit human confirmation boundary before any pledge.
- Registration through `document.modelContext` with a compatible `navigator.modelContext` fallback.
- Tool cleanup through `unregisterTool` when the page is removed.
- Cloudflare-compatible production build.

## Architecture

- **Frontend:** React 19 with a Next.js-style app router through Vinext.
- **Language:** TypeScript.
- **Build/runtime:** Vite, Vinext, and the Cloudflare Vite plugin.
- **State:** React component state shared by the human interface and WebMCP tool handlers.
- **WebMCP integration:** `app/useWebMCP.ts` discovers a model context, registers tools, handles registration errors, and unregisters tools during cleanup.
- **Tool definitions:** `app/page.tsx` defines search, planning, and pledge-drafting operations with JSON-style input schemas.
- **Storage:** No external database or persistent storage is required for the challenge demonstration.
- **Hosting target:** Cloudflare Pages.

## Testing Instructions

### Local setup

1. Install Node.js 22.13 or newer and npm 10 or newer.
2. Clone the public repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

### Human flow

1. Enter **help in a garden** and select **Explore**.
2. Confirm that the orchard project appears and is added to the weekend plan.
3. Try **donate food**, **fix clothes**, and **safer streets**.
4. Use category filters and add/remove controls to edit the plan.
5. Select **Review my plan** and verify the total hours and no-commitment message.

### Agent flow

Open Patchwork in ChatGPT's in-app browser or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled. Ask:

> Find neighbourhood projects I can help with this weekend in three hours or less. I care about food access and the outdoors. Build a plan, but do not make any pledge without asking me first.

Verify this sequence:

1. `search_neighborhood_projects` returns matching projects and updates the interface.
2. `build_action_plan` returns selected records and total hours.
3. `pledge_support` returns `confirmation_required`.
4. No commitment is finalized.

## Public Demo Link

> **TODO:** Add and verify the Cloudflare Pages URL in ChatGPT's in-app browser or WebMCP-enabled Chrome.

## Public Repository Link

https://github.com/lsantos2000/patchwork-webmcp/

The repository is public, contains setup instructions, and has an MIT license recognized by GitHub.

## Demo Video

> **TODO:** Add the public YouTube URL. The video must remain under three minutes and include audio.

### Demo Video Outline

1. **0:00–0:25 — Problem:** Local needs are fragmented, and turning intent into a realistic plan takes work.
2. **0:25–0:55 — Human UX:** Run “help in a garden,” show the match, and edit the weekend plan.
3. **0:55–1:50 — WebMCP proof:** Use the agent prompt and demonstrate search and planning tools.
4. **1:50–2:20 — Safety:** Call `pledge_support` and emphasize `confirmation_required`.
5. **2:20–2:45 — Implementation:** Show tool definitions and the registration lifecycle.
6. **2:45–3:00 — Close:** “Agents reduce coordination work; people keep agency.”

## Screenshot Shot List

1. Hero search with the “people + agents” positioning.
2. Filtered neighbourhood project results.
3. Human-editable weekend action plan and total hours.
4. Agent-created plan reflected in the visible interface.
5. `pledge_support` result showing that human confirmation is required.

## Submission Readiness Notes

- Devpost authentication and challenge registration: verified.
- Rules acknowledgment: complete.
- Project concept and working source: present.
- Public repository: verified.
- MIT open-source license: verified.
- Setup and demonstration instructions: present.
- WebMCP tool implementation: verified in source.
- Production build claim: documented in the repository but not independently rerun in this workspace.
- Live application URL: **missing**.
- WebMCP-compatible browser test evidence: **missing**.
- Screenshots: **missing**.
- Public YouTube demonstration: **missing**.

## Known Limitations

- The neighbourhood data is a small in-memory demonstration dataset.
- Pledges are drafts only; there is no persistence or external organization integration.
- WebMCP behavior still needs final verification in the public deployment.
- No automated test suite is visible in the current repository tree.

## TODO Official Form Fields

- **Submitter Type:** Individual
- **Country of residence of yourself and team members if applicable:** Canada
- **If submitting on behalf of an organization, what is the organization name?:** Not applicable
- **App Status:** New
- **If Existing, explain what you updated during the submission period:** Not applicable
- **Live URL that judges can access using ChatGPT's in-app browser or Google Chrome with WebMCP enabled:** TODO
- **If applicable, testing instructions for application:** Use the testing steps above; add deployment-specific notes after verification
- **URL to your PUBLIC Code Repo:** https://github.com/lsantos2000/patchwork-webmcp/
- **Which agent(s) or client(s) did you test your WebMCP tools with?:** TODO after browser verification
- **Which AI tools have you leveraged while working on this project?:** Codex and Claude Code
- **Describe the level of learning you/your team derived from the project:** Significant
- **Did you gain AI value that you can use in your career?:** Yes

## Judging Alignment

- **WebMCP Leverage:** Three working, non-trivial operations share state with the human interface and implement a deliberate safety boundary.
- **Execution:** The repository contains a coherent responsive product flow rather than a generic chatbot or isolated tool demonstration.
- **Potential Impact:** Patchwork reduces practical coordination friction for people who want to contribute to local projects.
- **Creativity & Ambition:** The project applies WebMCP to civic coordination and demonstrates graduated authority: agents search and plan, while humans authorize commitments.

## Deadline

The official deadline is September 3, 2026 at 1:00 p.m. Pacific Time (20:00 UTC).

