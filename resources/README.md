# Patchwork resources

Public submission and judging resources are grouped here by media type.

## Video

- [Final public YouTube demo — 2:31](https://youtu.be/so9sDOxzeJY)
- [Canonical repository MP4](video/Patchwork_WebMCP_Judges_Demo.mp4)
- [Revision production notes, narration, captions, and upload checklist](video/DEMO_PRODUCTION.md)
- [Copy-ready YouTube description](video/YOUTUBE_DESCRIPTION.md)
- [Complete narrated walkthrough with all 11 slide images](video/DEMO_WALKTHROUGH.md)

The final 2:31 video is an edited browser-evidence walkthrough, not a continuous screen recording. It adds Plan together, scoped native tools, proposal comparison, action history, and conflict handling.

## Images

- [Hero and discovery](images/01-hero-search.png)
- [Filtered projects](images/02-filtered-projects.png)
- [Human weekend plan](images/03-human-weekend-plan.png)
- [Agent request and results](images/04a-agent-request-and-results.png)
- [Agent-created plan](images/04-agent-created-plan.png)
- [Human confirmation required](images/05-human-confirmation-required.png)
- [Agent-drafted need awaiting human review](images/06-agent-drafted-need-review.png)
- [Human-approved community project](images/07-human-approved-community-project.png)
- [Negotiated workspace and tabs](images/negotiated-planning/01-workflow-tabs-and-workspace.png)
- [Agent proposal before approval](images/negotiated-planning/02-agent-proposal-before-approval.png)
- [Action history after approval](images/negotiated-planning/03-action-history-after-approval.png)
- [Pinned-choice budget conflict](images/negotiated-planning/04-pinned-choice-budget-conflict.png)

The four negotiated-planning images are reproducible 1920-pixel-wide Playwright captures from a deployed URL. Run `PLAYWRIGHT_BASE_URL=<deployment> pnpm capture:evidence` (PowerShell: `$env:PLAYWRIGHT_BASE_URL='<deployment>'; pnpm capture:evidence`). They verify visible application behavior; native WebMCP discovery is recorded separately.

## Documentation

- [Negotiated-planning tabs and test scenarios](docs/negotiated-planning.md) — not covered by the current public video; covered by the refreshed local candidate.
- [Native negotiated-planning WebMCP evidence](evidence/negotiated-planning-native.json) — scoped discovery and both tool results from the deployed branch.


- [Browser and WebMCP test guide](docs/browser-test.md)
- [Main project README](../README.md)
- [Claude workspace instructions](../CLAUDE.md)
- [MIT license](../LICENSE)

## Public project links

- Live application: https://patchwork-webmcp.pages.dev/
- Public repository: https://github.com/lsantos2000/patchwork-webmcp
- WebMCP Challenge: https://webmcp.devpost.com/?ref_feature=challenge
