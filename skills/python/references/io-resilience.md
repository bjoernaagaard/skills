# Resource ownership, writes, transactions, and retries

## Contents

- [Own resource lifetime](#own-resource-lifetime)
- [Replace a file without publishing a partial write](#replace-a-file-without-publishing-a-partial-write)
- [Keep database values and transactions separate](#keep-database-values-and-transactions-separate)
- [Retry only an identified transient operation](#retry-only-an-identified-transient-operation)

## Own resource lifetime

Use context managers for owned files, connections, sessions, and locks. Use
`ExitStack`/`AsyncExitStack` when resources are acquired dynamically. Do not close
borrowed objects without an explicit transfer-of-ownership contract. Lazy results
must not escape a context whose resource they still need. Specify early-exit and
failure cleanup for streams and generators; garbage collection is not a portable
resource-lifetime policy.

## Replace a file without publishing a partial write

For an application-owned file in a trusted directory, write a sibling temporary
file, close it, and replace the destination. This 3.10+ example publishes complete
UTF-8 content or leaves the previous destination intact when preparation fails.

```python
import os
from pathlib import Path
import tempfile


def replace_text(path: Path, text: str) -> None:
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", newline="", dir=path.parent,
            prefix=".pending-", delete=False,
        ) as stream:
            temporary = Path(stream.name)
            stream.write(text)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
```

This is replacement, not in-place modification: prior permissions/ACLs/ownership
and hard-link relationships are not preserved. Apply a specified metadata policy
when needed. It replaces a destination symlink itself and does not secure an
attacker-controlled directory. Atomic visibility is not power-loss durability:
filesystem/platform guarantees and directory synchronization need separate work.
Cleanup can itself fail and must remain diagnosable; do not promise every failure
leaves no temporary file. Concurrent writers need an explicit conflict policy.

## Keep database values and transactions separate

Bind values, rather than interpolating SQL. Identifiers need an allowlist or the
driver's identifier mechanism, not value placeholders. Own both rollback/commit
and connection closure; the sqlite connection context manager does not close it.
This 3.10+ example assumes an existing `records(name TEXT UNIQUE, value INTEGER)`
table and a connection owned only by this operation.

```python
from collections.abc import Iterable
from contextlib import closing
from pathlib import Path
import sqlite3


def store_records(database: Path, rows: Iterable[tuple[str, int]]) -> None:
    with closing(sqlite3.connect(database, isolation_level="DEFERRED")) as connection:
        with connection:
            connection.executemany(
                "INSERT INTO records(name, value) VALUES (?, ?)", rows,
            )
```

Test a failure on a later row to verify rollback of earlier rows. Preserve the
chosen driver's transaction/autocommit policy and use its documented behavior.
Do not assume a local database transaction also rolls back network side effects.

## Retry only an identified transient operation

Before retrying, establish whether replay is safe. A timed-out write may already
have committed; use the service's idempotency/transaction contract or reconcile
its status. Do not retry authentication, malformed input, or programming errors
under a generic exception catch. Bound attempts and total deadline; distinguish
per-attempt I/O timeouts, queue time, pauses, and the overall deadline. Use a
monotonic clock; a caller-supplied pause schedule can include tested backoff/jitter.

The helper below deliberately covers only replay-safe reads with an explicit
transient exception. It bounds attempts, not the duration of an unbounded operation.

```python
from collections.abc import Callable, Sequence
import math
from time import sleep
from typing import TypeVar

T = TypeVar("T")


class TransientReadError(Exception):
    """The read failed in a way the caller has classified as safe to retry."""


def retry_read(
    operation: Callable[[], T], delays: Sequence[float], *,
    pause: Callable[[float], None] = sleep,
) -> T:
    schedule = tuple(delays)
    if any(not math.isfinite(delay) or delay < 0 for delay in schedule):
        raise ValueError("delays must be finite and nonnegative")
    for delay in (*schedule, None):
        try:
            return operation()
        except TransientReadError:
            if delay is None:
                raise
            pause(delay)
    raise RuntimeError("unreachable retry state")
```

Sources: [resource stacks](https://docs.python.org/3.10/library/contextlib.html),
[temporary files](https://docs.python.org/3.13/library/tempfile.html),
[file replacement](https://docs.python.org/3.13/library/os.html#os.replace),
[sqlite transactions and parameters](https://docs.python.org/3.13/library/sqlite3.html),
[HTTP retry/idempotency semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2).
