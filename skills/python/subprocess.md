---
description: Safe argument vectors, subprocess failure propagation, timeouts, and output ownership.
---

# Subprocess Handling

Use `subprocess.run()` when it fits the operation. Decide how the caller observes
failure: `check=True` raises for nonzero status; `check=False` is appropriate when
the caller interprets documented return codes. Explicit `check` is a readability
convention, not a Python requirement; ignoring a failure is the correctness bug.

## Captured output with a timeout

This Python 3.10+ example uses only the standard library. It returns stdout
without stripping meaningful whitespace, and leaves subprocess failures visible.

```python

import subprocess


def run_checked(args: list[str], timeout: float) -> str:
    result = subprocess.run(
        args,
        check=True,
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return result.stdout
```

- Nonzero status raises `subprocess.CalledProcessError`, including `returncode`,
  `cmd`, and captured `stdout`/`stderr`.
- A timeout raises `subprocess.TimeoutExpired`; `run()` kills and waits for its
  direct child before re-raising. Do not catch it merely to print and continue as
  though the command succeeded. Process creation may not be interruptible, so
  `timeout` is not an exact wall-clock bound on the entire call.
- Starting the command can raise `OSError`, including `FileNotFoundError` for a
  missing executable. This is distinct from a child returning a nonzero status.
- `text=True` uses the platform's default text encoding. Set `encoding` when the
  child protocol specifies one; use bytes for binary output. Timeout exception
  output can be bytes even with `text=True`, or `None` when nothing was captured.

At an application boundary, translate only errors the application can explain or
recover from, and chain replacements with `raise ... from error`. Avoid exposing
credentials in command arguments or captured output. See
[exception handling](references/advanced/exception-handling.md) for boundary policy.

## Argument and environment safety

- Pass one argument per list item with `shell=False` (the default). Do not join
  user input into a shell command or add shell quoting to individual list items.
- An argv list avoids shell interpretation, not the target program's option
  parsing. Use its `--` separator when supported before untrusted filenames;
  validate which executable and operations users may select.
- Use a trusted executable path when executable discovery matters. For another
  Python process, use `sys.executable` rather than assuming `python` resolves to
  the current interpreter.
- Windows batch files can be launched through a shell by the operating system
  even with `shell=False`. Do not treat arbitrary `.bat`/`.cmd` commands as safe
  with untrusted arguments; consult the platform-specific security guidance.
- Use `cwd=` rather than changing the parent process's working directory.
  `env=` replaces the inherited environment; copy and update `os.environ` only
  when inheritance is intended.

## Output and process ownership

Captured output is buffered in memory. For potentially large output, let the
child inherit stdout/stderr or redirect to a file managed by a context manager.
Use `subprocess.DEVNULL` only when discarding that stream is intentional.

Use `Popen` only when streaming or lifecycle control requires it. Its owner must
close pipes, drain both captured streams without deadlock, and wait for the child
on every path. `Popen.communicate(timeout=...)` does not kill the child on timeout:
the owner must terminate/kill as appropriate, then finish communication and reap
it. A context manager alone does not provide a timeout or cancellation policy.
Descendant process cleanup needs a separate, platform-specific process-group or
job policy; `run(timeout=...)` is not a process-tree supervisor.

## Sources

- [subprocess.run and exceptions](https://docs.python.org/3.10/library/subprocess.html#subprocess.run)
- [Security considerations](https://docs.python.org/3/library/subprocess.html#security-considerations)
- [Popen.communicate and timeout cleanup](https://docs.python.org/3.10/library/subprocess.html#subprocess.Popen.communicate)
