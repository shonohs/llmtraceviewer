# llmtraceviewer

A Python package and CLI tool to view LLM call traces from JSONL log files. It starts a local HTTP server for interactive log exploration.

## Usage

```sh
llmtraceviewer <log_filename or directory>
```

- Starts a FastAPI server
- Provides an API endpoint for log data
- You can specify a single log file or a directory containing log files

## Log File Format

The tool expects a JSONL (JSON Lines) log file where each relevant line contains the string `LLMTRACE:` followed by a JSON object. Only lines with `LLMTRACE:` are parsed.

**Each JSON object should have the following structure:**

```
{
  "type": "chat.completion",
  "messages": [
    { "role": "user", "content": "Hello, world!" },
    { "role": "assistant", "content": "Hi!" }
  ],
  "response_format": "text",
  "reasoning_effort": "low",
  "temperature": 0.7,
  "elapsed_time": 1.23,
  "response": "Hi!",
  "finish_reason": "stop",
  "completion_tokens": 10,
  "prompt_tokens": 8,
  "reasoning_tokens": 2,           // optional
  "start_time": 1713268800.0       // optional (Unix timestamp)
}
```

**Example log file:**

```
2024-04-16T12:00:00Z INFO LLMTRACE: {"type": "chat.completion", "messages": [{"role": "user", "content": "Hello, world!"}], "response_format": "text", "reasoning_effort": "low", "temperature": 0.7, "elapsed_time": 1.23, "response": "Hi!", "finish_reason": "stop", "completion_tokens": 10, "prompt_tokens": 8}
2024-04-16T12:00:01Z INFO LLMTRACE: {"type": "chat.completion", "messages": [{"role": "user", "content": "How are you?"}], "response_format": "text", "reasoning_effort": "medium", "temperature": 0.7, "elapsed_time": 1.45, "response": "I'm an AI, so I don't have feelings, but thanks for asking!", "finish_reason": "stop", "completion_tokens": 15, "prompt_tokens": 10, "reasoning_tokens": 3, "start_time": 1713268801.0}
```

- Each line can have arbitrary text before `LLMTRACE:`
- The JSON object after `LLMTRACE:` should contain the LLM call trace fields as shown above

## Requirements
- Python 3.8+
- Node.js (for development)

## Development
- Backend: FastAPI
- Frontend: Next.js (served as static files)
