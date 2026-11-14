---
description: Shared typing guidance for Python 3.10+, including annotations, generics, narrowing, aliases, and runtime boundaries.
---

# Typing: shared guidance

<!-- Modified derivative; see ../../SKILL.md for attribution. -->

## Contents

- [Contracts and inference](#contracts-and-inference)
- [Generics and aliases](#generics-and-aliases)
- [Narrowing and input validation](#narrowing-and-input-validation)
- [Finite value sets](#finite-value-sets)
- [Annotation evaluation and imports](#annotation-evaluation-and-imports)
- [Official references](#official-references)

Use this reference for annotation design and runtime typing boundaries. Read the
matching release delta for [3.10](../../versions/python-3.10.md),
[3.11](../../versions/python-3.11.md), [3.12](../../versions/python-3.12.md),
[3.13](../../versions/python-3.13.md), or [3.14](../../versions/python-3.14.md) before introducing version-specific syntax.
The examples here run on Python 3.10+.

## Contracts and inference

Annotate public function parameters and return values, including `-> None`, so
callers can use the contract without reading the implementation. Annotate public
attributes where their intended type is not already clear from typed assignments.
Usually leave `self`, `cls`, obvious local values, and comprehension variables to
inference. Add local annotations for ambiguous empty containers or intended wider
types. These are maintainability recommendations, not Python runtime requirements.

Prefer `list[T]`, `dict[K, V]`, `set[T]`, and `tuple[...]` for concrete collections;
use `collections.abc` types such as `Iterable`, `Sequence`, `Mapping`, and
`Callable` when the contract needs their operations rather than a concrete type.
Builtin collection generics arrived in **3.9** (PEP 585), not 3.10. `typing.List`
and similar aliases still work; do not call valid legacy code a correctness bug.

Use `X | Y` and `X | None` on this skill's 3.10+ baseline. `None` in a type means
the value may be `None`; it does not make a parameter optional to pass. Defaults
control omission. Narrow an optional value before using non-optional operations.
`Union` and `Optional` remain valid spellings when existing conventions require them.

```python
from collections.abc import Callable, Iterable


def format_items(items: Iterable[int], render: Callable[[int], str]) -> list[str]:
    return [render(item) for item in items]
```

Use `object` for an unknown value that must be narrowed before use. `Any` permits
unchecked operations and propagates through code; reserve it for genuinely dynamic
boundaries, not as a way to silence a known type error. An annotation on the result
of a JSON parser does not validate the parsed data.

## Generics and aliases

Use a type parameter when it connects inputs, outputs, or stored values. Do not
introduce one where a concrete type or an interface states the whole contract.
Python 3.10–3.11 use `TypeVar` and `Generic`; that form remains supported later.

```python
from typing import Generic, TypeVar

T = TypeVar("T")


class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value: T = value

    def get(self) -> T:
        return self.value
```

`TypeVar("T", str, bytes)` constrains a type variable to one of the listed types;
`TypeVar("T", bound=Base)` allows subtypes of `Base` and preserves their type.
These are different contracts. Python 3.12's PEP 695 syntax supports **both**
constraints (`T: (str, bytes)`) and bounds (`T: Base`), with locally scoped type
parameters. See the [3.12 delta](../../versions/python-3.12.md) for runnable syntax.

On 3.10–3.11, mark an alias explicitly with `TypeAlias` when useful, especially
when a quoted forward reference might otherwise look like a string variable:

```python
from typing import TypeAlias

JsonValue: TypeAlias = (
    dict[str, "JsonValue"] | list["JsonValue"] | str | int | float | bool | None
)
```

An ordinary alias assignment evaluates its right-hand side immediately, so
quote recursive references there as one whole string.
The `type` statement in 3.12+ creates a lazily evaluated `TypeAliasType` instead.
An alias names a type expression; it does not validate data or create a distinct
nominal domain type. Use `NewType` when static distinction is the actual goal.

Use `Self` (stdlib 3.11+) for methods returning `self` or factories returning the
actual `cls`, preserving subclass types. Do not use it for a method that always
constructs a specific base class. `typing_extensions.Self` is a dependency-based
option for 3.10; a bound `TypeVar` also remains valid.

For one implementation, use the concrete class or a plain callable, and add
no interface for a second implementation that does not exist yet. When a second
real implementation exists and the project allows an interface, choose a
`Protocol` for structural compatibility without required inheritance, or an
abstract base class for an explicit inheritance contract with shared code.
`@abstractmethod` alone does not make an ordinary class abstract.

## Narrowing and input validation

Do not use `typing.cast` in new code. A cast returns the same object unchanged,
so the cast neither checks nor converts the value, and the cast can hide a real
type error behind a claim the runtime never tested. For a value that stays
inside the code, give the value the right type where the code creates the value,
or narrow the value with ordinary control flow where the code receives the
value. For data that comes from outside the code, decode the data into a named
model with a schema aware decoder at the place where the data enters, so a
mismatch raises at that place instead of passing into the rest of the code.

At an untrusted boundary, validate with explicit checks and exceptions. In
source code, write a required condition as an `if` check with a `raise` and a
clear message. Do not use `assert` for that check in source code, because an
optimized run can remove it. Do not duplicate a validation that a trusted
boundary already guarantees.

A runtime check must establish the **actual target type**. Checking
`MutableMapping` or the presence of `__setitem__` does not prove `dict[str, str]`.
Checking `dict` alone does not establish key and value types; parameterized
containers cannot be passed to `isinstance` for element validation.

```python
def require_str_mapping(value: object) -> dict[str, str]:
    if not isinstance(value, dict):
        raise TypeError("Expected a dict")
    result: dict[str, str] = {}
    for key, item in value.items():
        if not isinstance(key, str) or not isinstance(item, str):
            raise TypeError("Expected string keys and values")
        result[key] = item
    return result
```

The function builds a new dictionary from the values it checked, and it returns
an empty dictionary for an empty input. The result holds only the checked
values, so a caller cannot change the result later by changing the input
through another name. When the input is JSON and the project has declared
msgspec, decode the bytes with `msgspec.json.decode(data, type=...)` and a named
`Struct` model instead of checking a parsed value by hand. When the project has
declared another schema aware decoder, use that decoder in the same way.

## Finite value sets

Use `Literal` for a genuinely closed set of meaningful values, not every string
that happens to be compared. Open-ended user names, paths, or external identifiers
remain `str`. An enum can be a better fit when values also need runtime identity
or behavior. Match external API spellings; internal casing is
[optional house style](../house-style.md), not a typing rule.

```python
from typing import Literal, TypeAlias

Status: TypeAlias = Literal["queued", "complete"]


def parse_status(value: str) -> Status:
    if value == "queued":
        return "queued"
    if value == "complete":
        return "complete"
    raise ValueError(f"Unknown status: {value}")
```

`Literal` catches invalid values statically; it does not enforce the set at
runtime. Boundary checks such as this parser provide that separate guarantee.

## Annotation evaluation and imports

On 3.10 to 3.13, function annotations normally evaluate when the function is
defined. Import names normally at module scope, and quote a forward annotation
as one whole string (`"Node | None"`, not `"Node" | None`) when the name is not
yet bound. Do not add `from __future__ import annotations` or a
`typing.TYPE_CHECKING` guard in new code. An import inside a function body is
too late for an eagerly evaluated signature, so define or import the name before
the signature that uses it.

Existing code can carry the future import or a guarded import from an earlier
choice. Removing the future import changes the stored form of the annotations,
and a guarded name is absent at runtime, so check every reader that evaluates
annotations before you remove either one. Runtime introspection, including
`typing.get_type_hints`, can raise `NameError` for a guarded name unless the
caller supplies that name. A guard does not repair a circular import that
executable code needs, so move the shared contract to a lower level module when
runtime imports form a cycle.

Treat annotation inspection as an execution boundary, not a safe parser.
`typing.get_type_hints()` can execute code in annotation expressions, including
strings supplied through `__annotations__`. Python 3.14's `annotationlib` has the
same general risk; requesting `STRING` or `FORWARDREF` is not a security sandbox.
Read source instead when execution is not authorized; do not pass untrusted
annotation strings to evaluation APIs. See the official
[annotation inspection security guidance](https://docs.python.org/3.14/library/annotationlib.html#security-implications-of-introspecting-annotations).

Default deferred annotation evaluation (PEP 649/749) starts in **3.14**, not 3.13.
Deferred evaluation still does not make arbitrary circular runtime imports safe.
On 3.14, an existing future import continues to produce stringified annotations,
so removing that import changes the runtime form and needs the same reader check
described above. Use the [3.14 examples](../../versions/python-3.14.md#annotation-behavior)
and check the
[3.14 annotation migration guidance](https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-porting-annotations)
when upgrading annotation-consuming code.

## Official references

- [Typing contracts, aliases, and `Self`](https://docs.python.org/3.13/library/typing.html)
- [Standard collection generics: PEP 585](https://peps.python.org/pep-0585/) and [unions: PEP 604](https://peps.python.org/pep-0604/)
- [Type parameter syntax: PEP 695](https://peps.python.org/pep-0695/)
- [Abstract base classes](https://docs.python.org/3.13/library/abc.html)
