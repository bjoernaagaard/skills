# Concurrency: choose the execution and state contract

<!-- Added 2026-09-18. -->

## Contents

- [Choose from the workload](#choose-from-the-workload)
- [Process contexts](#process-contexts)
- [Isolated interpreters](#isolated-interpreters)
- [Bound submitted work](#bound-submitted-work)
- [Free-threaded builds](#free-threaded-builds)

## Choose from the workload

Keep sequential code unless concurrency addresses a measured or specified need.
Thread pools share application state; processes and interpreter pools require
explicit data transfer. For a decision, measure representative input size,
serialization, initialization, memory, and dependency behavior. Neither a new
executor nor a free-threaded build alone establishes a speed improvement.

Keep worker errors observable and own executor lifetime. Retrieving results is
part of the operation. A future timeout limits waiting; it does not cancel a
running task or ensure bounded executor shutdown. Use the application's existing
cancellation and deadline contract instead of promising those guarantees.

## Process contexts

Python 3.14 no longer defaults to `fork`. Linux normally uses `forkserver`;
Windows and macOS use `spawn`. Query the actual context on other platforms.
Put workers in importable modules, pass serializable arguments, and protect
program entry points. Do not assume workers inherit a parent's modified globals.

Accept a caller-supplied multiprocessing context in libraries rather than changing
the process-wide start method. Create related locks and queues from that same
context. An explicit `fork` request is a deployment decision, not a general fix
for import or serialization bugs.
[Source: process contexts](https://docs.python.org/3.14/library/multiprocessing.html#contexts-and-start-methods).

```python
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import get_context
from multiprocessing.context import BaseContext


def reciprocal(value: int) -> float:
    return 1.0 / value


def reciprocals(
    values: list[int], *, context: BaseContext | None = None
) -> list[float]:
    with ProcessPoolExecutor(max_workers=2, mp_context=context) as pool:
        return list(pool.map(reciprocal, values))


if __name__ == "__main__":
    print(reciprocals([1, 2, 4], context=get_context("spawn")))
```

Save this as an importable module. Zero retains its `ZeroDivisionError` contract;
a lambda or worker nested in the calling function is not a portable substitute.
The example also runs on Python 3.10+. Test the default context and each context
the application explicitly promises, not just the one available on a laptop.

## Isolated interpreters

Python 3.14's `InterpreterPoolExecutor` runs workers in separate interpreters,
with separate module state. Submitted functions, arguments, and results cross a
serialization boundary; a worker does not mutate the caller's list in place.
Keep workers importable and check extension-module compatibility. Observe future
results so worker errors are not lost.
[Source: interpreter pools](https://docs.python.org/3.14/library/concurrent.futures.html#interpreterpoolexecutor).

```python
from concurrent.futures import InterpreterPoolExecutor


def append_size(values: list[int]) -> list[int]:
    values.append(len(values))
    return values


def extended_copy(values: list[int]) -> list[int]:
    with InterpreterPoolExecutor(max_workers=1) as pool:
        return pool.submit(append_size, values).result()
```

For input `[7]`, the result is `[7, 1]` and the caller's input remains `[7]`.
This small example demonstrates ownership, not an efficient reason to start a
pool. Keep it in an importable module when executing it.

## Bound submitted work

In 3.14, `Executor.map(buffersize=...)` limits submitted work whose results have
not yet been yielded. Without it, input is consumed eagerly. `chunksize` is a
separate process-pool batching choice and has no effect on thread/interpreter
pools. Buffering is not a total-memory limit: argument sizes, process chunks,
worker memory, and accumulated output still matter.
[Source: executor map](https://docs.python.org/3.14/library/concurrent.futures.html#concurrent.futures.Executor.map).

```python
from collections.abc import Iterable, Iterator
from concurrent.futures import Executor


def ordered_lengths(
    executor: Executor, values: Iterable[str], *, buffer_size: int
) -> Iterator[int]:
    return executor.map(len, values, buffersize=buffer_size)
```

The caller owns the executor and consumes the iterator within its lifetime.
Keep errors visible while consuming results. For an older supported Python,
retain the existing bounded-submission strategy; do not silently drop the bound
or pass a keyword that the older API does not accept.

## Free-threaded builds

Free-threaded CPython is a separate build, not a property of every 3.14 install.
Inspect `sysconfig.get_config_var("Py_GIL_DISABLED")` for build capability and
`sys._is_gil_enabled()` for actual GIL state, including after dependency imports.
An incompatible extension can re-enable it. Confirm wheels and runtime behavior
for the exact dependency set.

Protect compound shared-state operations with explicit synchronization; do not
infer application-level atomicity from internal container locks. Audit mutable
caches, check-then-update operations, and object ownership before changing a
threading model. Free-threading success does not prove interpreter-pool support,
or conversely.
[Source: free-threading guidance](https://docs.python.org/3.14/howto/free-threading-python.html).

```python
from threading import Lock


class Counter:
    def __init__(self) -> None:
        self.count = 0
        self.lock = Lock()

    def increment(self) -> None:
        with self.lock:
            self.count += 1

    def value(self) -> int:
        with self.lock:
            return self.count
```

The example is compatible with 3.10+. A passing test on a GIL-enabled interpreter
is not free-threaded execution evidence. Record build capability, actual GIL
state, platform, and dependency versions for that separate check.
