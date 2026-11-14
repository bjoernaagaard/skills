---
description: Python 3.12 type parameters, constraints, bounds, and lazy type aliases.
---

# Python 3.12: type parameter syntax

Use the [shared typing reference](../references/advanced/typing-advanced.md) for
common guidance. PEP 695 adds type parameter lists to functions, classes, and
aliases. Adopt them only when the minimum supported interpreter and type checker
support 3.12; `TypeVar` and `Generic` remain valid for older targets.

## Constraints and bounds

PEP 695 supports **constrained** parameters using a tuple of two or more types:

```python
def add[T: (int, float)](a: T, b: T) -> T:
    return a + b
```

A constraint chooses a listed type, rather than preserving an arbitrary subtype.
A bound such as `T: Base` instead permits subtypes of `Base` and preserves the
inferred subtype. Neither form performs runtime input validation. Numeric typing
allows `int` where `float` is accepted, so do not interpret `(int, float)` as an
exact-runtime-type equality check between arguments.

## Generic classes

Type parameters supply the generic machinery for a class, and they state no
abstract contract on their own. A concrete generic class covers one
implementation without any interface layer.

```python
class Source[T]:
    def __init__(self, value: T) -> None:
        self.value = value

    def get(self) -> T:
        return self.value


source = Source(42)
```

Do not also inherit `Generic[T]` in `class Source[T]`, because PEP 695 supplies
that part. Parameters stay local to the declaration that names them, and the
checker infers class parameter variance. Add an abstract base class only when a
second real implementation exists, when shared code belongs on the base, and
when the project allows that form. A protocol fits that same case when two real
classes share a shape without shared code, and neither form checks a signature
at runtime.

## Aliases and evaluation

The inline syntax `type Result[T] = tuple[T, str | None]` declares a generic alias.
`type JsonValue = dict[str, JsonValue] | list[JsonValue] | str | int | float | bool | None`
can refer to itself because the alias value is evaluated lazily. An ordinary
assignment alias does **not** gain that behavior; `TypeAlias` is deprecated in
favor of `type`, but remains available for compatibility with older Python.

Lazy alias evaluation is not general deferred annotation evaluation. Function
annotations remain eager by default, so quote a forward reference as one whole
string in new code and import names normally. Import an annotation name before
an eager signature that uses the name, because a function body import runs too
late. Type parameter defaults are a [3.13](python-3.13.md) addition.

## Official references

- [PEP 695: constraints, bounds, scopes, and variance](https://peps.python.org/pep-0695/)
- [The `type` statement](https://docs.python.org/3.12/reference/simple_stmts.html#the-type-statement)
- [Abstract base classes and `abstractmethod`](https://docs.python.org/3.12/library/abc.html)
