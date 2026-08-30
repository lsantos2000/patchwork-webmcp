"""Generate local synthetic narration using Piper and a supplied voice model."""
import argparse
import json
from pathlib import Path
import wave
from piper import PiperVoice, SynthesisConfig

parser = argparse.ArgumentParser()
parser.add_argument('--model', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
scenes = json.loads((root/'resources/video/demo-scenes.json').read_text(encoding='utf-8'))
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)
voice = PiperVoice.load(args.model)
config = SynthesisConfig(length_scale=0.88)
total = 0
for i, scene in enumerate(scenes, 1):
    path = out/f'scene-{i:02}.wav'
    with wave.open(str(path), 'wb') as wav:
        voice.synthesize_wav(scene['narration'], wav, syn_config=config)
    with wave.open(str(path)) as wav:
        duration = wav.getnframes()/wav.getframerate()
    total += duration
    print(f'Scene {i}: {duration:.2f}s', flush=True)
print(f'Total speech: {total:.2f}s', flush=True)
