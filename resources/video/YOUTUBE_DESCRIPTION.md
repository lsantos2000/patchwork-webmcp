# YouTube description — copy-ready

Patchwork WebMCP — Small actions. Shared momentum.

What if an AI agent could help you support your neighborhood while building a plan you can see, edit, and control?

Patchwork is an individual, open-source project created by Leonardo Santos-Macias for the WebMCP Challenge. People and browser agents collaborate through the same visual workspace to discover local opportunities, assemble practical plans, negotiate revisions, and prepare actions for human review.

This video is also shared with a student learning community as an example of practical work completed while studying cloud technologies, web application development, and certification topics.

WHY WEBMCP?

WebMCP gives a compatible browser agent structured access to the capabilities a website deliberately exposes. The agent does not need to scrape the page or guess where to click. Its search results, plan proposals, and drafts update the same React state the person can inspect and control.

IN THIS DEMO

• Discover food-access and outdoor opportunities.
• Build an editable plan within a three-hour budget.
• Preserve the original Discover experience while opening a separate Plan together workspace.
• Pin human choices and ask the agent to propose a revision around visible constraints.
• Compare the proposed change before accepting or rejecting it.
• Review an action history without claiming hidden agent reasoning or identity.
• Draft a neighborhood project for approval or rejection.
• Restore the Discover plan after reload with browser-local storage.
• Prepare a pledge draft without submitting a real commitment.

TRY IT YOURSELF

Open the live application in ChatGPT's desktop in-app browser or Chrome 149+ with WebMCP testing enabled:

https://patchwork-webmcp.pages.dev/

In Discover, ask:

“Find food-access and outdoor projects. Choose a combination totaling no more than three hours and build my plan. Do not pledge anything.”

Then ask:

“Draft a two-hour Community project called Map accessible shade in West Commons. Do not publish it.”

Review the proposed project on the page. The agent prepares the draft; publication remains a separate human-controlled step.

In Plan together, pin a project, set a combined time budget, and ask:

“Review this workspace and propose a different plan that respects my pinned choices and time budget. Do not apply it for me.”

The agent may propose a revision, but only the person can select Accept revision.

HOW IT WORKS

Patchwork defines six WebMCP tools across two scoped workflows.

Discover:
• search_neighborhood_projects
• build_action_plan
• propose_neighborhood_project
• pledge_support

Plan together and Action history:
• get_workspace
• propose_plan_revision

Only the active workflow's tools are registered. Tool handlers connect directly to shared React state and return structured results. The application is built with React, TypeScript, and Vinext, deployed on Cloudflare Pages, and released under the MIT license.

HUMAN CONTROL

The agent can search, organize, and propose. It cannot silently publish a neighborhood project, accept its own plan revision, or make a pledge. Consequential actions remain visible and explicitly human-controlled.

PROTOTYPE BOUNDARIES

The starter projects are demonstration data. Discover plans and approved project drafts are stored only in the current browser, not shared across devices or users. The negotiated workspace is session-only. Pledges remain local drafts; nothing is sent to an organizer.

This is an edited browser-evidence walkthrough with synthetic narration and actual WebMCP result excerpts, not a continuous screen recording. Automated UI captures are supporting evidence and are not presented as proof of a native agent invocation.

EXPLORE PATCHWORK

Live application:
https://patchwork-webmcp.pages.dev/

Public source code:
https://github.com/lsantos2000/patchwork-webmcp

Browser testing guide:
https://github.com/lsantos2000/patchwork-webmcp/blob/main/resources/docs/browser-test.md

WebMCP Challenge:
https://webmcp.devpost.com/

Created by Leonardo Santos-Macias.
Individual submission. Development and demo production assisted by Codex. Gemini was also used during project development.

#WebMCP #OpenWeb #AI #OpenSource #HumanInTheLoop #Cloudflare
