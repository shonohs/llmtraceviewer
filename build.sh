#!/bin/zsh
# Build script for llmtraceviewer: builds Next.js frontend and Python package
set -e

# Build Next.js frontend
cd frontend
npm install
npm run build
cd ..

# Copy frontend build output into Python package static directory
rm -rf llmtraceviewer/_frontend_out
mkdir -p llmtraceviewer/_frontend_out
cp -r frontend/out/* llmtraceviewer/_frontend_out/

# Build Python package (wheel and sdist)
pip install --upgrade build
python -m build

echo "Build complete. Frontend static files are in llmtraceviewer/_frontend_out, Python package is in dist/."
