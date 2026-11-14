# Performance and memory: preserve the contract first

Establish the workload and target: elapsed time, latency distribution, throughput,
peak memory, or startup. Measure an existing implementation before optimizing it.
A new language feature, vectorized expression, cache, or executor is not evidence
of improvement. Keep numerical results, ordering, errors, and mutations equivalent
unless the requested optimization explicitly changes those contracts.

## Measure representative work

Separate setup/imports, data loading, steady-state computation, and output when
those distinctions matter. Consume generators and await async work inside the
measured interval. Record interpreter/build, dependency versions, data shape,
dtype, machine conditions, and repetitions. Use independent representative cases
and larger inputs where scaling matters; retain small/empty cases for correctness.

Use an appropriate profiler to locate cost before rewriting. Use a monotonic
performance clock for elapsed measurements and a benchmark tool when stability
matters. Python allocation tracing does not necessarily account for all native
array buffers or child processes; name exactly which memory measurement you used.
Do not infer a general speedup from one noisy run or only a microbenchmark.

## Bound memory by design

Check hidden copies, temporary arrays, repeated concatenation, eager conversion,
query materialization, and retained cache entries. Use library operations when
they match the contract, but compare peak memory as well as elapsed time. Chunking
must preserve ordering and cross-chunk state. Avoid replacing streaming input
with a full list just to simplify a loop.

This Python 3.10+ example buffers at most one batch, validates size immediately,
and consumes one-pass input only as batches are requested.

```python
from collections.abc import Iterable, Iterator
from itertools import islice
from typing import TypeVar

T = TypeVar("T")


def batches(items: Iterable[T], size: int) -> Iterator[tuple[T, ...]]:
    if isinstance(size, bool) or not isinstance(size, int) or size < 1:
        raise ValueError("size must be a positive integer")

    def iterate() -> Iterator[tuple[T, ...]]:
        source = iter(items)
        while batch := tuple(islice(source, size)):
            yield batch

    return iterate()
```

Use `itertools.batched` when the supported release and desired tail/strictness
semantics permit it; do not add this helper where a supported library API fits.
The example does not own or close a caller's source resource. An iterator may
hold other state beyond the batch; bounded batching alone is not a global memory
limit. Test consumption, tail batches, and source failures before benchmarking.

## Cache and parallelize only under the right contract

Specify cache keys, invalidation, memory bounds, and mutable-result ownership.
Check thread/process initialization and data-transfer cost before adding workers.
Avoid nested thread oversubscription in numerical libraries. Measure the complete
operation and failure paths; do not advertise a speedup not actually observed.

Sources: [profiling](https://docs.python.org/3/library/profile.html),
[timeit](https://docs.python.org/3/library/timeit.html),
[allocation tracing](https://docs.python.org/3/library/tracemalloc.html),
[iterator batching](https://docs.python.org/3/library/itertools.html#itertools.batched).
