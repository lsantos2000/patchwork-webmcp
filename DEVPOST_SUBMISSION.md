# Patchwork — Devpost Submission Worksheet

Prepared: August 30, 2026.

This is a local draft and owner checklist, not a Devpost submission receipt. Copy the public-facing answers into Devpost; do not copy the private preparation notes or TODO markers into your final description.

## Note for Leonardo Santos-Macias

The implementation and evidence are ready for your final review. Prioritize completing the form and verifying the final submission confirmation over adding features. Devpost currently reports you as **registered** for the WebMCP Challenge, with no submitted relationship returned in the August 30 check. Verify the entry's final status directly before the deadline.

The current [public YouTube video](https://youtu.be/c_RzlVBHSpg) is the earlier 2:57 Discover-focused cut. A refreshed 151.38-second negotiated-planning candidate now exists at [resources/media/Patchwork_WebMCP_Judges_Demo.mp4](resources/media/Patchwork_WebMCP_Judges_Demo.mp4). Review it with sound, upload it as a new public video, and replace all submission links with the new URL.

Deadline in the organizer email: **Thursday, September 3, 2026, at 1:00 PM Pacific / 5:00 PM Atlantic (Halifax)**. Aim to finish earlier. The official Devpost website prevails if event details change.

No credentials belong in this file. It is in a public-repository workspace. Enter any private administrative answers directly into Devpost.

## Readiness at a glance

READY means an artifact exists or evidence was recorded; it does not mean every item was independently retested today.

| Item | Status | Evidence or next action |
| --- | --- | --- |
| Challenge registration | READY — checked August 30 | Devpost returned the registered relationship for The WebMCP Challenge. |
| Live application | READY — branch extension verified September 1 | [Cloudflare Pages application](https://patchwork-webmcp.pages.dev/) and the Cloudflare branch preview both responded successfully. Merge the reviewed branch before presenting the extension as part of the production URL. |
| Registered WebMCP tools and actual agent call | READY — native evidence recorded August 30 and September 1 | The four Discover tools have recorded inputs/results in [Discover evidence](resources/video/demo-assets/webmcp-evidence.json). The two negotiated-planning tools were separately discovered and invoked on the deployed branch; see [extension evidence](resources/evidence/negotiated-planning-native.json). |
| Core prototype flow | READY | Search, shared planning, proposal review, human-approved device-local publication, and persistence. |
| Automated tests | READY — September 1 branch run | All 64 application checks passed against the deployed branch, the production build completed locally, six offline publishing-script cases remain documented separately, and the branch's Cloudflare and live-smoke checks passed. Automated WebMCP tests use a controlled shim; native browser evidence is separate. |
| Public repository and license | READY from prior verification | [Repository](https://github.com/lsantos2000/patchwork-webmcp) and [MIT license](LICENSE). TODO: final logged-out visual check that GitHub displays the license. |
| YouTube video | UPLOADED — owner supplied replacement link | [Watch the revised video](https://youtu.be/c_RzlVBHSpg). TODO: confirm Public visibility and logged-out playback for this new upload. |
| Video duration and audio | REFRESHED CANDIDATE READY | Local validation records 151.38 seconds (2:31), 1920×1080 H.264 video, AAC audio, and measured audio levels. TODO: owner playback review, new public YouTube upload, captions, and logged-out verification. |
| Project description | READY — draft below | Covers fit, experience, human-agent collaboration, and implementation. |
| Screenshots and testing instructions | READY | [Visual evidence](README.md#visual-evidence), [resource index](resources/README.md), and [browser guide](resources/docs/browser-test.md). |
| Fresh browser / another-machine test | PARTIAL | Native calls passed in the Codex in-app browser on September 1. A final logged-out or another-machine run is still recommended before submission. |
| Submitter type and teammates | READY — owner confirmed August 30 | Individual submission; no teammates or invitations involved. |
| Personal form answers | TODO | Complete the fields identified below; do not infer residence or personal learning outcomes. |
| Final Devpost submission | TODO | Complete the form and retain its confirmation and public project URL. A saved draft is not sufficient. |

## New workflow extension — after the recorded video

Discover remains the original experience. Plan together and Action history add a separate, session-only workspace with `get_workspace` and `propose_plan_revision`: pinned projects, a combined time budget, before/after proposals, revision-conflict protection, explicit UI acceptance/rejection, and undo. The current suite contains 64 application checks plus six offline publishing-script cases. See [workflow testing instructions](resources/docs/negotiated-planning.md).

There are six tool definitions across the app: four registered in Discover and two in the new tabs. The recorded video covers the earlier four-tool experience. The deployed negotiated-planning branch was subsequently tested with native discovery and invocation in the Codex in-app browser: exactly the two scoped tools were advertised, and both returned structured results. See [the native evidence record](resources/evidence/negotiated-planning-native.json).

## Title

Patchwork WebMCP

## One-line summary

Small actions. Shared momentum. A shared neighbourhood planning workspace where agents organize opportunities and draft new needs while people retain control.

## Project description — copy-ready draft

### Problem

People often want to help their neighbourhood but must compare scattered opportunities, interpret time requirements, and turn a broad intention into a practical plan. An agent's recommendations are less useful when they remain disconnected from the interface where a person must review and act on them.

### Solution

Patchwork turns neighbourhood opportunities into a shared, editable weekend plan. People can browse the visual catalogue themselves or ask a compatible browser agent to search and assemble a plan. An agent can also structure a new local need as a project draft. The draft remains outside the catalogue until the person explicitly approves it.

### Why WebMCP is a strong fit

The workflow maps naturally to structured website capabilities: search project records, combine selected IDs into a plan, propose a new need, and prepare a pledge draft. WebMCP lets the website define these operations and their input schemas. The agent can work with application records instead of inferring actions from screenshots or brittle page scraping.

### How it creates a better experience

Tool handlers update the same React state that powers the visible interface. A person can inspect the result, edit the plan manually, reject a proposed need, or approve it without transferring information between a conversation and a separate form. Plans and approved community projects persist on the same browser/device across visits.

### What people and agents can do together

An agent can translate an intention such as helping with food access and outdoor work into searches and a proposed plan, then structure a missing local opportunity for review. The person can continue editing that same workspace. This replaces disconnected recommendations and fragile click automation with declared operations and visible results. Agents prepare and organize; people retain the decision to approve a proposed project. Pledge handling remains draft-only and does not create real-world commitments.

### How WebMCP is implemented

The original Discover workflow defines four tools: `search_neighborhood_projects`, `build_action_plan`, `propose_neighborhood_project`, and `pledge_support`. A reusable React hook registers them through `document.modelContext.registerTool({...})`, with a `navigator.modelContext` compatibility fallback and unregister cleanup. The handlers validate or normalize inputs, update shared UI state, and return structured results. The proposal tool returns `human_approval_required` with `published: false`; only the visible human approval control adds its draft to the device-local catalogue. The pledge tool returns `confirmation_required` and does not submit a pledge.

### Why this matters

Patchwork demonstrates an open-web interaction pattern in which a site remains usable by people while exposing useful, constrained capabilities to agents. The goal is less coordination work without hiding the result or surrendering the person's decision-making role. The current project is a working prototype, not a production neighbourhood service.

## How AI and Codex were used — copy-ready draft

Patchwork does not embed its own model or chatbot. It exposes browser-local WebMCP tools that a compatible external agent can discover and invoke. Codex was used to develop the React application, implement WebMCP registration and handlers, debug styling and persistence, expand the Playwright tests, prepare documentation, and capture browser evidence. The live proposal workflow was tested through WebMCP discovery and invocation in the Codex in-app browser, followed by a Playwright-controlled approval-button interaction.

Video production also used Piper synthetic narration and local FFmpeg encoding. Google Gemini was also used, as confirmed by the owner. Its specific role has not been documented; do not invent one. Claude instructions in the repository are not evidence that Claude executed the application tools.

## Key features

- Human-facing project search and category filters.
- Agent-created, human-editable plans with calculated time totals.
- Agent-authored project drafts with explicit approval or rejection.
- Browser-local persistence for plans and approved community projects.
- Structured WebMCP results and a draft-only pledge boundary.
- Documented browser testing and 64 automated checks; consult the latest CI run for validation status.

## Architecture

React and TypeScript provide the UI and shared state. Vinext builds the application for Cloudflare Pages. Project-domain helpers supply catalogue search, planning, and persisted-data validation. `useWebMCP` registers the browser tools; `usePersistentState` restores supported state from `localStorage`. There is no shared project database, embedded LLM service, or real pledge-delivery backend.

## Public links — ready to paste

- Live application: https://patchwork-webmcp.pages.dev/
- Public source repository: https://github.com/lsantos2000/patchwork-webmcp
- Public YouTube demo: https://youtu.be/c_RzlVBHSpg
- Browser testing guide: https://github.com/lsantos2000/patchwork-webmcp/blob/main/resources/docs/browser-test.md
- Screenshots: https://github.com/lsantos2000/patchwork-webmcp#visual-evidence

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

UPLOADED: owner supplied the [new YouTube video](https://youtu.be/c_RzlVBHSpg). Confirm Public visibility and logged-out playback for this replacement upload. [Repository MP4](resources/video/Patchwork_WebMCP_Judges_Demo.mp4) is available as a supporting asset, not a replacement for the YouTube link.

Refreshed demo candidate: [Narrated MP4](resources/video/Patchwork_WebMCP_Judges_Demo.mp4), [script and captions](resources/video/DEMO_PRODUCTION.md), and [technical validation](resources/video/demo-validation.json). It covers Discover, scoped native negotiated-planning tools, before/after proposal review, action history, constraint conflicts, and draft-only pledges. It uses edited still-frame evidence and local Piper synthetic narration, not continuous screen recording. This is an **individual submission**, with no teammates.

TODO: watch and listen to the refreshed local revision, upload it as a new public YouTube video, check captions and logged-out playback, then replace https://youtu.be/c_RzlVBHSpg throughout the repository and Devpost submission. Include Piper synthetic narration and Codex-assisted video production in the AI-tools answer.

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
- [ ] Open GitHub while logged out and confirm the repository and MIT license display correctly.
- [x] Upload the revised YouTube video — owner supplied https://youtu.be/c_RzlVBHSpg.
- [ ] Confirm the replacement upload is Public and works while logged out.
- [ ] Verify audible narration and final YouTube duration below 3:00.
- [x] Refresh the video with the proposal workflow and upload the revision.
- [ ] Complete personal form answers and confirm New versus Existing.
- [x] Confirm submitter type: Individual, no teammates — owner confirmed August 30.
- [ ] Review the current official rules and eligibility directly on Devpost.
- [ ] Copy the description, links, and test instructions into Devpost; remove all preparation-only notes.
- [ ] Finish the submission flow and retain the final confirmation, timestamp, and public project URL.

Final Devpost project URL: TODO.

Final submission confirmation/timestamp: TODO.

No Devpost entry was created, changed, or sent while preparing this file. The optional plugin's local guided-workflow state is not initialized; use `$start-hackathon` and `$review-hackathon-rules` if you want that guided flow. This worksheet does not record acceptance of legal terms.
