import asyncio, json, os, subprocess, uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / 'public'
OUT = ROOT / 'out'
LOCK = asyncio.Lock()
JOBS: dict[str, dict] = {}

app = FastAPI(title='Skill Video Ve Tay Render API', version='2.0.0')

class RenderRequest(BaseModel):
    title: str
    subtitle: str | None = None
    voice: str = 'Phạm Tuyên'
    scenes: list[dict]

@app.get('/health')
def health():
    return {'ok': True}

@app.get('/video/latest.mp4')
def latest_video():
    video = OUT/'video.mp4'
    if not video.exists() or video.stat().st_size == 0:
        raise HTTPException(status_code=404, detail='No rendered video yet')
    return FileResponse(video, media_type='video/mp4', filename='video-ve-tay.mp4')

@app.get('/jobs/{job_id}')
def job_status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return job

async def _run_job(job_id: str, plan: dict):
    async with LOCK:
        try:
            JOBS[job_id] = {'status':'running'}
            PUBLIC.mkdir(exist_ok=True)
            OUT.mkdir(exist_ok=True)
            for p in [PUBLIC/'render.json', PUBLIC/'voice.wav', OUT/'video.mp4']:
                if p.exists():
                    p.unlink()
            (PUBLIC/'video.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')
            env = os.environ.copy()
            subprocess.run(['python3', 'scripts/prepare_voice.py'], cwd=ROOT, env=env, check=True)
            subprocess.run(['npm', 'run', 'render'], cwd=ROOT, env=env, check=True)
            video = OUT/'video.mp4'
            if not video.exists() or video.stat().st_size == 0:
                raise RuntimeError('Render completed without MP4 output')
            JOBS[job_id] = {'status':'done','video':'/video/latest.mp4'}
        except Exception as e:
            JOBS[job_id] = {'status':'failed','error':str(e)}

@app.post('/render')
async def render_video(req: RenderRequest):
    job_id = uuid.uuid4().hex
    plan = req.model_dump(exclude_none=True)
    JOBS[job_id] = {'status':'queued'}
    asyncio.create_task(_run_job(job_id, plan))
    return {'job_id':job_id,'status':'queued','status_url':f'/jobs/{job_id}'}
