"""Render an honest, narrated still-frame evidence walkthrough, not a screen recording.

Requires Pillow, ffmpeg (H.264/AAC), and WAVs made by narrate-demo.py.
All generated material stays local. Existing submission video is preserved.
"""
import argparse
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import wave
from PIL import Image, ImageDraw, ImageFont, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--audio', required=True)
parser.add_argument('--work', required=True)
parser.add_argument('--speech-speed', type=float, default=1.08)
args = parser.parse_args()
if not 0.8 <= args.speech_speed <= 1.25:
    parser.error('Speech speed must stay between 0.8 and 1.25 for intelligibility.')
root = Path(__file__).resolve().parents[1]
video = root / 'resources/video'
work = Path(args.work)
work.mkdir(parents=True, exist_ok=True)
slide_images = root / 'resources/images/demo-walkthrough'
slide_images.mkdir(parents=True, exist_ok=True)
scenes = json.loads((video / 'demo-scenes.json').read_text(encoding='utf-8'))
evidence = json.loads((video / 'demo-assets/webmcp-evidence.json').read_text(encoding='utf-8'))
calls = {item['name']: item for item in evidence['calls']}
cream, ink, lime, coral = '#F6F2E8', '#183128', '#C8F135', '#FF7358'
fontdir = Path('C:/Windows/Fonts')
def font(size, bold=False, mono=False):
    return ImageFont.truetype(str(fontdir / ('consola.ttf' if mono else 'arialbd.ttf' if bold else 'arial.ttf')), size)
def wrap(draw, text, f, width):
    lines = []
    for para in text.split('\n'):
        line = ''
        for word in para.split():
            candidate = (line + ' ' + word).strip()
            if draw.textlength(candidate, font=f) > width and line:
                lines.append(line)
                line = word
            else:
                line = candidate
        lines.append(line)
    return lines
def lines_at(draw, text, xy, f, color, width, spacing):
    x,y = xy
    for line in wrap(draw, text, f, width):
        draw.text((x,y),line,font=f,fill=color)
        y += spacing
    return y
