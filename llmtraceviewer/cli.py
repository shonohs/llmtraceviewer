import sys
import uvicorn
from pathlib import Path
from llmtraceviewer.server import create_app
import socket


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
        print("Usage: llmtraceviewer <log_filename>")
        sys.exit(1)
    log_filename = sys.argv[1]
    if not Path(log_filename).is_file():
        print(f"File not found: {log_filename}")
        sys.exit(1)
    app = create_app(log_filename)
    port = find_free_port()
    print(f"Starting server at http://127.0.0.1:{port} ...")
    uvicorn.run(app, host="127.0.0.1", port=port)
