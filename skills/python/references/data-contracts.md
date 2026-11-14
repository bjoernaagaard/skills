# Numerical and time-series contracts

Use this only for numerical/data code. Preserve the chosen libraries and consult
their documentation for the installed and supported versions; Python language
support alone says nothing about pandas, NumPy, SciPy, or binary dependencies.
Do not add domain forecasting assumptions to ordinary Python work.

## Establish the data meaning

Specify the observation/row unit, keys, units, time basis, dtype, shape, missing
value policy, valid range, and duplicate policy before changing an operation.
Do not silently replace missing values with zero, coerce invalid strings, truncate
integers, discard rows, or change precision. Check overflow, finite/non-finite
values, zero denominators, and ownership of mutable array views/copies as relevant.

Use tolerances justified by the numerical contract, with an absolute tolerance
near zero when needed. Distinguish mathematical equality from floating-point
agreement. Decimal-from-string or integer minor units may fit exact decimal
contracts; converting an already rounded binary float does not restore precision.
Compare against a separately reasoned result, including edge cases.

## Align explicitly

For dataframe joins, validate the intended one-to-one/one-to-many relationship,
check unmatched and missing keys, and account for duplicate multiplication.
Positional arrays and label-aligned dataframe operations are different contracts.
Validate broadcast shapes and axes rather than accepting a plausible-shaped
result. Keep vectorization, chunking, and parallelism conditional on equivalent
results and measured time/memory. Do not assume Copy-on-Write or view semantics
from another release.

For time ordered modeling or evaluation, preserve what was available at the
decision time, and do not rely on the event timestamp alone. Fit transformations
on training data only, and keep later observations out of earlier features.
Check these rules against timestamps taken from the real source that will supply
the data, because a made up timestamp set can follow a rule the real source
breaks. The skill does not choose a market model, and it does not guarantee
statistical validity.

## Distinguish instants from local calendar labels

Store/compare instants in a consistent aware time basis and keep the original
zone when the calendar meaning matters. Define ambiguous and nonexistent local
times, interval endpoints, calendar versus elapsed durations, and resampling
boundaries. Do not attach UTC to a naive local time as a substitute for conversion.

```python
from datetime import datetime, timedelta, timezone


def elapsed(start: datetime, end: datetime) -> timedelta:
    if start.utcoffset() is None or end.utcoffset() is None:
        raise ValueError("Both timestamps must identify timezone-aware instants")
    return end.astimezone(timezone.utc) - start.astimezone(timezone.utc)
```

This 3.10+ helper measures signed elapsed time, not a business calendar interval.
It converts before subtraction so a daylight-saving fold is not lost through
same-zone wall-time arithmetic. It does not resolve ambiguous naive timestamps.
Use monotonic time, not wall timestamps, for process deadlines and benchmarks.

Sources: [datetime arithmetic](https://docs.python.org/3.13/library/datetime.html),
[floating-point limits](https://docs.python.org/3/tutorial/floatingpoint.html),
[decimal](https://docs.python.org/3/library/decimal.html),
[pandas merge contracts](https://pandas.pydata.org/docs/user_guide/merging.html),
[NumPy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html),
[time-ordered splitting](https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split).
