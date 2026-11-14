# Python 3.14: compatibility decisions

<!-- Added 2026-09-18. -->

## Contents

- [Annotation behavior](#annotation-behavior)
- [Template strings](#template-strings)
- [Filesystem errors](#filesystem-errors)
- [Event loops and finally blocks](#event-loops-and-finally-blocks)
- [Parallel work](#parallel-work)
- [Migration evidence](#migration-evidence)

Use these deltas when targeting or migrating to 3.14. Keep older-version support
unless the task changes it. The [3.13](python-3.13.md) and earlier notes still
apply to their respective features; 3.14 does not require wholesale modernization.

## Annotation behavior

Distinguish these modes before changing annotation-consuming code:

| Module configuration | Function annotation behavior |
| --- | --- |
| 3.10-3.13, no future import | Evaluate while defining the function. |
| 3.14, no future import | Defer evaluation until annotations are requested. |
| Any of these versions, `from __future__ import annotations` | Store stringified annotations; do not treat this as the 3.14 default. |

A 3.14 module can name a class defined later, provided annotation evaluation occurs
after that class exists. A decorator that inspects annotations immediately can
still encounter an unresolved name. Bases, default argument values, decorators,
and ordinary assignments are not deferred by annotation semantics.
[Source: annotation migration rules](https://peps.python.org/pep-0749/).

```python
def identity(value: Item) -> Item:
    return value


class Item:
    pass
```

The same function definition fails on 3.13 without a quoted forward reference,
so quote the reference as one whole string in new code that must also run on
3.13. Import names normally in new code, and add neither the future import nor
a `TYPE_CHECKING` guard for a forward reference.

An existing module can carry the future import from an earlier choice, and that
import stores annotations as strings on every version in the table above.
Removing the import from such a module changes the stored form, so check each
reader that evaluates the annotations before you remove the import, and keep
the import in place until that check passes. A project that needs stringified
annotations as a stated contract keeps that contract through the form its
readers already use.

For runtime consumers, choose the representation deliberately.
`annotationlib.get_annotations()` defaults to `Format.VALUE`; unresolved names can
raise. `Format.FORWARDREF` can retain unresolved names as `ForwardRef` objects;
`Format.STRING` returns textual representations. Neither format makes untrusted
annotation code safe. Access to annotations can invoke user-defined code even
when a string-like result is requested. Use source inspection instead of
importing or evaluating code whose execution is not authorized.
[Source: annotationlib](https://docs.python.org/3.14/library/annotationlib.html).

Retain each import a runtime consumer requires. A name that existing code keeps
under a `TYPE_CHECKING` guard stays absent at runtime, and deferred evaluation
does not repair a circular import that executable code needs. Use
[shared typing](../references/advanced/typing-advanced.md) for validation,
forward references, and type checker boundaries.

## Template strings

Use `t"..."` when a consumer needs literal text and interpolation metadata
separately. A t-string returns `string.templatelib.Template`, not `str`; existing
string-taking APIs need a deliberately designed consumer, not a mechanical prefix
replacement. Its `strings`, `values`, and `interpolations` expose the parts.
[Source: template API](https://docs.python.org/3.14/library/string.templatelib.html).

```python
from string.templatelib import Template


def reading_template(label: str, value: float) -> Template:
    return t"{label}: {value:.2f}"
```

In this example, `value` is retained as a float and `.2f` as format metadata.
Interpolation expressions execute when the template is created, not when it is
consumed. No escaping, SQL parameter binding, or shell quoting is provided merely
by choosing a t-string. Keep parameterized SQL and argument-vector subprocess
calls unless an explicitly suitable consumer owns that boundary. Template syntax
cannot be imported into a 3.13-compatible module behind an `if` guard.
[Source: PEP 750](https://peps.python.org/pep-0750/).

## Filesystem errors

In 3.14, `Path.exists()` and file-kind predicates suppress operating-system
`OSError` failures and return `False`. That result alone does not distinguish
absence from denied access. Use `stat()` when that distinction is contractual;
handle only the absence cases the application intends to treat as normal.
`Path.info` caches information; do not use it as proof of current state. Use a
fresh operation for current metadata, and handle failures from the actual read
or write rather than trusting an earlier check.
[Source: pathlib](https://docs.python.org/3.14/library/pathlib.html).

```python
from os import stat_result
from pathlib import Path


def stat_if_present(path: Path) -> stat_result | None:
    try:
        return path.stat()
    except FileNotFoundError:
        return None
```

This helper follows symlinks, regards a missing target as absent, and propagates
permission and other errors. Choose a different policy explicitly for broken
links or non-directory path components. It works on the 3.10 baseline as well.

## Event loops and finally blocks

In 3.14, `asyncio.get_event_loop()` raises `RuntimeError` when no current event
loop exists. Inside async code, use `get_running_loop()` when the loop is needed.
For a standalone entry point, let `asyncio.run()` own the loop; inside a running
framework, await the coroutine instead of starting another loop. Event-loop
policies are deprecated in 3.14; migration may require explicit loop factories.
[Source: event loops](https://docs.python.org/3.14/library/asyncio-eventloop.html).

```python
import asyncio


async def loop_is_running() -> bool:
    return asyncio.get_running_loop().is_running()


if __name__ == "__main__":
    print(asyncio.run(loop_is_running()))
```

CPython 3.14 emits `SyntaxWarning` while compiling `return`, `break`, or `continue`
that exits a `finally` block. Such exits can discard an exception or override a
prior return. Preserve cleanup, and move successful returns outside `finally`.
A `break` contained entirely within a loop inside `finally` is a different case.
[Source: PEP 765](https://peps.python.org/pep-0765/).

## Parallel work

Read [concurrency](../references/concurrency.md) for the 3.14 process-start change,
`InterpreterPoolExecutor`, `Executor.map(buffersize=...)`, and free-threaded
builds. These options have different state-sharing and dependency requirements.
Choose from the workload and measurements, not from a language-version upgrade.

## Migration evidence

Exercise imports and real annotation consumers; changing raw annotation
representation can affect a framework even when construction succeeds. Exercise
process workers from importable modules on supported operating systems. Treat
ordinary and free-threaded builds separately. Verify dependency wheels and type
checker support for the actual target. Record missing environments rather than
turning skipped tests into a compatibility claim.
