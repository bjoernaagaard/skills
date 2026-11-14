---
description: Click and argparse command boundaries, output, exit status, and path handling.
---

# CLI Patterns

Use the project's existing CLI framework. Keep parsing and presentation at the
command boundary; ordinary application functions return results or raise errors.
Examples target Python 3.10+; the Click example requires Click 8+.

## Click: translate expected failures

```python
from pathlib import Path

import click


@click.command()
@click.argument("path", type=click.Path(path_type=Path, dir_okay=False))
def cli(path: Path) -> None:
    """Write a UTF-8 file to standard output."""
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise click.ClickException(f"Cannot read {path}: {error}") from error
    click.echo(content, nl=False)
```

A script entry point calls `cli()`; Click's default standalone mode prints a
`ClickException` to stderr and exits with status 1. A missing argument is a usage
error (status 2); a missing file fails nonzero rather than looking successful.
Returning an integer from a Click callback does **not** set its exit status.
For intentional exits use `click.Context.exit(code)` or an appropriate exception.
With `standalone_mode=False`, the embedding caller handles errors and exit policy.

Prefer `click.echo()` in Click commands for its stream, encoding, and terminal
support. Use `err=True` for diagnostics, and reserve stdout for command results.
Do not print an error and then return normally, or print it before raising a
`ClickException` and cause duplicate output.

## argparse: return a status to the entry point

```python
import argparse
from pathlib import Path
import sys


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Read a UTF-8 file")
    parser.add_argument("path", type=Path)
    args = parser.parse_args(argv)
    try:
        content = args.path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        print(f"Cannot read {args.path}: {error}", file=sys.stderr)
        return 1
    print(content, end="")
    return 0
```

A script's `if __name__ == "__main__":` guard should call
`raise SystemExit(main())`; a packaging console-script entry point also uses the
returned integer as the exit status. `print()` is appropriate with argparse.
By default, `parse_args()` reports invalid syntax on stderr and exits with status
2; explicit help exits with status 0. Use `parser.error()` for invalid arguments,
not as a blanket replacement for operational failures.

## Paths and interaction

- `click.Path(exists=True)` can improve argument diagnostics, but filesystem
  prechecks are not race-safe: files and permissions can change before use.
  Catch failures from the actual read, write, or directory creation operation.
- Request confirmations for destructive actions when interaction is appropriate;
  offer an explicit noninteractive policy for automation.
- `click.echo()` flushes its output. No manual stderr flush is required before
  `click.confirm()`, and unflushed output does not itself explain an input hang.
  A prompt may simply be waiting for input; flushing cannot supply that input.
- Keep progress and prompts out of machine-readable stdout. For JSON error
  responses, retain a nonzero process status as in
  [exception handling](references/advanced/exception-handling.md).

## Sources

- [Click exceptions and exit codes](https://click.palletsprojects.com/en/stable/exceptions/)
- [Click echo](https://click.palletsprojects.com/en/stable/api/#click.echo)
- [argparse parsing and errors](https://docs.python.org/3.10/library/argparse.html#invalid-arguments)