def stamp(seconds):
    ms = round(seconds*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if result.returncode:
        raise RuntimeError(result.stderr[-6000:])
    return result

durations = []
for i in range(len(scenes)):
    with wave.open(str(Path(args.audio)/f'scene-{i+1:02}.wav')) as wav:
        durations.append(math.ceil((wav.getnframes()/wav.getframerate()/args.speech_speed+1.0)*24)/24)
if sum(durations) >= 178:
    raise RuntimeError(f'Narration is too long ({sum(durations):.1f}s). Shorten the script; do not truncate speech.')

subtitles, script, clock = [], ['# Patchwork demo narration\n\nEdited browser-evidence walkthrough with synthetic narration.\n'], 0.0
walkthrough = ['# Patchwork — narrated demo walkthrough\n\nIndividual project by Leonardo Santos-Macias. Duration: approximately **2:57** (under 3 minutes).\n\nThis document pairs all 11 corrected video slides with the complete spoken narration. Slide numbering runs from 01 to 11; section labels do not use a competing counter. Images load from `../images/demo-walkthrough/`.\n\nThis is edited still-frame browser evidence with synthetic narration, not a continuous screen recording. Native WebMCP result excerpts were captured from the live application; the separate approval control was exercised using browser automation.\n\n[Watch the MP4](Patchwork_WebMCP_Judges_Demo.mp4) · [Captions](Patchwork_WebMCP_Judges_Demo.srt) · [Production notes](DEMO_PRODUCTION.md) · [Technical validation](demo-validation.json)\n\nThe owner uploaded the final female-narrated video to [YouTube](https://youtu.be/c_RzlVBHSpg). It credits Leonardo Santos-Macias and uses the cleaned-up slides. Use this link for the submission; confirm Public visibility and logged-out playback.\n']
for i, (scene, duration) in enumerate(zip(scenes, durations)):
    im = Image.new('RGB',(1920,1080),cream)
    d = ImageDraw.Draw(im)
    d.rectangle((0,0,1920,12),fill=lime)
    d.rounded_rectangle((64,49,116,101),radius=18,fill=ink)
    d.text((80,50),'p',font=font(42,True),fill=lime)
    d.text((132,62),'patchwork',font=font(30,True),fill=ink)
    d.text((1050,67),'WEBMCP CHALLENGE  /  INDIVIDUAL PROJECT',font=font(21,True),fill=ink)
    d.line((64,130,1856,130),fill='#CDD3C6',width=2)
    d.text((64,183),scene['tag'],font=font(22,True),fill='#47745F')
    y=lines_at(d,scene['title'],(64,240),font(62,True),ink,640,75)
    y+=65
    for point in scene['points']:
        d.ellipse((66,y+8,78,y+20),fill=coral)
        y=lines_at(d,point,(99,y),font(30),ink,520,42)+28
    d.rounded_rectangle((729,177,1864,938),radius=18,fill='#DCDCCD')
    d.rounded_rectangle((719,167,1854,928),radius=18,fill=ink)
    if scene.get('image'):
        screenshot=Image.open(video/scene['image']).convert('RGB')
        screenshot.thumbnail((1103,693),Image.Resampling.LANCZOS)  # Never enlarge a capture beyond its native pixels.
        im.paste(screenshot,(735+(1103-screenshot.width)//2,185+(693-screenshot.height)//2))
    else:
        code=scene.get('code','')
        if scene.get('evidence') == 'search_neighborhood_projects':
            c=calls[scene['evidence']]
            code='ACTUAL TOOL INPUT\n'+json.dumps(c['input'],indent=2)+'\n\nRESULT EXCERPT\n'+json.dumps({'project_ids':[p['id'] for p in c['result']['projects']], 'shared_ui_updated':c['result']['shared_ui_updated']},indent=2)
        elif scene.get('evidence') == 'pledge_support':
            c=calls[scene['evidence']]
            code='ACTUAL TOOL RESULT\n\n'+json.dumps(c['result'],indent=2)
        lines_at(d,code,(760,215),font(29,mono=True),'#F6F2E8',1050,43)
        d.text((760,886),'LIVE SOURCE: patchwork-webmcp.pages.dev',font=font(21,True),fill=lime)
    d.text((64,1020),'patchwork-webmcp.pages.dev',font=font(25,True),fill=ink)
    d.text((1540,1020),f'{i+1:02} / {len(scenes):02}     PATCHWORK',font=font(22,True),fill=ink)
    d.rectangle((0,1070,int(1920*(i+1)/len(scenes)),1080),fill=coral)
    frame=work/f'scene-{i+1:02}.png'
    im.save(frame)
    im.save(slide_images / frame.name)
    if i==0:
        im.save(video/'Patchwork_WebMCP_Judges_Demo_Poster.png')
    script.append(f'\n## {stamp(clock)} — {scene["tag"]}\n\n{scene["narration"]}\n')
    walkthrough.append(f'\n## {i+1:02} / {len(scenes):02} — {scene["tag"]}\n\nStarts at `{stamp(clock)}`.\n\n![Slide {i+1:02}: {scene["title"].replace(chr(10), " ")}](../images/demo-walkthrough/{frame.name})\n\n### Audio transcript\n\n{scene["narration"]}\n')
    words=scene['narration'].split()
    chunks=[' '.join(words[n:n+12]) for n in range(0,len(words),12)]
    speaking=duration-1.0
    offset=clock
    for chunk in chunks:
        length=speaking*len(chunk.split())/len(words)
        subtitles.append(f'{len(subtitles)+1}\n{stamp(offset)} --> {stamp(offset+length)}\n{chunk}\n')
        offset+=length
    segment=work/f'segment-{i+1:02}.mp4'
    run([args.ffmpeg,'-y','-hide_banner','-loglevel','error','-loop','1','-i',str(frame),'-i',str(Path(args.audio)/f'scene-{i+1:02}.wav'),'-t',str(duration),'-vf',f'fade=t=in:st=0:d=0.25,fade=t=out:st={duration-0.25}:d=0.25','-af',f'atempo={args.speech_speed},apad','-r','24','-c:v','libx264','-threads','4','-preset','fast','-tune','stillimage','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k',str(segment)])
    print(f'Scene {i+1}/{len(scenes)}: {duration:.2f}s',flush=True)
    clock+=duration

manifest=work/'concat.txt'
manifest.write_text('\n'.join("file '"+(work/f'segment-{i+1:02}.mp4').as_posix()+"'" for i in range(len(scenes))),encoding='utf-8')
output=video/'Patchwork_WebMCP_Judges_Demo.mp4'
run([args.ffmpeg,'-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(manifest),'-c','copy','-movflags','+faststart',str(output)])
(video/'Patchwork_WebMCP_Judges_Demo.srt').write_text('\n'.join(subtitles),encoding='utf-8')
(video/'DEMO_NARRATION.md').write_text('\n'.join(script),encoding='utf-8')
media = root / 'resources/media'
media.mkdir(parents=True, exist_ok=True)
shutil.copy2(output, media / output.name)
walkthrough.append("\n## Watch the complete video\n\n[![Watch the Patchwork demo on YouTube](Patchwork_WebMCP_Judges_Demo_Poster.png)](https://youtu.be/c_RzlVBHSpg)\n\n- [Watch on YouTube](https://youtu.be/c_RzlVBHSpg)\n- [Open or download the saved MP4](../media/Patchwork_WebMCP_Judges_Demo.mp4)\n- [Download captions](Patchwork_WebMCP_Judges_Demo.srt)\n\nDuration: **2:57**. The `resources/media/` copy preserves the latest locally rendered, numbering- and creator-name-corrected video; it is not a download of YouTube's transcoded version. Markdown viewers may offer playback or download; use YouTube for reliable streaming.\n\nThe video is an edited screenshot walkthrough with synthetic narration and actual WebMCP result excerpts, not a continuous screen recording. The local opening slide now credits Leonardo Santos-Macias. The final female-narrated version is available at https://youtu.be/c_RzlVBHSpg (owner-supplied upload).\n")
(video/'DEMO_WALKTHROUGH.md').write_text('\n'.join(walkthrough),encoding='utf-8')
probe=run([args.ffmpeg,'-hide_banner','-i',str(output),'-af','volumedetect','-f','null','-'])
match=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',probe.stderr)
actual=sum(float(value)*factor for value,factor in zip(match.groups(),(3600,60,1))) if match else None
report={'file':output.name,'duration_seconds':actual,'under_three_minutes':actual is not None and actual<180,'resolution':'1920x1080','video_codec':'H.264','audio_codec':'AAC','voice':'Piper en_US-ljspeech-high, female synthetic narration; public-domain LJ Speech dataset','scene_count':len(scenes),'format':'Edited still-frame walkthrough with actual WebMCP result excerpts, not a continuous screen recording','audio_measurements':re.findall(r'(?:mean|max)_volume: [^\n]+',probe.stderr),'review_required':'Owner supplied the uploaded video URL: https://youtu.be/c_RzlVBHSpg. Verify Public visibility, playback, and captions on YouTube; this script does not upload videos.'}
(video/'demo-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
if not report['under_three_minutes']:
    raise RuntimeError('Final duration validation failed')
print(json.dumps(report,indent=2),flush=True)
