# Patchwork demo narration

Edited browser-evidence walkthrough with synthetic narration.


## 00:00:00,000 — PATCHWORK / WEBMCP CHALLENGE

Patchwork is a WebMCP-powered neighbourhood action exchange, created by Leonardo Santos-Macias. It helps people and browser agents turn good intentions into realistic plans while keeping consequential decisions explicitly human-controlled.


## 00:00:15,667 — THE PROBLEM

Finding a useful way to help still means searching listings, comparing time, and translating intent into a practical next step. Patchwork provides one visible workspace backed by structured demonstration records.


## 00:00:28,500 — DISCOVER

Discover keeps the original experience. Four WebMCP tools let an external browser agent search projects, assemble a visible plan, draft a neighbourhood need, and prepare a pledge without embedding another chatbot.


## 00:00:42,042 — PLAN TOGETHER

Plan together adds a separate session workspace. The person can pin projects, set a combined time budget, and ask the agent to revise around those constraints without changing the saved Discover plan.


## 00:00:53,833 — SCOPED NATIVE WEBMCP

In the deployed branch, the Codex in-app browser natively discovered exactly two tools after the tab switch: get workspace and propose plan revision. AbortSignal cleanup prevents tools from an inactive workflow remaining advertised.


## 00:01:08,583 — BEFORE / AFTER DIFF

The agent reads revision two, preserves the pinned pantry, and proposes replacing the orchard with the one-hour repair table. Patchwork shows the full before-and-after difference. Nothing changes until Accept revision is selected.


## 00:01:22,167 — ACTION HISTORY

Action history distinguishes WebMCP tool calls from interface actions and records the workspace revision. It is intentionally described as a bounded local history, not proof of identity or a tamper-proof audit log.


## 00:01:36,000 — CONSTRAINT CONFLICT

When the two-hour orchard is pinned inside a one-hour budget, the tool reports a constraint conflict. It does not silently remove the person's choice or claim that an impossible plan succeeded.


## 00:01:47,333 — HUMAN SAFETY BOUNDARY

The original safety boundary remains. Pledge support returns confirmation required and never contacts an organizer. Proposed community needs also require a separate visible approval action before device-local publication.


## 00:02:01,292 — IMPLEMENTATION / EVIDENCE

The project uses React, TypeScript, and Vinext on Cloudflare Pages. Sixty-four application checks cover both workflows. Native browser records remain separate from shim-based automation, and the branch deployment and live smoke test passed.


## 00:02:17,375 — PATCHWORK / TRY IT YOURSELF

Patchwork shows a future open web where agents reduce coordination work without taking away human agency. Open the live site, inspect the public source, and try both documented workflows. Small actions. Shared momentum.
