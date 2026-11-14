---
description: Narrow recovery, authoritative operations, exception chaining, and truthful boundary errors.
---

# Exception Handling

Catch an exception where you can recover, add useful context, or translate it to
an external error contract. Otherwise let it propagate. Keep the `try` block
small so a handler does not accidentally hide unrelated failures.

## Validate with the authoritative operation

Use a real parser for the format you accept instead of approximating the grammar
with `isdigit()` or with a string shape check. For JSON, decode with the schema
aware decoder the project has declared and with a named model, such as
`msgspec.json.decode(data, type=...)` with a named `Struct` model when msgspec
is that decoder. Validate additional domain constraints after the decode. A
default on a parse failure is appropriate only when that fallback is part of
the stated input contract.

Cheap prechecks can improve feedback, but filesystem existence and permission
checks are not race-safe. Open or modify the resource and handle the operation's
actual error; a prior `exists()` or access check cannot guarantee success.

For third-party compatibility, catch the documented exception and inspect its
error code when needed. Retry an alternative only for the known unsupported
operation, not for authentication, network, or programming failures. A broad
`except Exception` followed by a fallback silently changes the result contract.

## Preserve causes when translating

```python
from pathlib import Path


def read_config(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise ValueError(f"Cannot read configuration {path}: {error}") from error
```

A bare `raise` preserves the current exception. `raise NewError(...) from error`
records an explicit cause. Python also retains implicit exception context when
`from` is omitted; omission does not simply erase the original traceback.
`from None` suppresses context in the displayed traceback, not the underlying
`__context__` attribute. Use it only when hiding that context is intentional.
Projects enabling Ruff B904 require explicit chaining for replacement exceptions;
that lint policy is distinct from Python's runtime behavior.

## JSON errors still need a failure status

The example below defines a stdout JSON protocol with msgspec, so the project
must already declare msgspec or add it through the dependency workflow the
project uses. A project that has declared another schema aware encoder and
decoder uses those tools in the same places. The caller returns the status
rather than exiting inside the reusable reporter.

```python
import msgspec


class Document(msgspec.Struct):
    name: str


class Result(msgspec.Struct):
    success: bool
    name: str = ""
    error: str = ""


def report_error(error: Exception) -> int:
    result = Result(success=False, error=str(error))
    print(msgspec.json.encode(result).decode("utf-8"))
    return 1


def main(document: bytes) -> int:
    try:
        value = msgspec.json.decode(document, type=Document)
    except msgspec.DecodeError as error:
        return report_error(error)
    result = Result(success=True, name=value.name)
    print(msgspec.json.encode(result).decode("utf-8"))
    return 0
```

The process entry point must use the returned status, for example through
`raise SystemExit(main(document))` after argument parsing. No exit runs when
this example is loaded. Reporting `success: false` while exiting 0 falsely tells
shells and automation that the operation succeeded. Keep unrelated diagnostics
on stderr and avoid leaking secrets in error messages. For framework-specific
entry points, see [CLI patterns](../../cli-patterns.md).

## Recovery is a contract, not a logging requirement

- Catch specific expected failures. A broad catch can be justified at a final
  boundary that reports failure and retains diagnostic context; it is not a
  reason to return fabricated success or silently change algorithms.
- Intentionally optional absence may be handled without warning: for example,
  catch `FileNotFoundError` around reading an optional user configuration file.
  Let permission errors and malformed content follow their own policy.
- Do not catch `BaseException` or use a bare `except` for normal recovery:
  they also capture `KeyboardInterrupt` and `SystemExit`.
- Clean up with context managers or `finally`. Do not return from `finally` in a
  way that replaces a result or suppresses an active exception.
- Timeouts and subprocess failures remain failures unless explicit recovery
  succeeds; see [subprocess handling](../../subprocess.md).

## Sources

- [Python exception handling and chaining](https://docs.python.org/3.10/tutorial/errors.html#exception-chaining)
- [Filesystem precheck race warning](https://docs.python.org/3.10/library/os.html#os.access)
- [Ruff B904](https://docs.astral.sh/ruff/rules/raise-without-from-inside-except/)
