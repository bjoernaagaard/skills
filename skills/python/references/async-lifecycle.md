# Async lifetime, failure, and cancellation

## Contents

- [Choose ownership](#choose-ownership)
- [Explicit ownership on Python 3.10 and later](#explicit-ownership-on-python-310-and-later)
- [Task groups on Python 3.11 and later](#task-groups-on-python-311-and-later)
- [Deadlines and cleanup](#deadlines-and-cleanup)

## Choose ownership

Use the project's async framework. Identify who starts each task, retrieves its
result, and finishes or cancels it. A timeout is not proof that underlying I/O,
a thread, or a remote write has stopped. Keep blocking work out of the event loop;
check whether an offloaded operation can actually be interrupted.

For a finite, modest batch, own all child tasks until they finish. For an unbounded
stream, bound task creation and queued data; a semaphore inside millions of
already-created tasks does not bound memory. Do not replace an existing framework
with asyncio solely to follow these examples.

## Explicit ownership on Python 3.10 and later

This helper accepts cooperative async jobs, preserves result order, and cancels
unfinished children on failure or caller cancellation. It is not a TaskGroup
backport: it reports the first propagated failure, not a grouped failure contract.

`Awaitable[T]` includes futures and custom awaitables, but `asyncio.create_task`
requires a coroutine, not every awaitable. Preserve that public input contract:
wrap `await job()` in an `async def` adapter, as `invoke` does below, before
scheduling it. The adapter also makes synchronous factory failures part of owned
task execution. Do not remove it as redundant or narrow the accepted inputs just
to satisfy the scheduler.

```python
import asyncio
from collections.abc import Awaitable, Callable, Sequence
from typing import TypeVar

T = TypeVar("T")


async def run_owned(jobs: Sequence[Callable[[], Awaitable[T]]]) -> list[T]:
    async def invoke(job: Callable[[], Awaitable[T]]) -> T:
        return await job()

    tasks: list[asyncio.Task[T]] = []
    try:
        for job in jobs:
            tasks.append(asyncio.create_task(invoke(job)))
        return list(await asyncio.gather(*tasks))
    finally:
        for task in tasks:
            if not task.done():
                task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
```

The final gather observes child completion during cleanup; it does not convert
the outer failure into success. Jobs must release their own resources in `finally`
or async context managers. Repeated external cancellation can interrupt awaited
cleanup; do not promise unstoppable cleanup or a strict shutdown bound.

## Task groups on Python 3.11 and later

Use a task group when its sibling cancellation and grouped-failure semantics
match the contract. Do not silently change existing callers from a single
exception to an `ExceptionGroup`. Older supported interpreters still need a
compatible implementation or an explicitly accepted dependency.

```python
import asyncio
from collections.abc import Awaitable, Callable, Sequence
from typing import TypeVar

T = TypeVar("T")


async def run_grouped(jobs: Sequence[Callable[[], Awaitable[T]]]) -> list[T]:
    async def invoke(job: Callable[[], Awaitable[T]]) -> T:
        return await job()

    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(invoke(job)) for job in jobs]
    return [task.result() for task in tasks]
```

## Deadlines and cleanup

Distinguish the application's total deadline from per-attempt/socket timeouts.
Measure duration with a monotonic clock. Account for cleanup and queue time;
`wait_for` may wait for cancellation to complete beyond its nominal timeout.
Use `asyncio.timeout` only on a compatible interpreter (3.11+) and with its
cancellation semantics understood.

Propagate `CancelledError` after necessary cleanup. Do not use a broad catch,
`shield`, or `uncancel` to disguise cancelled work as success. Shielding does not
remove the need to own and eventually observe the protected task. Retain strong
references to deliberately long-lived tasks and give their owner a shutdown path.

Test failure and cancellation with event handshakes, not guessed sleeps. Check
that cleanup happened before the owner returned, that results stay ordered, and
that errors reach the caller. Exercise supported versions independently.

Sources: [3.10 tasks and cancellation](https://docs.python.org/3.10/library/asyncio-task.html),
[task groups and timeouts](https://docs.python.org/3.11/library/asyncio-task.html),
[current cancellation details](https://docs.python.org/3.14/library/asyncio-task.html).
