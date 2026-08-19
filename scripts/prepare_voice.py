import json, os, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from vieneu import Vieneu

FPS = 30
SR = 48000
GAP = 0.22
SRC = Path('public/video.json')
OUT = Path('public/render.json')
AUDIO = Path('public/voice.wav')

plan = json.loads(SRC.read_text(encoding='utf-8'))
scenes = plan.get('scenes', [])
if not scenes:
    raise SystemExit('video.json must contain scenes')

tts = Vieneu(backend='onnx')
voice = plan.get('voice', 'Phạm Tuyên')
all_audio = []
frame_cursor = 0

for i, scene in enumerate(scenes):
    segments = scene.get('tts_segments') or [scene.get('narration', '')]
    if not segments or any(len(x.strip()) == 0 for x in segments):
        raise SystemExit(f'Scene {i+1}: empty TTS segment')
    for seg in segments:
        if len(seg) >= 100:
            raise SystemExit(f'Scene {i+1}: TTS segment must be under 100 characters: {seg!r}')

    pieces = []
    for seg in segments:
        audio = np.asarray(tts.infer(seg, voice=voice), dtype=np.float32)
        pieces.append(audio)
        pieces.append(np.zeros(int(GAP * SR), dtype=np.float32))
    scene_audio = np.concatenate(pieces)
    all_audio.append(scene_audio)

    duration_frames = max(1, int(round(len(scene_audio) / SR * FPS)))
    scene['start'] = frame_cursor
    scene['duration'] = duration_frames
    frame_cursor += duration_frames

full = np.concatenate(all_audio)
sf.write(AUDIO, full, SR)
plan['audio'] = 'voice.wav'
plan['fps'] = FPS
OUT.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Prepared {len(scenes)} scenes, {len(full)/SR:.2f}s, voice={voice}')
