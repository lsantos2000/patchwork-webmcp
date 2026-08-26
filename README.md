# Patchwork

**Small actions. Shared momentum.**

Patchwork is a WebMCP-powered neighbourhood action exchange. It helps people discover local projects, ask an agent to assemble a realistic plan, and keep final commitments explicitly human-approved.

Built for the **WebMCP Challenge** (submissions close September 3 at 1:00 PM PT).

## Why WebMCP

Local opportunity sites contain useful information, but people still have to search, compare schedules, and translate good intentions into a practical plan. Patchwork exposes the same project data and actions that people see in the interface as structured WebMCP tools. A compatible agent can therefore search by interest or time, combine projects into a plan, and draft a pledge without scraping or guessing.

The critical boundary is deliberate: the agent can prepare a pledge, but `pledge_support` returns `confirmation_required`. The person remains responsible for every commitment.

## What people and agents can do together

- Browse and filter current neighbourhood projects in a friendly visual interface.
- Ask an agent to find opportunities that match a topic, location, or time budget.
- Turn several opportunities into one achievable weekend plan.
- Draft a contribution while preserving a clear human confirmation step.
- See and edit the same plan whether it was assembled manually or by an agent.

## WebMCP tools

Patchwork registers three tools with `document.modelContext.registerTool(...)` in `app/page.tsx`:

| Tool | Purpose | Safety behavior |
| --- | --- | --- |
| `search_neighborhood_projects` | Search by free text and maximum hours | Read-only |
| `build_action_plan` | Combine project IDs and calculate total time | Read-only |
| `pledge_support` | Prepare a contribution pledge | Returns `confirmation_required`; does not submit |

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm 10 or newer

### Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To test the WebMCP tools, use ChatGPT's in-app browser or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled.

### Production build

```bash
npm run build
```

The application is designed for the Cloudflare runtime and is deployed to Cloudflare Pages for the challenge.

## Publish the repository safely

The included PowerShell helper checks the staged source for common credential patterns before it commits or pushes:

```powershell
.\scripts\publish-github.ps1 -RepoName patchwork-webmcp -Owner lsantos2000
```

It requires GitHub CLI (`gh`) and will request authorization if needed. The repository is created as public by default. No token is stored in the script or repository.

## Claude Code workspace

The repository includes a judge-focused `.claude/` workspace with:

- `webmcp-architect`, `hackathon-judge`, and isolated `release-engineer` subagents
- reusable `webmcp-review` and `judge-readiness` skills
- shared WebMCP, safety, accessibility, and release rules
- `/judge-swarm` and `/release-check` project commands
- conservative permissions that deny secret files and destructive Git operations

Run `/judge-swarm` in Claude Code for independent parallel reviews. The release engineer uses worktree isolation so implementation tasks do not modify the main checkout until reviewed.

## Submission checklist

- [x] Responsive, interactive web experience
- [x] Discoverable WebMCP tools
- [x] Human confirmation before consequential action
- [x] Cloudflare-compatible production build
- [x] Public source with setup instructions
- [x] Open-source license
- [ ] Public live URL verified in a WebMCP-compatible browser
- [ ] Public demo video under three minutes
- [ ] Devpost text and links submitted

## Suggested demo flow (under three minutes)

1. Explain the problem: local needs are fragmented and planning takes effort.
2. Show manual search and adding a project to the weekend plan.
3. Ask the agent to find projects within a time budget using `search_neighborhood_projects`.
4. Build a plan with `build_action_plan` and show it reflected in the experience.
5. Call `pledge_support` and highlight that confirmation is required.
6. Close with the shared-agency idea: agents reduce coordination work; people keep agency.

## License

MIT — see [LICENSE](LICENSE).
