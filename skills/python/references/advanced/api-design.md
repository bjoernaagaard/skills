# API design

## Defaults and signatures

Defaults are appropriate when omission has a stable, documented meaning. Require
explicit arguments for consequential choices with no safe default, such as a
required destination or an authorization decision. Avoid mutable defaults that
accumulate state across calls; use `None` and allocate per call when needed.

An option unused by known internal callers may be unnecessary, but inspect the
public contract before deleting it. External callers are not visible in a local
search. Do not change an API simply to enforce a parameter-count rule.

Use keyword-only options when positional arguments are easy to confuse. Preserve
protocol, framework, and override contracts when adjusting signatures. Follow
existing positional conventions for receivers and context objects.

## Submit keyword arguments directly

[`Executor.submit(fn, /, *args, **kwargs)`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Executor.submit)
forwards both positional and keyword arguments. No lambda is needed for a
keyword-only parameter. Binding arguments at submission also avoids accidentally
capturing a loop variable that changes before the worker runs.

```python
from concurrent.futures import ThreadPoolExecutor


def fetch_value(value: int, *, scale: int) -> int:
    return value * scale


def scale_values(values: list[int]) -> list[int]:
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(fetch_value, value, scale=2) for value in values]
        return [future.result() for future in futures]
```

`future.result()` propagates worker failures. Decide explicitly how a caller
handles a partially completed batch; do not silently substitute empty results.

## Evidence for failure behavior

Cover a failure contract with the real resource that can fail in that way. Use a
disposable real directory, a real database instance the case can discard, or the
live service the code reads, and let the real failure reach the caller. A stand
in that repeats the expected error shows only that the stand in was written to
repeat it, so a passing case with a stand in does not prove the failure path.

Do not add a production knob whose only job is to let a test force a failure,
and do not delete a useful error case only because the case runs outside normal
use. Avoid knobs for features that have no current consumer.

## Public changes and consumer documentation

Distinguish an internal refactor from a public contract change. Inspect exports,
call signatures, return shape/order, exception types, mutation/aliasing, and data
formats used by callers. Local call-site search does not enumerate external users.
Document intentional changes and use the project's deprecation/version policy.
Warnings should point to actionable caller behavior; do not invent compatibility
shims or remove them solely to satisfy a style rule.

Keep a written docstring to one line, and state ownership, failure, or a version
need in that line only when a reader could get that fact wrong from the name and
the types. Put a longer fact in a clear name, in an error message, or in the end
to end case that covers the behavior. Verify at least one real consumer for a
changed public boundary. Documentation is part of the requested change when the
old example or installation instruction would now be wrong.
