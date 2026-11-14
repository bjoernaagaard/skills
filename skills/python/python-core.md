# Core Python guidance

<!-- Modified derivative; see SKILL.md for attribution. -->

Apply this guidance within the project's supported Python versions and existing
contracts. Existing code conventions override the defaults below. An unfamiliar
style is not itself a bug.

## Contracts and input boundaries

- Preserve documented API behavior, error signals, data formats, and supported
  versions unless changing them is part of the task.
- Do not claim that annotations, ABC membership, or assertions validate
  untrusted input. Validate at the boundary that owns the input contract.
- Do not use `typing.cast` in new code, not even after a hand check. When data
  comes from outside the code, decode that data into a named model at the place
  where the data enters, and let the decoder raise when the data does not match
  the model. When a value stays inside the code, give the value the right type
  where the code creates it, or narrow the value with ordinary control flow
  where the code receives it.
- For JSON, use `msgspec.json.decode(data, type=...)` with a named `Struct`
  model when msgspec is the decoder the project has declared. When the project
  has declared another schema aware decoder, use that decoder in the same way.
  Add msgspec, or any other package, only through the dependency workflow the
  project already uses, and do not replace a declared library without a request
  to do so.
- Treat imports and runtime annotation inspection as code execution. Do not
  import untrusted modules or evaluate externally supplied annotation strings
  merely to inspect types; prefer reading source when execution is not authorized.
- Catch failures only when you can recover as specified, translate them at a
  boundary, or add useful context. A printed error is not a failed exit status.
- Treat a pre-check and the subsequent operation as separate events. Files and
  shared state can change between them; catch expected failures from the actual
  operation when recovery is required.

## Defaults, not universal rules

- Prefer simple, explicit branches when the condition is cheap and precise.
  Prefer a narrow `try/except` when parsing or I/O is the authoritative test.
  LBYL and EAFP are tools, not competing correctness standards.
- Prefer `pathlib.Path` for new path-oriented code, but retain an established
  `os.path` interface when changing it is unnecessary. Specify the encoding
  required by the data format; use UTF-8 for formats that define or adopt it.
- Use `.exists()` only when a coarse presence result is enough. In 3.14 it
  suppresses operating-system errors; use `stat()` to distinguish absence from
  denied access (see [3.14](versions/python-3.14.md#filesystem-errors)). `resolve()` defaults to
  `strict=False`; use `strict=True` if missing paths should fail.
  `is_relative_to()` is a lexical boolean test, not a filesystem existence check.
- Keep imports at module scope by default and import names normally. Do not add
  `typing.TYPE_CHECKING` or `from __future__ import annotations` in new code. On
  a Python version that evaluates annotations when a function is defined, quote
  a forward reference as one whole string when the name is not yet bound.
- In source code, state a required condition with an explicit `if` check and a
  `raise` with a clear message. Do not use `assert` for that check in source
  code, because an optimized run can remove the check. An `assert` in an end to
  end test states the expected result of that test, and that use stays in tests.
- Use public names for the functions, classes and constants of a module. Do not
  start a new module level name with an underscore. List the names that callers
  may import in `__all__`, which marks the API without an underscore on the
  rest. A method that only its own class calls may start with one underscore.
- Write a comment only for a reason the code cannot show, such as a limit an
  outside service sets or the reason an obvious shorter form is wrong. Do not
  write a comment that says what the code does. Add a docstring only when it
  states something the name and the types do not already state, and keep a
  written docstring to one line. A checker suppression may appear only in the
  narrow form the project permits, and it carries no extra reason text.
- Start with a concrete class or a plain callable for one implementation. Do
  not introduce a `Protocol` or an abstract base class for a second
  implementation that does not exist yet.
- Give surprising or expensive operations explicit method names. Properties
  should be cheap and unsurprising; do not impose O(1) on every magic method.
  Equality, representation, and iteration may legitimately scale with input size.
- Use local names, helper functions, and context managers to clarify ownership
  and lifetime. A single-use local or a named context manager is not inherently
  an anti-pattern.

Do not turn a focused change into a rewrite of imports, package exports,
parameter defaults, or compatibility policy. Those decisions belong to the
project. The original skill's stronger preferences are available only as
[optional house style](references/house-style.md).
