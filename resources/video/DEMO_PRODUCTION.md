# Revised judging demo

Refreshed September 1, 2026, for Leonardo Santos-Macias's **individual submission**. No teammates or invitations are involved.

The final video and images credit **Leonardo Santos-Macias** and cover the negotiated-planning extension. The female-narrated MP4 is approximately 2:31 and is public at [https://youtu.be/so9sDOxzeJY](https://youtu.be/so9sDOxzeJY).

## Deliverables

- [Complete walkthrough: slide images and full audio transcript](DEMO_WALKTHROUGH.md)
- [Revised narrated MP4](Patchwork_WebMCP_Judges_Demo.mp4)
- [Timestamped narration script](DEMO_NARRATION.md)
- [Caption file](Patchwork_WebMCP_Judges_Demo.srt)
- [Copy-ready YouTube description](YOUTUBE_DESCRIPTION.md)
- [Technical validation](demo-validation.json)
- [Scene source](demo-scenes.json)
- [Native WebMCP inputs and results](demo-assets/webmcp-evidence.json)

This is an **edited still-frame browser-evidence walkthrough with synthetic narration**, not a continuous screen recording. Captured website states and actual native WebMCP result excerpts demonstrate search, shared planning, proposal review, local persistence, and draft-only pledges. The approval button was exercised with browser automation; this is not evidence that a human personally clicked it. The opening catalogue screenshots come from the existing resource set; the new workflow captures and tool results were recorded on August 30.

`Patchwork_WebMCP_Judges_Demo.mp4` is the only repository MP4 and matches the final published cut. Older short-demo MP4s and duplicate copies were removed.

## Owner review and upload

1. Play the entire MP4 with sound. Check pronunciation, timing, legibility, and accuracy against the current app.
2. Review the SRT captions: timings are approximated from narration chunks, not forced-aligned to speech.
3. Confirm the final duration is below 3:00. The validation JSON records the encoded duration and audio-volume measurements; it is not a substitute for listening.
4. If you want stronger continuous evidence, record a short uninterrupted browser segment showing an agent invoking the tools and the page changing. Replace the corresponding still-frame scenes while retaining the time limit.
5. Confirm the published [YouTube video](https://youtu.be/so9sDOxzeJY) remains **Public**, audible, captioned, and playable while logged out.

Suggested title: **Patchwork WebMCP — People and Agents, Shared Plans**.

Use the complete, judge-facing [copy-ready YouTube description](YOUTUBE_DESCRIPTION.md). It covers the original Discover flow, negotiated planning, all six workflow-scoped tools, human approval boundaries, testing prompts, prototype limitations, and the required public links.

## Reproduce locally

Use Python with Pillow and `piper-tts`, an FFmpeg build supporting H.264/AAC, and a locally downloaded Piper voice model. Dependencies, voice weights, intermediate WAV files, and rendering segments are not bundled in the repository.

```powershell
python scripts/narrate-demo.py --model C:/path/to/en_US-ljspeech-high.onnx --output C:/temp/patchwork-demo/audio
python scripts/render-demo.py --ffmpeg C:/path/to/ffmpeg.exe --audio C:/temp/patchwork-demo/audio --work C:/temp/patchwork-demo/render
```

Run from the repository root. Rendering refuses a planned duration of 178 seconds or longer rather than truncating narration. A pitch-preserving 1.08x audio tempo adjustment keeps the complete female narration within the requested time. It decodes the final output and checks encoded duration and audio levels. Rendering overwrites the **revised** demo artifacts, not the original video.

Narration now uses [Piper's en_US-ljspeech-high female voice](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/high). Its published model card identifies a public-domain LJ Speech dataset. Voice generation and encoding run locally. Codex assisted with the script, browser evidence, layout, and production tooling. This is a synthetic narrator, not a clone of Leonardo's voice.

The latest local export removes repeated production-disclosure labels from individual slides; these notes and the narration retain the production context. Original PNG captures are never enlarged beyond their native resolution. The 1920×1080 H.264 export uses CRF 14 to reduce compression artifacts. Lower-resolution source captures cannot acquire extra detail through re-encoding.

## Coverage

- The problem and why declared WebMCP operations fit it.
- What people and agents can do together in the same visible workspace.
- Actual native tool input/result excerpts, shared React state, and proposal review.
- Device-local persistence and the explicit no-submission pledge boundary.
- Registration, schemas, handlers, cleanup, automated-test limitations, public source, and MIT license.

No app deployment, YouTube publication, or Devpost submission is performed by these scripts.
