from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
from typing import List, Union
import os

def create_app(log_files: Union[str, List[str]], base_dir: str = None) -> FastAPI:
    app = FastAPI()
    if isinstance(log_files, str):
        log_files = [log_files]
    log_files = [str(Path(f).resolve()) for f in log_files]
    if base_dir is None:
        if log_files:
            base_dir = str(Path(log_files[0]).parent)
        else:
            base_dir = ""
    # Map relative path (from user-provided base_dir) to absolute path
    log_file_map = {os.path.relpath(f, base_dir): f for f in log_files}

    @app.get("/api/files")
    async def list_files():
        return JSONResponse(content=list(log_file_map.keys()))

    @app.get("/api/logs")
    async def get_logs(filename: str = None):
        if not log_file_map:
            return JSONResponse(content=[], status_code=404)
        if filename is None:
            # Default: use the first file
            file_path = list(log_file_map.values())[0]
        else:
            file_path = log_file_map.get(filename)
            if not file_path:
                return JSONResponse(content={"error": "File not found"}, status_code=404)
        logs = []
        with open(file_path) as f:
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
