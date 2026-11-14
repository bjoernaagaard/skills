---
description: Concrete classes, dependency injection, and interfaces when a second implementation exists.
---

# Interfaces and dependency injection

Choose the smallest contract the consumer needs. For one implementation, a
concrete class or a plain callable states the whole contract. Add an interface
only when a second real implementation exists and the project allows that form.
Python 3.10 and later support every feature this page discusses.

## When a second implementation exists

| Need | Consider | Tradeoff |
| --- | --- | --- |
| Explicit inheritance and shared implementation | Abstract base class | Implementations join a hierarchy and share code |
| Existing or independently owned implementations | `typing.Protocol` | Structural compatibility without inheritance |
| Small consumer specific contract | A plain callable | The consumer states only the call it needs |
| Runtime capability validation | Explicit checks with a clear error | Neither interface form validates behavior |

Ownership alone does not choose between an abstract base class and a protocol.
Follow the convention the project selected when a real second implementation
makes an interface useful.

An abstract base class prevents instantiation while abstract members remain
unimplemented under normal inheritance. It does not validate overriding method
signatures or return types at runtime. `isinstance()` checks membership, and it
does not check behavioral compatibility. Virtual subclasses registered with
`register()` do not need to implement abstract methods, and they do not inherit
the implementations from the base class.

A protocol describes a structural contract for a static type checker. A protocol
without `@runtime_checkable` cannot take part in an instance check, and a
runtime checkable protocol checks attribute presence rather than signatures or
annotated types. Protocol methods can carry default implementations, but a class
that matches the protocol in shape does not inherit those defaults. See the
[shared typing guidance](typing-advanced.md) for typing boundaries.

## Inject a concrete dependency

```python
from dataclasses import dataclass


class MemoryStore:
    def __init__(self, data: dict[str, str]) -> None:
        self.data = data

    def get(self, key: str) -> str:
        return self.data[key]


@dataclass
class GreetingService:
    store: MemoryStore

    def greet(self, key: str) -> str:
        return f"Hello, {self.store.get(key)}!"


service = GreetingService(MemoryStore({"primary": "Ada"}))
```

The service names the one concrete store the code has, so a reader can follow
the call without an interface layer in between. `MemoryStore` borrows the
dictionary the caller supplies, so a later change to that dictionary stays
visible through the store. Copy the dictionary at construction when the store
needs the values as they were at that moment. A missing key raises `KeyError`
from `get`, which matches the `str` return the method promises.

Constructor injection makes a dependency explicit without a container or a
service locator. Wire the concrete object at the application boundary, and let
consumers use the object they receive instead of choosing an implementation
inside their own code. The owner that creates a session, a file, or a network
connection also owns the cleanup for that resource, unless the code transfers
that ownership in a stated contract.

Use static type checking to catch an incompatible method and a real end to end
case for behavior such as missing keys and resource lifetime. A runtime
membership check establishes neither fact.

## Sources

- [Abstract base classes and abstractmethod](https://docs.python.org/3.10/library/abc.html#abc.abstractmethod)
- [Protocols and runtime_checkable](https://docs.python.org/3.10/library/typing.html#typing.runtime_checkable)
- [Protocol default implementations](https://typing.python.org/en/latest/spec/protocol.html#explicitly-declaring-implementation)
