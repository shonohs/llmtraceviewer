import sys
import uvicorn
from pathlib import Path
from llmtraceviewer.server import create_app
import socket
import os
import glob


def find_free_port(start_port=8000, max_tries=100):
    for port in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"No free port found in range {start_port}-{start_port+max_tries-1}")

def main():
    if len(sys.argv) != 2:
        print("Usage: llmtraceviewer <log_file_or_directory>")
        sys.exit(1)
    input_path = Path(sys.argv[1])
    log_files = []
    if input_path.is_file():
        log_files = [str(input_path.resolve())]
        base_dir = str(input_path.parent.resolve())
    elif input_path.is_dir():
        log_files = [str(p) for p in input_path.rglob("*.log")]
        if not log_files:
            print(f"No .log files found in directory: {input_path}")
            sys.exit(1)
        base_dir = str(input_path.resolve())
    else:
        print(f"File or directory not found: {input_path}")
        sys.exit(1)
    app = create_app(log_files, base_dir=base_dir)
    port = find_free_port()
    print(f"Starting server at http://127.0.0.1:{port} ...")
    uvicorn.run(app, host="127.0.0.1", port=port)
