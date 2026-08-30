# Patchwork — narrated demo walkthrough

Individual project by Leonardo Santos-Macias. Duration: approximately **2:57** (under 3 minutes).

This document pairs all 11 corrected video slides with the complete spoken narration. Slide numbering runs from 01 to 11; section labels do not use a competing counter. Images load from `../images/demo-walkthrough/`.

This is edited still-frame browser evidence with synthetic narration, not a continuous screen recording. Native WebMCP result excerpts were captured from the live application; the separate approval control was exercised using browser automation.

[Watch the MP4](Patchwork_WebMCP_Judges_Demo.mp4) · [Captions](Patchwork_WebMCP_Judges_Demo.srt) · [Production notes](DEMO_PRODUCTION.md) · [Technical validation](demo-validation.json)

The owner uploaded the final female-narrated video to [YouTube](https://youtu.be/c_RzlVBHSpg). It credits Leonardo Santos-Macias and uses the cleaned-up slides. Use this link for the submission; confirm Public visibility and logged-out playback.


## 01 / 11 — PATCHWORK / WEBMCP CHALLENGE

Starts at `00:00:00,000`.

![Slide 01: Small actions. Shared momentum.](../images/demo-walkthrough/scene-01.png)

### Audio transcript

Patchwork turns good intentions into a practical neighbourhood plan. I built this individual project to explore an open web where agents help people organize and create, while the person keeps the final decision.


## 02 / 11 — THE PROBLEM

Starts at `00:00:12,667`.

![Slide 02: Start with a real problem.](../images/demo-walkthrough/scene-02.png)

### Audio transcript

Finding a way to help means comparing opportunities, understanding the time involved, and deciding what to do next. Patchwork brings those steps into one visual workspace. The starter catalogue uses demonstration projects, not a verified live neighbourhood feed.


## 03 / 11 — WHY WEBMCP

Starts at `00:00:27,833`.

![Slide 03: Declared tools. Visible results.](../images/demo-walkthrough/scene-03.png)

### Audio transcript

The website exposes four structured Web M C P tools to an external browser agent. There is no embedded chatbot. These tools were discovered and called on the public Cloudflare site. This video is an edited walkthrough of the captured results, not a continuous screen recording.


## 04 / 11 — ACTUAL TOOL CALL

Starts at `00:00:44,125`.

![Slide 04: Intent becomes a grounded search.](../images/demo-walkthrough/scene-04.png)

### Audio transcript

For a gardening and food request, the agent calls search neighborhood projects with a three hour per-project limit. The website returns the orchard and pantry records and updates the visible search. The agent works with project identifiers and structured data, rather than guessing where to click.


## 05 / 11 — SHARED REACT STATE

Starts at `00:01:00,958`.

![Slide 05: One plan. Two ways to help.](../images/demo-walkthrough/scene-05.png)

### Audio transcript

Next, build action plan selects the orchard and pantry: two projects, three hours total. The tool updates the same React state used by the page. The person can inspect or remove projects manually. The agent chooses the combination; the tool reports its total.


## 06 / 11 — PROPOSE A LOCAL NEED

Starts at `00:01:16,708`.

![Slide 06: Agents can create. People decide.](../images/demo-walkthrough/scene-06.png)

### Audio transcript

The agent can also draft a new need: Map accessible shade. The proposal tool returns human approval required, with published set to false. Patchwork shows the draft beside Reject and Approve controls. A tool call alone does not add it to the catalogue.


## 07 / 11 — REVIEW AND RESTORE

Starts at `00:01:31,708`.

![Slide 07: Approval is a separate step.](../images/demo-walkthrough/scene-07.png)

### Audio transcript

For this demonstration, browser automation exercises the separate approval button. The draft then joins the local catalogue and plan. After a reload, it is still there. Publishing here means saving on this browser and device, not sharing with other users or a community database.


## 08 / 11 — SAFETY BOUNDARY

Starts at `00:01:48,250`.

![Slide 08: A pledge draft. Not a commitment.](../images/demo-walkthrough/scene-08.png)

### Audio transcript

The pledge tool prepares a contribution draft and returns confirmation required. It does not submit anything or contact an organizer. This prototype deliberately stops at drafting. That limitation is explicit, so neither the agent nor the demonstration implies a real-world commitment was made.


## 09 / 11 — IMPLEMENTATION

Starts at `00:02:04,792`.

![Slide 09: Small interface. Clear contract.](../images/demo-walkthrough/scene-09.png)

### Audio transcript

Implementation uses React and TypeScript, built with Vinext for Cloudflare Pages. A reusable hook registers tool names, descriptions, input schemas, and handlers, with a navigator compatibility fallback and cleanup. Tool handlers update shared state; validated local storage restores supported data.


## 10 / 11 — TESTING AND OPEN SOURCE

Starts at `00:02:22,042`.

![Slide 10: Evidence, not just a feature list.](../images/demo-walkthrough/scene-10.png)

### Audio transcript

Thirty-nine automated checks passed in the previous validated run, covering state, persistence, approval, and interface behavior. Those tests use a model-context shim. Native browser tool calls provide separate compatibility evidence. Codex helped with implementation, debugging, testing, documentation, and this walkthrough.


## 11 / 11 — PATCHWORK / TRY IT YOURSELF

Starts at `00:02:40,875`.

![Slide 11: Less coordination. More human agency.](../images/demo-walkthrough/scene-11.png)

### Audio transcript

Open the live site in a Web M C P capable browser and try the documented prompts. The source, MIT license, and testing guide are public. Patchwork shows how agents can reduce coordination work while people keep the final decision. Small actions. Shared momentum.


## Watch the complete video

[![Watch the Patchwork demo on YouTube](Patchwork_WebMCP_Judges_Demo_Poster.png)](https://youtu.be/c_RzlVBHSpg)

- [Watch on YouTube](https://youtu.be/c_RzlVBHSpg)
- [Open or download the saved MP4](../media/Patchwork_WebMCP_Judges_Demo.mp4)
- [Download captions](Patchwork_WebMCP_Judges_Demo.srt)

Duration: **2:57**. The `resources/media/` copy preserves the latest locally rendered, numbering- and creator-name-corrected video; it is not a download of YouTube's transcoded version. Markdown viewers may offer playback or download; use YouTube for reliable streaming.

The video is an edited screenshot walkthrough with synthetic narration and actual WebMCP result excerpts, not a continuous screen recording. The local opening slide now credits Leonardo Santos-Macias. The final female-narrated version is available at https://youtu.be/c_RzlVBHSpg (owner-supplied upload).
