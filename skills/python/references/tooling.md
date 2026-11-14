# Checkers, linters, and optional policy

## Use the repository's actual configuration

Find existing test, formatting, lint, and type-check commands and their configured
scope before proposing new tools. Read applicable `pyproject.toml`, tool-specific
config, CI, lockfiles, and local project guidance only as relevant. Nested packages
may have different policies. An explicit config or command-line flag may change
what the tool reads; use its diagnostics to inspect effective settings.

Record the exact tool version, interpreter target, command, and scope when they
matter. Running a checker on a newer Python does not authorize newer project
syntax. Use the correct dependency/stub environment. Do not replace a selected
mypy, Pyright, Ruff, or formatter simply because another is familiar.

## Diagnose before suppressing

Separate runtime defects, static-contract violations, configuration/environment
errors, and adopted style rules. A type-check success is not runtime validation;
a lint failure need not be a functional defect.

For a missing import, check installed dependencies, distribution/import names,
target environment, stubs, and intended optionality. Broad missing-import
suppression can turn imported contracts into `Any`. Do not fix a real mismatch
by adding `Any`, a false cast, global ignores, or excluding the affected package.
Use only the narrow checker suppression the project permits, in the exact form
the project allows and with no added reason text, for a real checker limitation.
Check whether the suppression has become unnecessary when you upgrade the
checker.

Do not assume two checkers interpret every advanced feature identically. Choose
a primary project checker; use a second one when the project promises both or
when investigating a specific disagreement. Reproduce with a minimal typed case
and current documentation, without weakening the intended runtime contract.

## Apply automated edits deliberately

Check before fixing. Review the proposed scope, the safety category, and the
diff, and retain public re-exports. An unsafe fix can change exceptions,
iteration consumption, evaluation timing, or output. Even safe-category changes
need the relevant project checks. Do not mix a mass-format migration with an
unrelated bug fix.

For example, replacing `list(items)[0]` with `next(iter(items))` changes the empty
case and how much of the input is consumed. The optimization needs an accepted
contract change or equivalent behavior, not merely a passing lint check.

## Optional profiles, never universal requirements

Keep machine-enforceable rules in configuration, not thousands of prompt lines.
Use [profiles](../profiles/README.md) only when explicitly adopting or revising a
policy. Existing project config remains authoritative. The supplied templates
cover a small correctness-oriented selection and an intentionally strict typed
profile; both are choices, not proofs of better software.

Keep the selection the project already made, and expand a selection only after
you review the actual diagnostics the wider selection produces. A Ruff `ALL`
selection with a curated list of ignored rules is a deliberate policy when a
project chooses that selection on purpose, so keep that selection and its
ignores as the project wrote them. Do not turn `ALL` on for a project that has
not chosen that selection, and do not replace a project selection with a bundled
profile. Pin the tool versions in the lock or environment workflow the project
chose, and review upgrades with care, because a strict bundle can add new
diagnostics and an unsafe automatic fix can change behavior. Use the smallest
exceptions the project documents, and retain a route for a deliberate dynamic
boundary. Never report a clean run obtained with `--exit-zero` or with skipped
source files as a completed correctness check.

Sources: [Ruff configuration](https://docs.astral.sh/ruff/configuration/),
[Ruff fixes and rule selection](https://docs.astral.sh/ruff/linter/),
[mypy adoption](https://mypy.readthedocs.io/en/stable/existing_code.html),
[mypy import handling](https://mypy.readthedocs.io/en/stable/running_mypy.html#missing-imports),
[Pyright configuration](https://github.com/microsoft/pyright/blob/main/docs/configuration.md).
