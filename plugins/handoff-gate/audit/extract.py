"""Pull every final assistant reply from Claude Code transcripts into one JSONL file."""
import json, pathlib, sys

root = pathlib.Path.home() / ".claude" / "projects"
out = open(sys.argv[1], "w")
n_files = n_final = 0
for path in sorted(root.rglob("*.jsonl")):
    n_files += 1
    last_tools = []          # tool calls since the last real user message
    with open(path, errors="replace") as fh:
        for line in fh:
            try:
                row = json.loads(line)
            except ValueError:
                continue
            if row.get("isSidechain"):
                continue
            msg = row.get("message") or {}
            content = msg.get("content")
            if row.get("type") == "user":
                if isinstance(content, str) or (isinstance(content, list) and any(b.get("type") == "text" for b in content if isinstance(b, dict)) and not any(b.get("type") == "tool_result" for b in content if isinstance(b, dict))):
                    last_tools = []
                elif isinstance(content, list):
                    for b in content:
                        if isinstance(b, dict) and b.get("type") == "tool_result" and last_tools:
                            c = b.get("content")
                            text = c if isinstance(c, str) else " ".join(x.get("text", "") for x in c or [] if isinstance(x, dict))
                            last_tools[-1]["error"] = bool(b.get("is_error"))
                            last_tools[-1]["result"] = text[:400]
                continue
            if row.get("type") != "assistant" or not isinstance(content, list):
                continue
            for b in content:
                if b.get("type") == "tool_use":
                    inp = b.get("input") or {}
                    last_tools.append({"tool": b.get("name"), "cmd": (inp.get("command") or inp.get("file_path") or inp.get("skill") or "")[:400]})
            if msg.get("stop_reason") == "end_turn":
                text = "\n".join(b.get("text", "") for b in content if b.get("type") == "text").strip()
                if text:
                    n_final += 1
                    out.write(json.dumps({"file": str(path.relative_to(root)), "ts": row.get("timestamp"), "cwd": row.get("cwd"), "text": text, "tools": last_tools[-12:], "n_tools": len(last_tools)}) + "\n")
print(f"{n_files} transcripts, {n_final} final replies", file=sys.stderr)
