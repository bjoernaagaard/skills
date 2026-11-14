# Module design

## Distinguish constants from startup work

A literal `Path("config.json")` does not access the filesystem. Pure, inexpensive
constants belong at module scope; no cached getter is needed for every expression.
Import-time file reads, environment-dependent initialization, network requests,
and database connections have different costs and failure modes. Prefer an
explicit startup boundary or injected resource for those operations.

```python
from pathlib import Path

SESSION_ID_FILE = Path(".app/scratch/current-session-id")


def get_session_id(path: Path = SESSION_ID_FILE) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None
```

Here absence is a documented outcome; permission errors and decoding failures
still propagate. A check with `exists()` would not make the later read race-free.

## Cache only when the lifetime is right

Deferring an operation and caching its result are separate decisions. Use a
function to defer work; add `functools.cache` only if reuse for that process
lifetime is correct. Cached configuration can become stale; cached clients need
an ownership and cleanup policy. Cache entries retain arguments and results,
and concurrent first calls may execute the function more than once. Do not use
`cache` as a substitute for synchronized singleton initialization.

See the [cache documentation](https://docs.python.org/3/library/functools.html#functools.cache)
when those lifecycle details matter.

## Imports

Keep imports at module scope unless there is a concrete reason to defer them:
optional dependencies, conditional platforms/features, breaking a runtime cycle,
or a measured startup cost. Measure before optimizing import latency; there is
no universal millisecond threshold. Do not pretend an illustrative timing is a
measurement of the current project.

Import names normally at module scope in new code, and do not add a
`TYPE_CHECKING` guard or a `from __future__ import annotations` import to avoid
a type only cycle. On Python 3.10 to 3.13, quote a forward annotation as one
whole string when the name is not yet bound. Code that later evaluates
annotations with `get_type_hints()` still needs each name available at runtime,
so a framework that reads annotations needs the real import in place. Existing
code can carry a guard or the future import from an earlier choice, and removing
either one changes what a reader of the annotations can resolve, so check those
readers before you remove anything.

For an actual runtime cycle, move the shared dependency or defer the relevant
import until the definitions exist. Deferred annotations in Python 3.14 do not
make eager `from a import A` / `from b import B` cycles safe.

Use the project's absolute/relative import convention and preserve public
package exports. Those choices are not runtime correctness rules.
