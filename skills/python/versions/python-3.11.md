---
description: Python 3.11 typing deltas, especially subclass-preserving Self.
---

# Python 3.11: `Self` and typing helpers

Use the [shared typing reference](../references/advanced/typing-advanced.md) for
common guidance. The [3.10 baseline](python-3.10.md) remains valid; this page
covers additions rather than repeating its collection and generic examples.

## Subclass-preserving return types

`typing.Self` (PEP 673) represents the enclosing class with the caller's subclass
preserved. Use it for methods returning `self`, and classmethod factories that
construct `cls`. A method that always returns a specific base-class instance must
name that base class instead. The equivalent bound-`TypeVar` form remains valid.

```python
from typing import Self


class Builder:
    def __init__(self, name: str = "") -> None:
        self.name: str = name

    def set_name(self, name: str) -> Self:
        self.name = name
        return self

    @classmethod
    def named(cls, name: str) -> Self:
        return cls(name)
```

Subclasses inheriting this constructor get their own type from `named`, and
`set_name` returns the original instance. Subclass constructors must remain
compatible with the factory's call to `cls(name)`.

## Other additions and compatibility

- `TypeVarTuple`/`Unpack` (PEP 646) support variadic type parameters.
- `Required` and `NotRequired` (PEP 655) describe individual `TypedDict` keys.
- `assert_type` can express a static inference expectation; `assert_never` can
  check exhaustiveness. Neither replaces validation of untrusted inputs.
- Use `TypeVar`/`Generic` and assignment-style aliases on a 3.11 minimum; PEP 695
  declarations and `type` require [3.12](python-3.12.md).
- Function annotations are still eager by default. Quote a forward reference as
  one whole string in new code, and import names normally. The future import and
  a `TYPE_CHECKING` guard appear in older code, and the 3.10 page states the
  reader check to run before you remove either form from such code.

## Official references

- [Python 3.11 typing changes](https://docs.python.org/3.11/whatsnew/3.11.html#new-features-related-to-type-hints)
- [`Self` semantics and counterexample](https://docs.python.org/3.11/library/typing.html#typing.Self)
- [`assert_type` and `assert_never`](https://docs.python.org/3.11/library/typing.html#functions-and-decorators)
