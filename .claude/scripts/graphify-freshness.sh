#!/usr/bin/env bash
# Graphify freshness checker — runs on SessionStart and after `git pull` /
# `git merge` / `git checkout` / `git switch`.
# Compares each tracked file's mtime against graphify-out/manifest.json.
# If any file is stale, touches graphify-out/.needs_update so Claude knows
# to run `/graphify ./ --update` before reading code/docs.
#
# Fast (<1s), silent on no-op, exits 0 always so it never blocks the session.
# No-op if graphify-out/ doesn't exist or no suitable Python is installed.

set -u

# Self-locating project root: prefer $CLAUDE_PROJECT_DIR (set by Claude Code
# hooks), else resolve relative to this script (.claude/scripts/ -> repo root).
PROJECT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
PY_FILE="$PROJECT/graphify-out/.graphify_python"

# If graphify isn't set up yet, exit silently.
[ -d "$PROJECT/graphify-out" ] || exit 0

# Resolve Python interpreter (graphify needs 3.10+)
if [ -f "$PY_FILE" ] && [ -x "$(cat "$PY_FILE")" ]; then
  PY=$(cat "$PY_FILE")
else
  PY=$(command -v python3 || true)
fi
[ -n "${PY:-}" ] && [ -x "$PY" ] || exit 0
"$PY" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)' 2>/dev/null || exit 0

cd "$PROJECT" || exit 0

"$PY" - <<'PYEOF' 2>/dev/null || true
import json
from pathlib import Path

manifest = Path("graphify-out/manifest.json")
flag = Path("graphify-out/.needs_update")

if not manifest.exists():
    raise SystemExit(0)

try:
    data = json.loads(manifest.read_text())
except Exception:
    raise SystemExit(0)

stale = 0
for f, mt in data.items():
    p = Path(f)
    try:
        if p.stat().st_mtime > mt:
            stale += 1
    except OSError:
        pass  # file was deleted — `--update` will prune it

if stale:
    flag.touch()
    print(f"[graphify-hook] {stale} file(s) changed since last graph build — run `/graphify ./ --update` before reading code/docs.")
elif flag.exists():
    flag.unlink()
PYEOF

exit 0
