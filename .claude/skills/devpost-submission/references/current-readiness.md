# Current submission readiness

Updated September 1, 2026. This is a source/artifact audit, not a submission receipt.

## Current artifacts

- Creator: **Leonardo Santos-Macias**. Individual submission; no teammates.
- Four Discover tools: `search_neighborhood_projects`, `build_action_plan`, `propose_neighborhood_project`, and `pledge_support`.
- Tools update shared React state. Search and plans also affect device-local storage; they are not read-only.
- Approved project records persist locally when storage is available. Storage failures leave the app usable in memory with a warning. Pending proposals, pledge drafts, and pledge-review status do not persist.
- Pledge details are displayed and can be marked reviewed locally; no organizer is contacted. These UI additions postdate the recorded video.
- Proposal publication requires a separate UI approval action; pledges have no submission backend.
- Registration, compatibility fallback, isolated registration failures, and cleanup are implemented.
- The suite contains 64 application tests, including domain tests and shim-based browser tests. Coverage includes shared search constraints, persisted time-limit validation, storage failures, pledge review, and explicit example-plan labeling.
- Native Discover WebMCP inputs/results and capture metadata are in [webmcp-evidence.json](../../../../resources/video/demo-assets/webmcp-evidence.json).
- The proposal approval control was exercised by browser automation; do not describe that click as a human action.
- [Final video](https://youtu.be/so9sDOxzeJY): the refreshed negotiated-planning cut, "Patchwork WebMCP Short Presentation - Judges Demo (Sep 1, 2026)", verified Public by the owner on September 1. The local master is 151.38 seconds, female synthetic narration, covering both workflows.
- [Illustrated transcript](../../../../resources/video/DEMO_WALKTHROUGH.md) and [repository copy](../../../../resources/video/Patchwork_WebMCP_Judges_Demo.mp4) are available.
- [Submission worksheet](../../../../DEVPOST_SUBMISSION.md) holds the current owner checklist.

## Negotiated-planning extension

Plan together and Action history share a separate session-only workspace, leaving Discover unchanged. `get_workspace` reads current choices; `propose_plan_revision` validates the revision, pins, and combined budget before displaying a proposal. Acceptance and undo are UI actions. Six tools exist across the app, with only the active workflow's tools registered. On September 1, the deployed branch advertised exactly the two extension tools in the Codex in-app browser and both were invoked successfully. The proposal returned `approval_required` and `applied: false`; see [the native extension evidence](../../../../resources/evidence/negotiated-planning-native.json). Do not attribute these tools to the earlier video.

## Prior external evidence

The Cloudflare deployment, public repository, and GitHub-detected MIT license were verified in prior audits. Native Discover calls were recorded on August 30 and native negotiated-planning calls on the deployed branch on September 1. The September 1 branch build, Cloudflare deployment, 64 application checks, and live smoke test passed. The edited demo is not continuous screen-recording evidence. Source checks and shim tests do not replace native compatibility testing.

## Owner checks still required

- Confirm the final YouTube upload is Public, audible, and works logged out.
- Run the final task in a fresh supported browser session, ideally on another machine.
- Confirm country, eligibility, New/Existing status, learning, and career-value answers directly.
- Use the final video URL in Devpost, finish submission, and retain its confirmation.
- Do not describe a saved draft or registration as a completed submission.

The original [source draft](source-draft.md) is historical context, not current implementation truth.
