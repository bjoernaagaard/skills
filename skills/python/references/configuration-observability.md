# Configuration, diagnostics, and reproducibility

## Parse configuration at its owner

Use the project's configuration sources and precedence. Distinguish omitted,
empty, malformed, and deliberately false/zero values. Parse environment strings;
`bool("false")` is true. Validate allowed values and required settings at an
explicit startup boundary, without making library import depend on a machine's
environment. Keep required secrets out of dataclass reprs and validation messages.

```python
def parse_enabled(value: str) -> bool:
    normalized = value.strip().casefold()
    if normalized in {"true", "1", "yes", "on"}:
        return True
    if normalized in {"false", "0", "no", "off"}:
        return False
    raise ValueError("Expected an explicit boolean setting")
```

The 3.10+ example deliberately rejects the empty string. Its accepted spellings
are an example contract, not a mandate to change another application's grammar.
Handle missing values separately in the configuration owner.

## Keep diagnostics useful without changing behavior

Libraries should use their own named logger, not configure root handlers or
change application-wide levels on import. Let the application choose formatting,
outputs, and sensitive-field policy. Use lazy formatting for ordinary messages;
avoid eagerly doing expensive work solely for a disabled log level.

Report errors at the boundary that owns them, retain causes for diagnosis, and
avoid duplicate logging at every stack level. Attach useful request/batch IDs,
counts, elapsed durations, and failure categories; do not print tokens, complete
environments, raw payloads, or credentials. A blanket text replacement is not a
reliable secret-handling policy. Test representative emitted fields and levels.

Keep machine-readable stdout separate from diagnostics and progress. Metrics
labels should not grow with every user or request. Success logging and exit status
must reflect the operation's documented contract. A submission command may
succeed once a job is accepted; distinguish accepted/submitted from completed,
and expose how to observe the eventual outcome. A command promising completed
work must not report success merely because that work was submitted.

## Record what makes a result reproducible

When reporting a benchmark, numerical comparison, or failure, retain relevant
interpreter/build, dependencies, input identity, parameters, timezone assumptions,
random generator setup, and executed command. Seed the actual generators used;
a seed alone does not guarantee identical results across versions, platforms,
thread schedules, or nondeterministic algorithms. Preserve small reproductions
without retaining private data unnecessarily.

Treat caches and mutable globals as lifetime choices. Make configuration reload
and concurrent access semantics explicit when required; do not read changed
environment values implicitly at arbitrary call sites.

Sources: [library logging](https://docs.python.org/3.13/howto/logging.html#configuring-logging-for-a-library),
[environment representation](https://docs.python.org/3.13/library/os.html#os.environ),
[truth-value behavior](https://docs.python.org/3/library/stdtypes.html#truth-value-testing),
[random reproducibility](https://docs.python.org/3/library/random.html#notes-on-reproducibility).
