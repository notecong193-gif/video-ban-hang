import json
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client

FPS = 30
SR = 48000
GAP = 0.22
SRC = Path('public/video.json')
OUT = Path('public/render.json')
AUDIO = Path('public/voice.wav')
SPACE = 'pnnbao-ump/VieNeu-TTS-v3-Turbo'

plan = json.loads(SRC.read_text(encoding='utf-8'))
scenes = plan.get('scenes', [])
if not scenes:
    raise SystemExit('video.json must contain scenes')

voice = plan.get('voice', 'Phạm Tuyên')
client = Client(SPACE, verbose=False)
all_audio = []
frame_cursor = 0


def remote_tts(text: str) -> np.ndarray:
    result = client.predict(
        text,
        voice,
        None,
        0.8,
        25,
        0.95,
        1.2,
        300,
        256,
        api_name='/synthesize',
    )
    audio_result = result[0] if isinstance(result, (tuple, list)) else result
    if isinstance(audio_result, dict):
        path = audio_result.get('path') or audio_result.get('name')
    else:
        path = str(audio_result)
    if not path:
        raise RuntimeError('VieNeu Space returned no audio file')
    audio, sr = sf.read(path, dtype='float32')
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    if sr != SR:
        raise RuntimeError(f'VieNeu Space sample rate mismatch: {sr} != {SR}')
    return np.asarray(audio, dtype=np.float32)


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
        audio = remote_tts(seg)
        if audio.size == 0:
            raise SystemExit(f'Scene {i+1}: VieNeu returned empty audio')

        audio_frames = max(1, int(round(len(audio) / SR * FPS)))
        subtitle_segments.append({'text': seg, 'start': local_frame, 'duration': audio_frames})
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
print(f'Prepared {len(scenes)} scenes, {len(full)/SR:.2f}s, voice={voice}, source={SPACE}')
