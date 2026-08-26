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

## How to demo it

Use ChatGPT's in-app browser or WebMCP-enabled Chrome and open the live Pages URL.

### Human flow

1. Enter **“help in a garden”** in the main search and select **Explore**.
2. Patchwork scrolls to the matching orchard project, adds it to the weekend plan, and reports what changed.
3. Try **“donate food”**, **“fix clothes”**, or **“safer streets”** to demonstrate intent-aware matching.
4. Use the category chips and `+` buttons to edit the plan manually.
5. Select **Review my plan** to show the total hours and the no-commitment safety message.

### Agent flow

Give the browser agent this exact prompt:

> Find neighbourhood projects I can help with this weekend in three hours or less. I care about food access and the outdoors. Build a plan, but do not make any pledge without asking me first.

The expected tool sequence is:

1. `search_neighborhood_projects` finds relevant projects within the time budget.
2. `build_action_plan` returns selected records and total hours.
3. `pledge_support` prepares a draft and returns `confirmation_required`.
4. Point out that the agent reduced discovery and planning work while the person retained control of the commitment.

### Three-minute judging video

1. **0:00–0:25 — Problem:** local needs are fragmented and turning intent into a realistic plan takes work.
2. **0:25–0:55 — Human UX:** run “help in a garden,” show the match and editable weekend plan.
3. **0:55–1:50 — WebMCP proof:** use the exact agent prompt above and show the search and planning tools.
4. **1:50–2:20 — Safety:** call `pledge_support` and emphasize `confirmation_required`.
5. **2:20–2:45 — Implementation:** briefly show the three `document.modelContext.registerTool(...)` registrations in `app/page.tsx`.
6. **2:45–3:00 — Close:** “Agents reduce coordination work; people keep agency.”

## License

MIT — see [LICENSE](LICENSE).
