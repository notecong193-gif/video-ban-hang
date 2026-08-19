import asyncio, json, os, subprocess
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / 'public'
OUT = ROOT / 'out'
LOCK = asyncio.Lock()
API_KEY = os.environ.get('VIDEO_RENDER_API_KEY', '')

app = FastAPI(title='Skill Video Ve Tay Render API', version='1.0.0')

class RenderRequest(BaseModel):
    title: str
    subtitle: str | None = None
    voice: str = 'Phạm Tuyên'
    scenes: list[dict]

@app.get('/health')
def health():
    return {'ok': True}

def require_key(x_api_key: str | None):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail='Unauthorized')

@app.post('/render')
async def render_video(req: RenderRequest, x_api_key: str | None = Header(default=None)):
    require_key(x_api_key)
    async with LOCK:
        try:
            PUBLIC.mkdir(exist_ok=True)
            OUT.mkdir(exist_ok=True)
            for p in [PUBLIC/'render.json', PUBLIC/'voice.wav', OUT/'video.mp4']:
                if p.exists():
                    p.unlink()

            plan = req.model_dump(exclude_none=True)
            (PUBLIC/'video.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')

            env = os.environ.copy()
            subprocess.run(['python3', 'scripts/prepare_voice.py'], cwd=ROOT, env=env, check=True)
            subprocess.run(['npm', 'run', 'render'], cwd=ROOT, env=env, check=True)

            video = OUT/'video.mp4'
            if not video.exists() or video.stat().st_size == 0:
                raise RuntimeError('Render completed without MP4 output')
            return FileResponse(video, media_type='video/mp4', filename='video-ve-tay.mp4')
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f'Render step failed with exit code {e.returncode}')
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
