# Plan together: a negotiated workspace

## Preserve the original experience

**Discover** remains the default tab, with the original search, saved plan, project proposals, and pledge-review flow. Its four existing WebMCP tool names and behavior remain available there.

**Plan together** is a separate workspace using the four demonstration projects. It starts with orchard and pantry (three hours). It does not overwrite the Discover plan or import its community additions. **Action history** shows events from this new workspace only. Both new tabs share the same workspace and tools.

The new workspace is session-only: tab switches preserve it, but a page reload resets it, including pending proposals, history, and undo. This separation is deliberate while the new workflow is evaluated. No accounts, external pledges, bookings, or organizer notifications are involved.

## Two new WebMCP tools

| Tool | Contract |
| --- | --- |
| `get_workspace` | Returns the actual selection, pins, total-hour budget, revision, catalog, pending proposal, and recent actions. The read itself is recorded in the local activity history. |
| `propose_plan_revision` | Accepts `base_revision`, `project_ids`, and a 1–500 character `reason`. Validates known IDs, pinned projects, and the combined time budget; presents a proposal without applying it. |

Only the active workflow's tools are registered: four in Discover, two in Plan together or Action history. Six tool definitions exist across the app, not six simultaneously registered tools. Ask the browser agent to rediscover tools after changing workflow tabs.

The new contracts return `approval_required`, `constraint_conflict`, `stale_revision`, or `invalid_input`. Error results do not modify the selected plan. Repeated identical pending proposals reuse the proposal ID. An agent-supplied reason is displayed as supplied text, never as hidden model reasoning.

## Memorable demo: preserve my choice

1. Open **Plan together**.
2. Pin **Restock the little pantry** using **Keep this · pin**.
3. Change the total budget from three hours to two hours.
4. Ask your WebMCP browser agent:

   > Read my workspace. Keep everything I pinned. Propose a revised plan within my total time budget, using the pantry and repair projects if they fit. Explain the change, but do not apply it.

5. Verify `get_workspace` returns the actual pin and current revision.
6. Verify `propose_plan_revision` proposes pantry and repair: two hours, with the orchard removed. The current plan must remain unchanged until you accept.
7. Select **Accept revision**, then **Undo accepted revision**. Undo restores the previous selection and increments the revision; it can restore an over-budget previous plan, which is visibly flagged.
8. Open **Action history** to inspect the real tool and UI events.

Without a connected agent, **Preview an example revision** exercises the same checks using deterministic selection logic. It is explicitly labeled **Example preview**, not a WebMCP call. It retains pinned projects and as many currently selected projects as fit; it does not search for replacements.

## Conflict and stale-result demonstrations

- Pin the two-hour orchard, set a one-hour budget, and ask for a plan keeping the orchard. The tool must report a conflict rather than dropping the pin or claiming the plan fits.
- Create a valid proposal, then change a budget, pin, or selected project. The existing proposal becomes outdated and its acceptance button is disabled. The underlying acceptance operation independently checks the revision as well.
- A tool request using an old revision returns `stale_revision`; the agent must reread the workspace.
- Rejecting a proposal leaves the plan unchanged. New manual changes clear undo so that an old undo cannot overwrite later choices.

## Evidence and boundaries

The action history is a local, bounded record of the latest 50 operations—not tamper-proof audit storage or proof of human identity. “UI action” can include browser automation; “WebMCP tool” identifies the handler entry path. These features are implemented after the final recorded video; that video remains evidence for the earlier Discover workflow, not a demonstration of these tabs.

Automated domain and shim-based browser tests cover pins, total-budget enforcement, stale revisions, acceptance, rejection, undo, duplicate proposals, history attribution, tab isolation, keyboard navigation, and mobile layout. A fresh native WebMCP browser run is still needed before claiming compatibility evidence for these two new tools.

## Reproduce the visual evidence

Run the full suite against the intended deployment, then generate the four high-resolution captures:

```powershell
$env:PLAYWRIGHT_BASE_URL='https://your-deployment.example'
pnpm test:e2e
pnpm capture:evidence
```

The generated files are stored in [`resources/images/negotiated-planning`](../images/negotiated-planning). The capture script installs a controlled model-context shim so it can invoke handlers deterministically. These screenshots are automated UI evidence, not a substitute for a native compatible-browser tool-discovery record.
