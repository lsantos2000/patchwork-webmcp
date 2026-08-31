# Browser and WebMCP testing

Use this guide to verify Patchwork's public deployment, human interface, WebMCP tools, and human-confirmation boundary.

## Test target

- Live application: https://patchwork-webmcp.pages.dev/
- Public repository: https://github.com/lsantos2000/patchwork-webmcp

## Additional workflow tabs

This guide's four-tool sequence applies to the default **Discover** tab. The separate **Plan together** and **Action history** tabs expose `get_workspace` and `propose_plan_revision` instead. Follow [the negotiated-planning guide](negotiated-planning.md) to test pins, revisions, total budgets, approval, and undo. Rediscover tools after switching tabs.

## Expected Discover WebMCP tools

| Tool | Expected result |
| --- | --- |
| `search_neighborhood_projects` | Returns matching projects and reflects the search in the visible interface |
| `build_action_plan` | Selects project records, calculates total hours, and updates the Weekend Plan |
| `propose_neighborhood_project` | Structures a local need and displays a draft that only a person can approve for publication |
| `pledge_support` | Prepares a draft and returns `confirmation_required`; nothing is submitted |

## ChatGPT in-app browser

1. Open the live application inside ChatGPT's browser panel.
2. Keep the Patchwork page open while talking to the agent.
3. If tool discovery does not start automatically, say:

   > Discover and use the WebMCP tools registered by this page.

4. Give the agent this prompt:

   > Find neighbourhood projects about food access and the outdoors that fit within three hours. Build a plan for me, but do not pledge anything.

5. Verify that `search_neighborhood_projects` runs and the visible results change.
6. Verify that `build_action_plan` runs and the Weekend Plan shows the same selected projects and total hours.
7. Refresh or leave and reopen Patchwork; verify that the same plan returns with **Saved on this device** visible.
8. Ask the agent to draft a new neighbourhood need. Verify that the review card states **Nothing is published without human approval**, then approve or reject it manually.
9. Then ask:

   > Prepare a pledge for one selected project, but do not submit it.

10. Verify that `pledge_support` returns `confirmation_required` and displays the project and contribution in a review card. Select **Mark draft reviewed**; confirm **Draft reviewed locally. No pledge sent.** Reload and confirm the draft and its review status are gone. This does not submit a pledge.

## Chrome WebMCP testing

Use Chrome 149 or newer with the experimental WebMCP testing feature enabled.

1. Open `chrome://flags/#enable-webmcp-testing`.
2. Enable the WebMCP testing flag and relaunch Chrome.
3. Open the live Patchwork URL.
4. Use a WebMCP-capable agent/client connected to that browser.
5. Run the same prompt and acceptance checks from the ChatGPT section.

If the tools are not discovered, hard-refresh with `Ctrl+Shift+R`, confirm the public Pages hostname, and retry with Patchwork already open before starting the agent request.

## Claude instructions

### Claude Code repository review

Open the repository in Claude Code and ask:

> Read CLAUDE.md and the project skills. Audit the four WebMCP tools, shared React state, publishing and commitment boundaries, browser-test guide, and visual evidence. Do not change or submit anything. Report source-verified claims separately from browser-verified claims.

The repository includes role-specific Claude agents, rules, skills, and `/judge-swarm` and `/release-check` commands. Claude should verify:

- tool schemas and handlers in `app/page.tsx`;
- registration, error handling, and cleanup in `app/useWebMCP.ts`;
- the `confirmation_required` return value;
- the Cloudflare Pages packaging and static-asset routing;
- README claims against the actual implementation.

### Claude and Google Chrome boundary

Claude products support standard MCP integrations, but that does not by itself prove support for tools registered by a webpage through WebMCP. Use Claude Code for repository review and use **Google Chrome with WebMCP enabled** for the live browser test unless the selected Claude client explicitly documents WebMCP support.

1. Use Claude Code for the source and judge-readiness audit.
2. Use ChatGPT's in-app browser or Google Chrome 149+ with WebMCP enabled for the live four-tool run.
3. Preserve the live recording as the browser-level evidence.

Do not describe a source review, ordinary browser automation, or standard MCP-server connection as a successful WebMCP test.

## Current behavior versus recorded demo

The final video is an edited historical walkthrough. It predates the visible pledge-review card, storage-unavailable warning, and **Try an example plan** label. Its reference to 39 passing tests remains accurate for that recorded run; consult current CI for the expanded suite. Native tool inputs/results are evidence for the recorded version, not an automatic certification of every later change.

## Evidence recording

Record the public URL, agent conversation, readable tool names, and resulting Patchwork UI in the same sequence. The recording should show:

1. `search_neighborhood_projects` followed by visible results.
2. `build_action_plan` followed by the matching Weekend Plan and total hours.
3. `propose_neighborhood_project` followed by the human-only publish decision.
4. `pledge_support` followed by `confirmation_required`.
5. The message that no pledge was submitted.
6. A final manual edit proving the person retains control of the plan.

Keep credentials, personal notifications, profiles, and unrelated tabs out of the recording.

## Pass criteria

### Search synchronization regression

1. Select **Skills** manually, then ask the agent to search for food projects taking at most one hour each.
2. Confirm **All** becomes the active category and the visible card is **Restock the little pantry**, matching the tool result.
3. Ask for all projects taking at most one hour each. Confirm the visible cards are **Sunday repair table** and **Restock the little pantry**.
4. Refresh. Confirm the one-hour limit and both cards remain. Select **Clear time limit** (the **Up to 1 hr per project** button) to restore all four demonstration projects in a fresh catalogue.
5. Search for garden projects taking at most one hour each. Confirm no results, then select **Show every project** to clear the query, category, and time limit.

The hour limit applies to each project, not the combined plan total.

- [ ] Public Pages URL loads with production CSS.
- [ ] All four tool names are discoverable or visibly invoked.
- [ ] Search and planning update shared visible state.
- [ ] Agent-selected records match the displayed plan.
- [ ] Total hours are correct.
- [ ] Search, filter, and plan survive a refresh in the same browser.
- [ ] **Clear plan** removes the saved selections.
- [ ] Proposed needs remain drafts until a person approves publication.
- [ ] Pledge remains a draft.
- [ ] Human confirmation is explicitly required.
- [ ] No errors appear in the interaction.
- [ ] Evidence recording includes audio and remains under three minutes.

## Useful references

- [OpenAI WebMCP showcase](https://developers.openai.com/showcase?view=webmcp-apps)
- [Anthropic MCP documentation](https://docs.anthropic.com/en/docs/mcp)
- [Claude Code setup](https://docs.anthropic.com/en/docs/claude-code/getting-started)
