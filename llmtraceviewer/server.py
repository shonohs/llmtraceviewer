from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json


def create_app(log_filename: str) -> FastAPI:
    app = FastAPI()
    log_path = Path(log_filename)

    @app.get("/api/logs")
    async def get_logs():
        logs = []
        with log_path.open() as f:
            for line in f:
                if "LLMTRACE" not in line:
                    continue
                json_start = line.find("LLMTRACE:") + len("LLMTRACE:")
                json_str = line[json_start:].strip()
                try:
                    logs.append(json.loads(json_str))
                except Exception:
                    continue
        return JSONResponse(content=logs)

    # Serve static files (Next.js build output)
    static_dir = Path(__file__).parent / "_frontend_out"
    if static_dir.exists():
        app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

    return app
