---
name: python
description: >-
  Start, maintain, review, debug, or upgrade Python projects, including tests,
  packaging, and compatibility. Excludes work that only runs a Python script.
---

# Python

This is a modified derivative of [Dagster's Dignified Python](https://github.com/dagster-io/skills), copyright 2025 Dagster Labs, Inc., distributed under the [Apache License 2.0](LICENSE). The local version changes the defaults and reference guidance.

Preserve the requested behavior, public API, and supported Python versions. Follow
explicit user and project requirements over this skill's defaults. Resolve bundled
paths relative to this directory and use the host's available tools.

## Defaults

For new code and examples:

- Write the real end to end case before implementation. Use source data or an
  external contract and disposable resources, without mocks or fakes. Keep a
  repeatable run artifact.
- Validate external data at its boundary with a named model and the declared
  schema decoder. Fix internal types at creation or with ordinary narrowing;
  do not use `typing.cast`.
- Use normal imports, public names, and explicit `if` checks with `raise`.
  Write no code comments and keep useful docstrings to one line.
- Use a concrete class or callable until another real implementation exists
  and project policy allows an interface.
- Keep the project's dependency workflow, checker, and linter configuration.
  Add dependencies through that workflow.

## Set the compatibility boundary

For an existing project, use the affected package's `requires-python` or
`python_requires`, the support policy, and the test matrix the project runs.
Resolve a real conflict between those sources, and do not infer the minimum
version from `.python-version` or from the interpreter that happens to run the
check. When support is unknown, preserve the existing syntax and finish the work
that does not depend on the version, and ask only when a missing choice blocks a
correct change. A version guard cannot hide syntax that an older interpreter
must still parse when it loads the module.

For a new application, prefer a current maintained stable Python release that
its dependencies and deployment target support. For a library, choose the
consumer versions it will support deliberately. Declare the resulting range
in `pyproject.toml`. Check current official Python and dependency guidance;
the bundled release notes neither cap nor choose the version. See
[Packaging](references/packaging.md) for setup and first-feature decisions.

## Select the relevant guidance

Read the affected code and only the references that help the requested change.
Do not load every release note or impose the optional house style.

| Decision | Reference |
| --- | --- |
| Error, path, and API correctness; review defaults | [Core](python-core.md) |
| Types, generics, narrowing, annotation consumers | [Typing](references/advanced/typing-advanced.md) |
| Parsing failures and exception translation | [Error contracts](references/advanced/exception-handling.md) |
| Signatures, defaults, executor submissions | [API design](references/advanced/api-design.md) |
| Concrete classes, dependency injection, interfaces | [Interfaces](references/advanced/interfaces.md) |
| Imports, initialization, cache lifetime | [Module design](references/module-design.md) |
| Process pools, interpreter isolation, free threading, bounded submission | [Concurrency](references/concurrency.md) |
| Live end to end evidence and real resources | [Testing](references/testing.md) |
| Starting a new project, builds, dependencies, installed artifacts | [Packaging](references/packaging.md) |
| Async task ownership, cancellation, deadlines | [Async lifecycle](references/async-lifecycle.md) |
| Type-check/lint diagnostics and repository policy | [Tooling](references/tooling.md) |
| Profiling, streaming, memory, optimization | [Performance](references/performance.md) |
| Resource cleanup, file replacement, transactions, retries | [I/O resilience](references/io-resilience.md) |
| Parsing, untrusted input, code execution boundaries | [Input security](references/security-boundaries.md) |
| Numerical types, joins, timestamps, time-ordered data | [Data contracts](references/data-contracts.md) |
| Configuration, logging, reproducible diagnostics | [Configuration](references/configuration-observability.md) |
| Explicit adoption of a tool/strictness policy | [Optional profiles](profiles/README.md) |
| Click or argparse commands | [CLI](cli-patterns.md) |
| Child processes, exit status, timeouts | [Subprocesses](subprocess.md) |
| Explicitly requested original conventions | [House style](references/house-style.md) |

| Version-sensitive change | Reference |
| --- | --- |
| 3.10: unions, forward references, shared baseline | [3.10](versions/python-3.10.md) |
| 3.11: `Self` and typing additions | [3.11](versions/python-3.11.md) |
| 3.12: type parameter and alias syntax | [3.12](versions/python-3.12.md) |
| 3.13: type parameter defaults | [3.13](versions/python-3.13.md) |
| 3.14: deferred annotations, templates, filesystem and async changes | [3.14](versions/python-3.14.md) |

Consult the target release's [official documentation](https://docs.python.org/3/whatsnew/index.html)
for versions outside these notes or uncertain API behavior. Check dependency and
checker support separately from language support; do not silently upgrade either.

## Complete and verify the change

Carry an implementation through the authorized local edits and the checks the
Defaults call for. For a bug fix, run the same case before and after the fix
when you can. Run the checks the project requires, and broaden or repeat a check
only for changed code, a failure, or an unresolved risk. A small fix needs no
new framework and no full audit.

Report the result and useful evidence in plain language. For reviews, identify
concrete impact and locations, separating defects from preferences. State exact
interpreters and unrun checks when compatibility matters. Keep runtime tests,
static typing, performance measurements, and agent evaluations distinct; a skip
or a syntax-only check is not evidence that an untested runtime works.
