import json
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

# Keep the exact VieNeu v3 Turbo ONNX path/voice, but constrain CPU resources
# for small production containers. INT8 is VieNeu's official CPU default.
tts = Vieneu(backend='onnx', precision='int8', threads=1)
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
    subtitle_segments = []
    local_frame = 0

    for seg in segments:
        audio = np.asarray(tts.infer(seg, voice=voice), dtype=np.float32)
        if audio.size == 0:
            raise SystemExit(f'Scene {i+1}: VieNeu returned empty audio')

        audio_frames = max(1, int(round(len(audio) / SR * FPS)))
        subtitle_segments.append({
            'text': seg,
            'start': local_frame,
            'duration': audio_frames,
        })
        local_frame += audio_frames

        pieces.append(audio)
        gap = np.zeros(int(GAP * SR), dtype=np.float32)
        pieces.append(gap)
        local_frame += int(round(GAP * FPS))

    scene_audio = np.concatenate(pieces)
    all_audio.append(scene_audio)

    duration_frames = max(1, int(round(len(scene_audio) / SR * FPS)))
    scene['start'] = frame_cursor
    scene['duration'] = duration_frames
    scene['subtitle_segments'] = subtitle_segments
    frame_cursor += duration_frames

full = np.concatenate(all_audio)
sf.write(AUDIO, full, SR)
plan['audio'] = 'voice.wav'
plan['fps'] = FPS
OUT.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Prepared {len(scenes)} scenes, {len(full)/SR:.2f}s, voice={voice}')
