---
description: Python 3.13 type parameter defaults and annotation compatibility boundaries.
---

# Python 3.13: type parameter defaults

Use the [shared typing reference](../references/advanced/typing-advanced.md) for
common guidance, and the [3.12 delta](python-3.12.md) for PEP 695 constraints,
bounds, generic classes, and aliases. Python 3.13 adds defaults for type parameters
(PEP 696); it does **not** introduce PEP 649 deferred annotations.

## Default type arguments

```python
class Box[T = int]:
    def __init__(self, value: T) -> None:
        self.value: T = value
```

The default supplies `int` when a type argument is omitted and cannot otherwise
be inferred. Explicit specialization with `Box[str]` remains available;
constructor arguments can also drive inference. A type parameter
default is not a default constructor value: `Box()` still lacks required `value`.
It neither converts inputs to `int` nor checks them at runtime.

The older constructors `TypeVar`, `ParamSpec`, and `TypeVarTuple` also gain a
`default` argument. Do not introduce defaults in code that must run on 3.12;
the bracket syntax cannot be backported by importing `typing_extensions`.

## Other typing additions

- `typing.TypeIs` (PEP 742) supports narrowing in both true and false branches;
  its target must be compatible with the input type. Its predicate must be true
  exactly for values in the claimed type; annotations do not verify the body.
- `typing.ReadOnly` (PEP 705) marks `TypedDict` items read-only to type checkers,
  without preventing dictionary mutation at runtime.
- `warnings.deprecated` (PEP 702) communicates deprecation to type checkers and
  can emit runtime warnings.

## Annotation evaluation: still the earlier model

Function annotations remain eager by default in 3.13. Quote a forward reference
as one whole string in new code, and import names normally instead of adding the
future import for that purpose. The
[recursive node example](python-3.10.md#forward-references) still applies. PEP
695 alias values are lazy, but lazy alias values do not defer other annotations.

Existing code can carry the future import or a `TYPE_CHECKING` guard from an
earlier choice. Keep an existing future import until you have checked the
readers that evaluate the annotations, because removing the import changes the
stored form of every annotation in that module and 3.13 gives no deferred
evaluation to fall back on. A guard does not make an import that executable code
needs safe in a circular dependency, and a runtime annotation reader can still
need a name that a guarded import leaves unavailable.

**PEP 649/749 starts in Python 3.14.** For 3.14 projects, use the [3.14 delta](python-3.14.md), including that release's
[annotation changes](https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-deferred-annotations)
and [migration guidance](https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-porting-annotations),
plus the target release's official documentation. Even deferred annotations do
not resolve arbitrary circular runtime imports.

## Official references

- [Python 3.13 typing additions](https://docs.python.org/3.13/whatsnew/3.13.html#typing)
- [PEP 696: type defaults](https://peps.python.org/pep-0696/)
- [`TypeIs` requirements](https://docs.python.org/3.13/library/typing.html#typing.TypeIs)
