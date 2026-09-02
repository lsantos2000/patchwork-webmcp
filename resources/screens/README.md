# Screen evidence — negotiated planning and human confirmation

Captured 2026-09-01 from local source at commit-time HEAD, 1440x900 at 2x device
scale (mobile frames at 390x844). Regenerate with:

```bash
PLAYWRIGHT_USE_LOCAL=1 pnpm run capture:screens
```

Every agent-driven frame was produced by **actually invoking the registered WebMCP
tool** through the model-context shim in `tests/fixtures/modelContext.ts` — not by
clicking the UI and calling it an agent. The capture run also asserts the tool
result status, so a frame cannot be produced unless the documented behaviour
really happened. These are automated captures against local source; they are not
a substitute for the native-browser evidence in `resources/evidence/`.

| File | What it proves |
| --- | --- |
| `01-discover-human-first.png` | The site is fully usable with no agent present. |
| `02-agent-search-shared-ui.png` | `search_neighborhood_projects` updates the same UI a person sees. |
| `03-agent-built-plan.png` | `build_action_plan` produces a visible, human-editable plan. |
| `04-agent-draft-awaiting-human-approval.png` | `propose_neighborhood_project` returns `human_approval_required` with `published: false`. |
| `05-pledge-draft-never-submitted.png` | `pledge_support` returns `confirmation_required`; nothing is sent to an organizer. |
| `06-plan-together-scoped-to-two-tools.png` | Registration is scoped: exactly `get_workspace` and `propose_plan_revision` are live here, not all six. |
| `07-agent-proposal-before-after.png` | A proposal shows current vs proposed, the agent's stated reason, and "Your current plan has not changed." |
| `08-human-accepted-revision.png` | Acceptance happens only through a human UI action. |
| `09-stale-revision-refused.png` | A person edited between the agent's read and its proposal; the write is refused as `stale_revision`. |
| `10-constraint-conflict-explained.png` | An impossible pin/budget combination returns `constraint_conflict` with a reason; the pin survives and no revision is pending. |
| `11-action-history-entry-paths.png` | History distinguishes `WebMCP tool` from `Example preview`, labelling the entry path rather than asserting identity. |
| `12-mobile-discover.png` | Responsive at 390px. |
| `13-mobile-plan-together-no-overflow.png` | Negotiation controls do not overflow at 390px (asserted, not just observed). |
