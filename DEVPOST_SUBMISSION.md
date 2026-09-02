# Patchwork — Devpost Submission Worksheet

Prepared: August 30, 2026.

This is a local draft and owner checklist, not a Devpost submission receipt. Copy the public-facing answers into Devpost; do not copy the private preparation notes or TODO markers into your final description.

## Note for Leonardo Santos-Macias

The implementation and evidence are ready for your final review. Prioritize completing the form and verifying the final submission confirmation over adding features. Devpost currently reports you as **registered** for the WebMCP Challenge, with no submitted relationship returned in the August 30 check. Verify the entry's final status directly before the deadline.

The final 151.38-second negotiated-planning demo is public at [https://youtu.be/so9sDOxzeJY](https://youtu.be/so9sDOxzeJY), with a matching repository copy at [resources/video/Patchwork_WebMCP_Judges_Demo.mp4](resources/video/Patchwork_WebMCP_Judges_Demo.mp4).

Deadline in the organizer email: **Thursday, September 3, 2026, at 1:00 PM Pacific / 5:00 PM Atlantic (Halifax)**. Aim to finish earlier. The official Devpost website prevails if event details change.

No credentials belong in this file. It is in a public-repository workspace. Enter any private administrative answers directly into Devpost.

## Readiness at a glance

READY means an artifact exists or evidence was recorded; it does not mean every item was independently retested today.

| Item | Status | Evidence or next action |
| --- | --- | --- |
| Challenge registration | READY — checked August 30 | Devpost returned the registered relationship for The WebMCP Challenge. |
| Live application | READY — production content confirmed September 1 | [Cloudflare Pages application](https://patchwork-webmcp.pages.dev/) is the canonical judging URL. An unauthenticated fetch on September 1 returned the page titled "Patchwork — Small actions, shared momentum" with all three tabs present: Discover, Plan together, and Action history. This confirms production serves the negotiated-planning workflow; it is not a substitute for a native WebMCP browser run. |
| Registered WebMCP tools and actual agent call | READY — native evidence recorded August 30 and September 1 | The four Discover tools have recorded inputs/results in [Discover evidence](resources/video/demo-assets/webmcp-evidence.json). The two negotiated-planning tools were separately discovered and invoked on the deployed branch; see [extension evidence](resources/evidence/negotiated-planning-native.json). |
| Core prototype flow | READY | Search, shared planning, proposal review, human-approved device-local publication, and persistence. |
| Automated tests | READY — re-run September 1 | All 64 application checks passed against local source (`PLAYWRIGHT_USE_LOCAL=1`, 1.0 min), all six offline publishing-script cases passed, `tsc --noEmit` and ESLint were clean, and the Cloudflare Pages bundle built. A separate 6-test capture run regenerated the screen evidence and asserted each documented tool status. Automated WebMCP tests use a controlled shim; native browser evidence is separate. |
| Public repository and license | READY — confirmed September 1 | An unauthenticated fetch of the [repository](https://github.com/lsantos2000/patchwork-webmcp) showed it as Public with the sidebar reporting "MIT license". |
| YouTube video | READY — Public confirmed by owner September 1 | The oEmbed endpoint resolved [the link](https://youtu.be/so9sDOxzeJY) to "Patchwork WebMCP Short Presentation - Judges Demo (Sep 1, 2026)", confirming it is the refreshed negotiated-planning cut rather than the earlier Discover-only upload. The owner independently verified on September 1 that the upload's visibility is **Public**. |
| Video duration and audio | READY | Local validation records 151.38 seconds (2:31), 1920×1080 H.264 video, AAC audio, and measured audio levels. The final cut is published on YouTube and preserved in the repository. |
| Project description | READY — draft below | Covers fit, experience, human-agent collaboration, and implementation. |
| Screenshots and testing instructions | READY | [Visual evidence](README.md#visual-evidence), [screen evidence for negotiated planning and refusals](resources/screens/README.md), [resource index](resources/README.md), and [browser guide](resources/docs/browser-test.md). |
| Fresh browser / another-machine test | PARTIAL | Native calls passed in the Codex in-app browser on September 1. A final logged-out or another-machine run is still recommended before submission. |
| Submitter type and teammates | READY — owner confirmed August 30 | Individual submission; no teammates or invitations involved. |
| Personal form answers | TODO | Complete the fields identified below; do not infer residence or personal learning outcomes. |
| Final Devpost submission | TODO | Complete the form and retain its confirmation and public project URL. A saved draft is not sufficient. |

## Negotiated-planning workflow

Discover remains the original experience. Plan together and Action history add a separate, session-only workspace with `get_workspace` and `propose_plan_revision`: pinned projects, a combined time budget, before/after proposals, revision-conflict protection, explicit UI acceptance/rejection, and undo. The current suite contains 64 application checks plus six offline publishing-script cases. See [workflow testing instructions](resources/docs/negotiated-planning.md).

There are six tool definitions across the app: four registered in Discover and two in these tabs. The published demo video is the refreshed negotiated-planning cut and covers both workflows. Native discovery and invocation were verified in the Codex in-app browser: exactly the two scoped tools were advertised, and both returned structured results. See [the native evidence record](resources/evidence/negotiated-planning-native.json); note that this capture was taken against the branch preview deployment, and production was independently confirmed to serve all three tabs on September 1.

## Title

Patchwork WebMCP

## One-line summary

Negotiate a plan with your agent — and keep the final say. A neighbourhood planning workspace where the agent can propose changes it is structurally unable to apply on its own.

## Project description — copy-ready draft

### Problem

When an agent and a person work on the same thing at the same time, the person quietly loses. Screen-scraping and DOM automation give an agent exactly one verb — *act* — so it reads the page, decides, and writes. If you edited anything in the seconds between its read and its write, your edit is gone. There was no way for the agent to be told "no, that's stale, look again," because the page had no way to say it.

Neighbourhood planning is a good place to show this. People want to help locally, but opportunities are scattered, time budgets are real, and some choices are non-negotiable — the food pantry shift is the reason you were planning a weekend at all. Those are precisely the commitments an eager agent will optimize away.

### Solution

Patchwork is a neighbourhood planning workspace with a shared plan that both a person and an agent can work on. The agent can search, assemble plans, draft a missing local need, and propose revisions to a plan you are actively editing. What it cannot do is apply any of them. Every consequential change arrives as a proposal with a visible before/after, and acceptance is reachable only from a human UI action.

### Why WebMCP is a strong fit

Because this problem is only solvable if the *site* is the one holding the rules. An agent driving a browser through clicks cannot be refused — whatever it does to the DOM simply happens. WebMCP lets Patchwork expose operations that carry preconditions and can reject a call on its own terms.

The clearest case is `propose_plan_revision`, which requires a `base_revision`. Every human edit bumps the workspace revision, so a proposal built on a stale read returns `stale_revision` and is refused rather than applied. The site enforces that, not the agent's good manners. That is a guarantee no amount of prompt engineering or click automation can provide.

### How it creates a better experience

The agent does the comparison work; you keep the decisions, and you can see exactly what it wanted to do before it happens.

Pin the food pantry, set a three-hour budget, and ask for a better weekend. The agent reads the workspace, proposes a revision, and you get a before/after with its stated reason. If its proposal would drop a pinned project or exceed the budget, it comes back as a `constraint_conflict` with an explanation instead of a silent compromise — the agent is told why its plan is unacceptable rather than quietly shipping a worse one. Constraints are re-checked at acceptance, not only at proposal time, so a proposal that went stale while you thought about it cannot slip through.

The Action history tab then shows what happened and how it entered — `WebMCP tool`, `UI action`, or `Example preview`. It labels the entry path, never a verified identity.

### What people and agents can do together

**Co-editing the same live workspace without the agent being able to overwrite you.** That is the thing that was not practical before.

Concretely: you and an agent hold the same plan open. You unpin something; the agent, working from a read taken two seconds earlier, proposes a change. The site refuses it as `stale_revision` and tells the agent to re-read. It does, proposes again against your current state, and this time you see a before/after and click accept. Nothing was lost, nothing was silently merged, and at no point could the agent commit the change itself.

The same boundary runs through the Discover workflow: `propose_neighborhood_project` returns `human_approval_required` with `published: false`, and `pledge_support` returns `confirmation_required` and never contacts an organizer. The agent prepares; the person commits.

### How WebMCP is implemented

Six tools across two independent workflows, registered through `document.modelContext.registerTool({...})` with a `navigator.modelContext` fallback.

Discover registers four: `search_neighborhood_projects`, `build_action_plan`, `propose_neighborhood_project`, and `pledge_support`. The negotiated-planning workspace registers two: `get_workspace` (a structured read — revision, pins, budget, catalogue, pending proposal, any current constraint issue) and `propose_plan_revision` (a guarded write).

They are never all live at once. Registration is **scoped to the active workflow** — `useWebMCP(active ? tools : [])` — so an agent inspecting the Plan together tab is offered exactly two tools, not a menu of six, and cannot reach Discover's write paths from a tab where they make no sense. Registration passes an `AbortController` signal and cleanup aborts it, so tools unregister when a workflow goes inactive.

The negotiation store enforces three guarantees, each covered by unit tests: revision-based optimistic concurrency (`stale_revision`), constraints validated twice — at proposal *and* at acceptance (`constraint_conflict`), and an `accept()` path that no tool handler can call. Each operation is a single synchronous transition, so a proposal cannot be applied against a state the person has already changed.

### Why this matters

The interesting question about agents on the open web is not whether they can act, but whether a site can hold a line when they do. Patchwork's answer is that the site declares its own preconditions and refuses calls that would violate them — the agent gets a structured refusal and a reason, and the person keeps the final say by construction rather than by convention.

This is a working prototype, not a production neighbourhood service: the catalogue is demonstration data, publishing means adding to this browser's local catalogue, and pledges stay drafts.

## How AI and Codex were used — copy-ready draft

Patchwork does not embed its own model or chatbot. It exposes browser-local WebMCP tools that a compatible external agent can discover and invoke. Codex was used to develop the React application, implement WebMCP registration and handlers, debug styling and persistence, expand the Playwright tests, prepare documentation, and capture browser evidence. The live proposal workflow was tested through WebMCP discovery and invocation in the Codex in-app browser, followed by a Playwright-controlled approval-button interaction.

Video production also used Piper synthetic narration and local FFmpeg encoding. Google Gemini was also used, as confirmed by the owner. Its specific role has not been documented; do not invent one. Claude instructions in the repository are not evidence that Claude executed the application tools.

## Key features

- Agent proposals that are refused as `stale_revision` when a person edited the plan first.
- Pinned projects and a combined time budget, re-validated at acceptance as well as at proposal.
- `constraint_conflict` with a stated reason instead of a silent compromise.
- Acceptance reachable only from a human UI action; the agent cannot apply its own proposal.
- Tool registration scoped to the active workflow — two tools in Plan together, four in Discover, never six at once.
- Action history that labels how each change entered: WebMCP tool, UI action, or example preview.
- Human-facing project search and category filters, usable with no agent present.
- Agent-authored project drafts with explicit approval or rejection, and a draft-only pledge boundary.
- Browser-local persistence for plans and approved community projects.
- Documented browser testing and 64 automated checks; consult the latest CI run for validation status.

## Architecture

React and TypeScript provide the UI and shared state. Vinext builds the application for Cloudflare Pages. Two independent state worlds sit behind one page: Discover uses `usePersistentState` over `localStorage` with a type-guard validator per key, while the negotiated-planning workspace uses `negotiationStore` — an imperative store consumed via `useSyncExternalStore` that owns the revision counter, constraint checks, and event log, and is session-only by design. `useWebMCP` registers each workflow's tools and aborts them on cleanup. There is no server state, shared project database, embedded LLM service, or real pledge-delivery backend; every tool mutates in-browser React state only.

## Public links — ready to paste

- Live application: https://patchwork-webmcp.pages.dev/
- Public source repository: https://github.com/lsantos2000/patchwork-webmcp
- Public YouTube demo: https://youtu.be/so9sDOxzeJY
- Browser testing guide: https://github.com/lsantos2000/patchwork-webmcp/blob/main/resources/docs/browser-test.md
- Screenshots: https://github.com/lsantos2000/patchwork-webmcp#visual-evidence
- Screen evidence (proposals, refusals, honest history): https://github.com/lsantos2000/patchwork-webmcp/blob/main/resources/screens/README.md

## Testing instructions — copy-ready draft

No application login is required. Open the live URL in a WebMCP-capable browser and use its agent, not just the site's search box. Ask: "Find food-access and outdoor projects that fit within three hours. Build a plan, but do not pledge anything." Inspect the search results, selected project records, and plan total. The agent must choose a combination within the total budget; the plan tool reports the total rather than enforcing a supplied total-budget parameter.

Next ask: "Draft a two-hour Community project in West Commons called Audit accessible cooling spaces. The work is to verify shaded benches, water fountains, and accessible indoor cooling spaces. Do not publish it." Verify that `propose_neighborhood_project` displays a review card and returns `human_approval_required`. Select Reject draft to show that nothing is published, or Approve and publish to add it to this browser's catalogue and plan. Refresh to verify that the approved project and plan persist locally.

Finally ask for a pledge draft. Verify that `pledge_support` returns `confirmation_required` and no pledge is submitted. This prototype does not deliver commitments to an organizer. Full setup and browser-specific instructions are in the linked browser guide.

## Official form-specific answers and TODOs

Field labels and options below were fetched from Devpost on August 30, 2026. The description and video belong in the corresponding main project fields as well.

| Devpost field | Answer or action | Status |
| --- | --- | --- |
| Submitter Type | Individual — owner confirmed August 30. | READY |
| Country of residence of yourself and team members if applicable | TODO: enter each applicable residence directly in Devpost and check eligibility. | OWNER ANSWER |
| If submitting on behalf of an organization, what is the organization name? | Not applicable; individual entry. Leave blank. | READY |
| App Status | Proposed answer: New. README records development during the submission period. Confirm there was no pre-existing application before choosing this. | OWNER CONFIRMATION |
| If Existing, explain what you updated during the submission period. | Only if applicable: explain the pre-existing baseline, then identify the dated WebMCP, persistence, proposal, UI, and testing additions. Do not claim those dates establish the absence of earlier work. | CONDITIONAL |
| Live URL that judges can access using ChatGPT's in-app browser or Google Chrome with WebMCP enabled | https://patchwork-webmcp.pages.dev/ | READY |
| If applicable, testing instructions for application | Paste the testing instructions above and linked browser guide. No app credentials required. | READY |
| URL to your PUBLIC Code Repo (on Github, Gitlab, or Bitbucket) | https://github.com/lsantos2000/patchwork-webmcp | READY |
| Which agent(s) or client(s) did you test your WebMCP tools with? | Codex in-app browser with native WebMCP discovery and invocation; Playwright Chromium tests with a controlled model-context shim for automated regression coverage. Add Chrome or ChatGPT testing only after independently performing it. | READY — factual draft |
| Which AI tools have you leveraged while working on this project? | Codex for implementation, debugging, testing, documentation, and video production; Google Gemini (owner-confirmed use); Piper for synthetic female narration. | READY — factual draft |
| Describe the level of learning you/your team derived from the project | TODO: choose None, Moderate, or Significant based on your experience. | OWNER ANSWER |
| Did you gain AI value that you can use in your career? | TODO: choose Yes or No based on your experience. | OWNER ANSWER |

## Screenshot evidence — available

Use the existing assets; no new screenshots are required merely to fill this worksheet.

1. [Human-first discovery](resources/images/01-hero-search.png).
2. [Shared action plan](resources/images/04-agent-created-plan.png).
3. [No-pledge review boundary](resources/images/05-human-confirmation-required.png).
4. [Live agent-created project draft](resources/images/06-agent-drafted-need-review.png).
5. [Human-approved project](resources/images/07-human-approved-community-project.png).

Still images show visible states, not an entire tool-execution sequence. Pair them with the video and testing instructions rather than calling them a recording of tool execution.

## Demo video

UPLOADED: owner supplied the [final YouTube video](https://youtu.be/so9sDOxzeJY). [Repository MP4](resources/video/Patchwork_WebMCP_Judges_Demo.mp4) is preserved as a supporting asset, not a replacement for the required public YouTube link.

Final demo package: [Narrated MP4](resources/video/Patchwork_WebMCP_Judges_Demo.mp4), [script and captions](resources/video/DEMO_PRODUCTION.md), and [technical validation](resources/video/demo-validation.json). It covers Discover, scoped native negotiated-planning tools, before/after proposal review, action history, constraint conflicts, and draft-only pledges. It uses edited still-frame evidence and local Piper synthetic narration, not continuous screen recording. This is an **individual submission**, with no teammates.

The public video URL and repository asset now match the final negotiated-planning cut. Include Piper synthetic narration and Codex-assisted video production in the AI-tools answer.

The final video follows the [11-slide timestamped transcript](resources/video/DEMO_WALKTHROUGH.md), not the earlier optional recording outlines. Its 39-test reference is historical. The current application additionally displays pledge details for local review, warns when storage is unavailable, and labels its example-plan button explicitly.

## Known limitations — keep these claims accurate

- The starter catalogue contains demonstration projects, not a verified live feed of neighbourhood needs.
- "Publish" currently means adding an approved project to this browser's local catalogue. It does not share it with other users or devices.
- Pledges remain drafts. There is no real pledge submission or organizer notification workflow.
- Search uses deterministic text matching, not embedded AI reasoning. The external agent performs conversational interpretation.
- Automated WebMCP tests use a shim; they are not equivalent to native-browser compatibility testing.
- Repository Claude configuration is development guidance, not a guarantee of native Claude WebMCP support.

## Final owner TODO checklist

- [ ] Run a fresh-session end-to-end test in a WebMCP-capable browser, ideally on another machine. Record date, client, and result: TODO.
- [x] Open GitHub while logged out and confirm the repository and MIT license display correctly — unauthenticated fetch on September 1 showed Public with an "MIT license" sidebar entry.
- [x] Upload the final YouTube video — owner supplied https://youtu.be/so9sDOxzeJY, confirmed via oEmbed as "Patchwork WebMCP Short Presentation - Judges Demo (Sep 1, 2026)".
- [x] **Confirm the upload's visibility is Public, not Unlisted** — owner verified Public on September 1.
- [x] Duration and audio — the local master measures 151.38 s (2:31) with AAC audio at mean −18.8 dB, and the published upload is the same cut.
- [x] Refresh the video with the proposal workflow and upload the revision.
- [ ] Complete personal form answers and confirm New versus Existing.
- [x] Confirm submitter type: Individual, no teammates — owner confirmed August 30.
- [ ] Review the current official rules and eligibility directly on Devpost.
- [ ] Copy the description, links, and test instructions into Devpost; remove all preparation-only notes.
- [ ] Finish the submission flow and retain the final confirmation, timestamp, and public project URL.

Final Devpost project URL: TODO.

Final submission confirmation/timestamp: TODO.

No Devpost entry was created, changed, or sent while preparing this file. The optional plugin's local guided-workflow state is not initialized; use `$start-hackathon` and `$review-hackathon-rules` if you want that guided flow. This worksheet does not record acceptance of legal terms.
