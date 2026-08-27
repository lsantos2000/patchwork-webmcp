# Browser and WebMCP testing

Use this guide to verify Patchwork's public deployment, human interface, WebMCP tools, and human-confirmation boundary.

## Test target

- Live application: https://patchwork-webmcp.pages.dev/
- Public repository: https://github.com/lsantos2000/patchwork-webmcp

## Expected WebMCP tools

| Tool | Expected result |
| --- | --- |
| `search_neighborhood_projects` | Returns matching projects and reflects the search in the visible interface |
| `build_action_plan` | Selects project records, calculates total hours, and updates the Weekend Plan |
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
7. Then ask:

   > Prepare a pledge for one selected project, but do not submit it.

8. Verify that `pledge_support` returns `confirmation_required` and Patchwork states that nothing was submitted.

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

> Read CLAUDE.md and the project skills. Audit the three WebMCP tools, shared React state, confirmation boundary, browser-test guide, and visual evidence. Do not change or submit anything. Report source-verified claims separately from browser-verified claims.

The repository includes role-specific Claude agents, rules, skills, and `/judge-swarm` and `/release-check` commands. Claude should verify:

- tool schemas and handlers in `app/page.tsx`;
- registration, error handling, and cleanup in `app/useWebMCP.ts`;
- the `confirmation_required` return value;
- the Cloudflare Pages packaging and static-asset routing;
- README claims against the actual implementation.

### Claude and Google Chrome boundary

Claude products support standard MCP integrations, but that does not by itself prove support for tools registered by a webpage through WebMCP. Use Claude Code for repository review and use **Google Chrome with WebMCP enabled** for the live browser test unless the selected Claude client explicitly documents WebMCP support.

1. Use Claude Code for the source and judge-readiness audit.
2. Use ChatGPT's in-app browser or Google Chrome 149+ with WebMCP enabled for the live three-tool run.
3. Preserve the live recording as the browser-level evidence.

Do not describe a source review, ordinary browser automation, or standard MCP-server connection as a successful WebMCP test.

## Evidence recording

Record the public URL, agent conversation, readable tool names, and resulting Patchwork UI in the same sequence. The recording should show:

1. `search_neighborhood_projects` followed by visible results.
2. `build_action_plan` followed by the matching Weekend Plan and total hours.
3. `pledge_support` followed by `confirmation_required`.
4. The message that no pledge was submitted.
5. A final manual edit proving the person retains control of the plan.

Keep credentials, personal notifications, profiles, and unrelated tabs out of the recording.

## Pass criteria

- [ ] Public Pages URL loads with production CSS.
- [ ] All three tool names are discoverable or visibly invoked.
- [ ] Search and planning update shared visible state.
- [ ] Agent-selected records match the displayed plan.
- [ ] Total hours are correct.
- [ ] Pledge remains a draft.
- [ ] Human confirmation is explicitly required.
- [ ] No errors appear in the interaction.
- [ ] Evidence recording includes audio and remains under three minutes.

## Useful references

- [OpenAI WebMCP showcase](https://developers.openai.com/showcase?view=webmcp-apps)
- [Anthropic MCP documentation](https://docs.anthropic.com/en/docs/mcp)
- [Claude Code setup](https://docs.anthropic.com/en/docs/claude-code/getting-started)
