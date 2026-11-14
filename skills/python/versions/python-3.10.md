---
description: Python 3.10 compatibility baseline and forward-reference example.
---

# Python 3.10: typing baseline

Use the [shared typing reference](../references/advanced/typing-advanced.md) for
contracts, collections, generics, aliases, validation, and import caveats. This
page contains only compatibility notes for a minimum supported version of 3.10.

## Available syntax

- `X | Y` and `X | None` are new in 3.10 (PEP 604).
- Builtin generics such as `list[str]` and `dict[str, int]`, plus parameterized
  `collections.abc` interfaces, already exist in 3.9 (PEP 585).
- Use `TypeVar` for generic functions and `Generic[T]` for generic classes.
- `typing.TypeAlias` makes assignment-style aliases explicit (PEP 613).
- `typing.TypeGuard` and `ParamSpec` are available for custom narrowing and
  preserving callable parameter types; use them when those contracts are needed.

## Forward references

Function annotations evaluate at definition time by default. A class is not yet
bound to its own name while its body executes, so quote the whole forward
annotation as `"Node | None"` for this recursive node. Import names normally,
and do not add `from __future__ import annotations` or a `TYPE_CHECKING` guard
in new code to postpone that evaluation.

```python
class Node:
    def __init__(self, value: int, parent: "Node | None" = None) -> None:
        self.value: int = value
        self.parent = parent
```

The default is `None`, and passing a parent keeps that same node. A quoted
annotation does not defer an ordinary alias assignment or a runtime import.
Existing code can carry the future import or a guarded import from an earlier
choice, and a name under a guard can still be missing when `get_type_hints`
runs, so check the readers of the annotations before you remove either form.
See the shared reference for that migration check.

## Do not assume later features

`typing.Self` arrives in [3.11](python-3.11.md); use a bound `TypeVar` or the
`typing_extensions` backport if needed here. PEP 695 parameter lists and the
`type` statement require [3.12](python-3.12.md). Type parameter defaults require
[3.13](python-3.13.md). Backports cannot make newer syntax parse on 3.10.
Configure the project's existing type checker for its minimum supported version.

## Official references

- [Python 3.10 typing changes](https://docs.python.org/3.10/whatsnew/3.10.html#new-features-related-to-type-hints)
- [PEP 585: collection generics, Python 3.9](https://peps.python.org/pep-0585/)
- [PEP 563: postponed annotations and runtime caveats](https://peps.python.org/pep-0563/)
