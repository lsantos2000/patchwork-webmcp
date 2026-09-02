# Patchwork WebMCP

**Small actions. Shared momentum.**

Patchwork is an open-source neighbourhood planning workspace where people and browser agents discover opportunities, build practical plans, and draft new community needs together—while every publication or commitment remains under human control.

## Project links

- **Live application:** https://patchwork-webmcp.pages.dev/
- **Source repository:** https://github.com/lsantos2000/patchwork-webmcp
- **Demo video:** https://youtu.be/so9sDOxzeJY
- **Browser testing guide:** [resources/docs/browser-test.md](resources/docs/browser-test.md)
- **Visual evidence:** [README.md#visual-evidence](README.md#visual-evidence)
- **License:** [MIT](LICENSE)

Created by **Leonardo Santos-Macias** as an individual submission to the WebMCP Challenge.

## Inspiration

People often want to help their neighbourhood but must compare scattered opportunities, interpret time requirements, and translate a broad intention into a realistic plan. Conventional recommendation experiences often stop at a list of links, leaving the person to repeat the planning work elsewhere.

Patchwork explores a more useful open web: a website that remains welcoming and fully usable by people while exposing clear, structured capabilities to agents. The agent can reduce coordination work, but the person can always see, edit, accept, or reject the result.

## What it does

Patchwork turns neighbourhood opportunities into a shared visual workspace. A person can browse and filter demonstration projects manually, or ask a compatible browser agent to search the same catalogue and assemble an achievable plan.

The original **Discover** experience supports intent-aware project discovery, an editable weekend plan, device-local persistence, community-project drafts, and draft-only pledges. The additional **Plan together** workspace demonstrates negotiated planning: the person sets a time budget, selects and pins projects, and reviews the agent's proposed before-and-after revision. **Action history** records accepted or rejected planning actions without pretending that a real-world pledge was sent.

An agent can also structure a new local need as a project draft. That draft stays outside the catalogue until the person explicitly approves it. Pledge preparation follows the same safety boundary: the agent can create a draft, but Patchwork never submits a commitment.

## Why WebMCP

This workflow maps naturally to declared website capabilities: search project records, combine selected IDs into a plan, inspect a shared workspace, propose a revision, structure a new community need, and prepare a pledge draft.

Without WebMCP, an agent would need to infer meaning from visual pages, scrape text, or automate fragile click sequences. Patchwork instead exposes typed operations and structured results through the website itself. The agent works with the application's real records and constraints, while its results update the same interface the person is viewing.

This creates a continuous human-agent experience. A person can inspect an agent-created plan, adjust it manually, preserve a pinned choice, reject a proposed revision, approve a community-project draft, or undo an accepted workspace change without transferring information between a chat response and another form.

## How we built it

Patchwork uses React and TypeScript for the interface and shared application state. Vinext creates the Cloudflare Pages production build. Project-domain helpers provide deterministic catalogue search, planning, constraint checks, and persisted-data validation.

A reusable React hook registers WebMCP tools with `document.modelContext.registerTool({...})`, provides a `navigator.modelContext` compatibility fallback, and unregisters tools during cleanup. Each handler validates or normalizes inputs, calls the relevant domain helper, updates shared React state, and returns a structured response.

The Discover workflow provides:

- `search_neighborhood_projects`
- `build_action_plan`
- `propose_neighborhood_project`
- `pledge_support`

The Plan together workspace provides:

- `get_workspace`
- `propose_plan_revision`

Tool availability is scoped to the active workflow. Proposal results include revision information and a before-and-after comparison. Stale revisions and impossible constraints produce explicit conflicts rather than silent compromises.

The human-control boundary is deliberate. `propose_neighborhood_project` returns `human_approval_required` with `published: false`; only the visible approval control adds the draft to the browser-local catalogue. `pledge_support` returns `confirmation_required` and never delivers a pledge.

## Challenges we ran into

The most important challenge was making agent actions feel native to the visual product rather than bolting a tool layer onto a separate interface. WebMCP handlers therefore update the same React state as human controls, so both participants share one visible source of truth.

State synchronization also required care. A plan must remain consistent when it is edited manually, created through a WebMCP tool, restored from local storage, or revised in the negotiated workspace. The implementation validates persisted records and uses workspace revision numbers to prevent stale agent proposals from overwriting newer human choices.

Another challenge was testing an emerging browser capability. The project combines native WebMCP discovery and invocation evidence with Playwright regression tests that use a controlled model-context shim. These forms of evidence are documented separately so automated coverage is not presented as native-browser proof.

## Accomplishments

- A deployed, open-source WebMCP application that remains fully usable without an agent.
- Six structured tools across two scoped workflows.
- Shared human-agent state instead of disconnected conversational recommendations.
- Explicit approval, rejection, conflict, and undo behavior.
- Device-local persistence with validation and graceful storage-unavailable messaging.
- A responsive interface with production styling on Cloudflare Pages.
- Comprehensive automated coverage plus recorded native WebMCP evidence.
- Clear prototype boundaries: demonstration data, browser-local publication, and no real pledge delivery.

## What we learned

WebMCP is most compelling when it exposes meaningful domain actions rather than recreating low-level clicks. Small, well-described tools give an agent enough structure to help while keeping application rules in the application.

Human control works best when it is visible in both the protocol result and the interface. Returning `confirmation_required` is valuable, but pairing it with an editable on-page draft makes the safety boundary understandable.

We also learned that honest constraints can improve an agent experience. A structured conflict response is more useful than silently dropping a pinned project or exceeding a time budget, and revision tokens protect a person's newer decisions from stale proposals.

## How AI tools were used

Patchwork does not embed its own model or chatbot. It exposes browser-local WebMCP tools that a compatible external agent can discover and invoke.

Codex assisted with React and WebMCP implementation, debugging, automated testing, documentation, browser evidence, and demo production. Google Gemini was also used during the project. Piper generated the synthetic narration for the demo, and FFmpeg assembled and validated the final video.

## ChatGPT WebMCP discovery query

A [ChatGPT conversation](https://chatgpt.com/c/6a9847cc-ef80-83ea-831d-86f6f0b24462) was used to query the live application with the request:

> Discover tools at https://patchwork-webmcp.pages.dev/

The query identified **six WebMCP tools** across Patchwork's workflows. The tools are dynamically registered according to the active tab, so an agent sees only the capabilities relevant to the person's current workspace.

| Tool | Available in | Input | What it does |
| --- | --- | --- | --- |
| `search_neighborhood_projects` | Discover | `query?: string`, `max_hours?: 1–8` | Searches neighbourhood projects and updates the visible shared interface. |
| `build_action_plan` | Discover | `project_ids: string[]`, maximum 8 | Builds and displays a plan from selected projects. |
| `propose_neighborhood_project` | Discover | `title`, `area`, `type`, `hours`, `description` | Creates a community-project draft that requires human approval. |
| `pledge_support` | Discover | `project_id`, `contribution` | Creates a pledge draft without submitting a commitment. |
| `get_workspace` | Plan together and Action history | None | Reads the negotiation revision, selected projects, pins, budget, catalogue, and recent actions. |
| `propose_plan_revision` | Plan together and Action history | `base_revision`, `project_ids`, `reason` | Proposes a plan revision while respecting pinned projects and the time budget. |

On the initial **Discover** tab, the browser agent can discover:

`search_neighborhood_projects` → `build_action_plan` → `propose_neighborhood_project` → `pledge_support`

When the person selects **Plan together**, those tools are unregistered and the agent instead discovers:

`get_workspace` → `propose_plan_revision`

The same two negotiated-planning tools remain registered in **Action history**. This contextual design keeps the tool catalogue focused and makes the exposed agent capabilities follow the person's current UI context.

`get_workspace` is read-only. `propose_plan_revision` requires the workspace revision on which the proposal is based, preserves pinned projects, and enforces the displayed time budget. It creates a visible before-and-after proposal but cannot accept its own revision. The person must approve or reject the change in the interface.

The built-in project IDs accepted by `propose_plan_revision` are:

- `orchard` — Revive the schoolyard orchard
- `repair` — Sunday repair table
- `pantry` — Restock the little pantry
- `walk` — Map a safer night walk

A useful query for this workflow is:

> Read my workspace. Revise the plan to fit my total time budget, preserve everything I pinned, and explain your changes. Propose only—do not apply anything.

The intended interaction is `get_workspace` → `propose_plan_revision` → human reviews the diff → human accepts or rejects it.

## Testing instructions

No login or credentials are required.

1. Open https://patchwork-webmcp.pages.dev/ in ChatGPT's in-app browser or a compatible WebMCP-enabled browser.
2. Confirm that **Discover**, **Plan together**, and **Action history** appear at the top of the page.
3. In Discover, ask the browser agent: “Find food-access and outdoor projects that fit within three hours. Build a plan, but do not pledge anything.”
4. Inspect the matching records, editable plan, and calculated time total.
5. Ask: “Draft a two-hour Community project in West Commons called Audit accessible cooling spaces. The work is to verify shaded benches, water fountains, and accessible indoor cooling spaces. Do not publish it.”
6. Confirm that the draft appears for review and remains unpublished until the visible approval control is used.
7. Ask for a pledge draft and confirm that `pledge_support` returns `confirmation_required` without submitting anything.
8. Open Plan together and ask the agent to inspect the workspace and propose a plan within the displayed time budget. Review the before-and-after proposal before accepting or rejecting it.
9. Open Action history and confirm that the recorded action matches the decision made in the interface.

Detailed setup, Chrome configuration, expected tool results, and pass criteria are available in the [browser testing guide](resources/docs/browser-test.md).

## Visual evidence

1. [Human-first discovery](resources/images/01-hero-search.png)
2. [Shared action plan](resources/images/04-agent-created-plan.png)
3. [Human confirmation boundary](resources/images/05-human-confirmation-required.png)
4. [Agent-drafted community need](resources/images/06-agent-drafted-need-review.png)
5. [Human-approved community project](resources/images/07-human-approved-community-project.png)
6. [Negotiated-planning workspace](resources/images/negotiated-planning/01-workflow-tabs-and-workspace.png)
7. [Agent proposal before approval](resources/images/negotiated-planning/02-agent-proposal-before-approval.png)
8. [Action history](resources/images/negotiated-planning/03-action-history-after-approval.png)
9. [Constraint conflict](resources/images/negotiated-planning/04-pinned-choice-budget-conflict.png)

The final 2:31 demo is [public on YouTube](https://youtu.be/so9sDOxzeJY). A repository copy, captions, narration, and technical validation are available in [resources/video](resources/video).

## Built with

WebMCP, React, TypeScript, Vinext, Cloudflare Pages, Playwright, Node.js, pnpm, GitHub Actions, localStorage, Piper, FFmpeg, Codex, Google Gemini

## Prototype boundaries

- The starter catalogue contains demonstration projects rather than a live feed of verified neighbourhood needs.
- Publishing a project adds it to the current browser's local catalogue; it is not shared with other people or devices.
- Pledges remain drafts. There is no organizer notification or real pledge-delivery backend.
- Catalogue search uses deterministic text matching. Conversational interpretation comes from the external browser agent.
- Automated WebMCP tests use a controlled model-context shim and complement, rather than replace, native-browser testing.

## What's next

Future versions could connect to verified community organizations, provide shared accounts and cross-device storage, support organizer moderation, and add privacy-preserving project feeds. The same WebMCP approach could then let agents coordinate across multiple trusted local services while keeping every public action and real-world commitment explicitly human-approved.
