# llmtraceviewer

A Python package and CLI tool to view LLM call traces from JSONL log files. It starts a local HTTP server and serves a Next.js frontend for interactive log exploration.

## Usage

```sh
llmtraceviewer <log_filename>
```

- Starts a FastAPI server
- Serves a Next.js frontend
- Provides an API endpoint for log data

## Requirements
- Python 3.8+
- Node.js (for Next.js frontend)

## Development
- Backend: FastAPI
- Frontend: Next.js (served as static files)
