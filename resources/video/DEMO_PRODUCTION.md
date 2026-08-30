# Revised judging demo

Prepared August 30, 2026, for Luis Santos's **individual submission**. No teammates or invitations are involved.

## Deliverables

- [Complete walkthrough: slide images and full audio transcript](DEMO_WALKTHROUGH.md)
- [Revised narrated MP4](Patchwork_WebMCP_Judges_Demo.mp4)
- [Timestamped narration script](DEMO_NARRATION.md)
- [Caption file](Patchwork_WebMCP_Judges_Demo.srt)
- [Technical validation](demo-validation.json)
- [Scene source](demo-scenes.json)
- [Native WebMCP inputs and results](demo-assets/webmcp-evidence.json)

This is an **edited still-frame browser-evidence walkthrough with synthetic narration**, not a continuous screen recording. Captured website states and actual native WebMCP result excerpts demonstrate search, shared planning, proposal review, local persistence, and draft-only pledges. The approval button was exercised with browser automation; this is not evidence that a human personally clicked it. The opening catalogue screenshots come from the existing resource set; the new workflow captures and tool results were recorded on August 30.

The owner uploaded this revision as a [new YouTube video](https://youtu.be/FXqJG7dmdKg). This is now the submission video link. The [original MP4](Patchwork_WebMCP.mp4) is retained only as an archive.

## Owner review and upload

1. Play the entire MP4 with sound. Check pronunciation, timing, legibility, and accuracy against the current app.
2. Review the SRT captions: timings are approximated from narration chunks, not forced-aligned to speech.
3. Confirm the final duration is below 3:00. The validation JSON records the encoded duration and audio-volume measurements; it is not a substitute for listening.
4. If you want stronger continuous evidence, record a short uninterrupted browser segment showing an agent invoking the tools and the page changing. Replace the corresponding still-frame scenes while retaining the time limit.
5. The revision has been uploaded: https://youtu.be/FXqJG7dmdKg. Confirm **Public** visibility, audible narration, and captions; open this new link logged out.
6. Use https://youtu.be/FXqJG7dmdKg in the Devpost submission. Repository references have been updated locally; the Devpost form must still be checked separately.

Suggested title: **Patchwork WebMCP — People and Agents, Shared Plans**.

Suggested description: Patchwork is an individual open-source project exploring how people and browser agents can search neighbourhood opportunities, build shared plans, and draft new needs for review. Live app: https://patchwork-webmcp.pages.dev/ — Source: https://github.com/lsantos2000/patchwork-webmcp — Challenge: https://webmcp.devpost.com/. This edited walkthrough uses captured browser states, actual WebMCP results, and synthetic narration. The prototype uses demo records and browser-local storage; pledges remain drafts.

## Reproduce locally

Use Python with Pillow and `piper-tts`, an FFmpeg build supporting H.264/AAC, and a locally downloaded Piper voice model. Dependencies, voice weights, intermediate WAV files, and rendering segments are not bundled in the repository.

```powershell
python scripts/narrate-demo.py --model C:/path/to/en_US-ljspeech-high.onnx --output C:/temp/patchwork-demo/audio
python scripts/render-demo.py --ffmpeg C:/path/to/ffmpeg.exe --audio C:/temp/patchwork-demo/audio --work C:/temp/patchwork-demo/render
```

Run from the repository root. Rendering refuses a planned duration of 178 seconds or longer rather than truncating narration. A pitch-preserving 1.08x audio tempo adjustment keeps the complete narration within the requested time. It decodes the final output and checks encoded duration and audio levels. Rendering overwrites the **revised** demo artifacts, not the original video.

Narration uses [Piper's en_US-ljspeech-high voice](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/high). Its model card identifies the [LJ Speech dataset](https://keithito.com/LJ-Speech-Dataset/) as public domain. Voice generation and encoding run locally. Codex assisted with the script, browser evidence, layout, and production tooling.

## Coverage

- The problem and why declared WebMCP operations fit it.
- What people and agents can do together in the same visible workspace.
- Actual native tool input/result excerpts, shared React state, and proposal review.
- Device-local persistence and the explicit no-submission pledge boundary.
- Registration, schemas, handlers, cleanup, automated-test limitations, public source, and MIT license.

No app deployment, YouTube publication, or Devpost submission is performed by these scripts.
