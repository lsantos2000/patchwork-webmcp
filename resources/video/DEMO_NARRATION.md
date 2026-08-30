# Patchwork demo narration

Edited browser-evidence walkthrough with synthetic narration.


## 00:00:00,000 — PATCHWORK / WEBMCP CHALLENGE

Patchwork turns good intentions into a practical neighbourhood plan. I built this individual project to explore an open web where agents help people organize and create, while the person keeps the final decision.


## 00:00:12,667 — THE PROBLEM

Finding a way to help means comparing opportunities, understanding the time involved, and deciding what to do next. Patchwork brings those steps into one visual workspace. The starter catalogue uses demonstration projects, not a verified live neighbourhood feed.


## 00:00:27,833 — WHY WEBMCP

The website exposes four structured Web M C P tools to an external browser agent. There is no embedded chatbot. These tools were discovered and called on the public Cloudflare site. This video is an edited walkthrough of the captured results, not a continuous screen recording.


## 00:00:44,125 — ACTUAL TOOL CALL

For a gardening and food request, the agent calls search neighborhood projects with a three hour per-project limit. The website returns the orchard and pantry records and updates the visible search. The agent works with project identifiers and structured data, rather than guessing where to click.


## 00:01:00,958 — SHARED REACT STATE

Next, build action plan selects the orchard and pantry: two projects, three hours total. The tool updates the same React state used by the page. The person can inspect or remove projects manually. The agent chooses the combination; the tool reports its total.


## 00:01:16,708 — PROPOSE A LOCAL NEED

The agent can also draft a new need: Map accessible shade. The proposal tool returns human approval required, with published set to false. Patchwork shows the draft beside Reject and Approve controls. A tool call alone does not add it to the catalogue.


## 00:01:31,708 — REVIEW AND RESTORE

For this demonstration, browser automation exercises the separate approval button. The draft then joins the local catalogue and plan. After a reload, it is still there. Publishing here means saving on this browser and device, not sharing with other users or a community database.


## 00:01:48,250 — SAFETY BOUNDARY

The pledge tool prepares a contribution draft and returns confirmation required. It does not submit anything or contact an organizer. This prototype deliberately stops at drafting. That limitation is explicit, so neither the agent nor the demonstration implies a real-world commitment was made.


## 00:02:04,792 — IMPLEMENTATION

Implementation uses React and TypeScript, built with Vinext for Cloudflare Pages. A reusable hook registers tool names, descriptions, input schemas, and handlers, with a navigator compatibility fallback and cleanup. Tool handlers update shared state; validated local storage restores supported data.


## 00:02:22,042 — TESTING AND OPEN SOURCE

Thirty-nine automated checks passed in the previous validated run, covering state, persistence, approval, and interface behavior. Those tests use a model-context shim. Native browser tool calls provide separate compatibility evidence. Codex helped with implementation, debugging, testing, documentation, and this walkthrough.


## 00:02:40,875 — PATCHWORK / TRY IT YOURSELF

Open the live site in a Web M C P capable browser and try the documented prompts. The source, MIT license, and testing guide are public. Patchwork shows how agents can reduce coordination work while people keep the final decision. Small actions. Shared momentum.
