# Optional tool policies

Use these templates only after the user or project chooses a policy. Each
template is a complete TOML fragment to merge with care into the existing
`pyproject.toml`, and no template replaces project metadata. Do not create a
second tool table next to a table the project already has.

`correctness.toml` chooses a small Ruff diagnostic set with gradual mypy checks.
`strict.toml` adds a larger agreed lint set with mypy strict checking. Neither
template chooses a dependency manager, and neither template requires a reformat
of an existing repository. Each template sets Python 3.10 as an example floor,
so update that setting to the declared minimum before you adopt a template. A
Python 3.14 only application must not copy the example floor without that update.

Keep the configuration the project already has as the authority for that
project. A Ruff `ALL` selection with a curated list of ignored rules is a
deliberate policy when a project chose that selection on purpose, so keep that
selection as the project wrote it instead of replacing the selection with one of
these templates. Do not turn `ALL` on for a project that has not chosen that
selection. Resolve and pin the chosen tool versions in the environment workflow
the project already uses, and check that those versions support the selected
Python target. Review changes to a strict bundle at each upgrade, because a new
rule can add diagnostics and an unsafe automatic fix can change behavior. Keep
exceptions for tests and for generated code explicit and narrow instead of
adding broad ignores before a diagnostic asks for one.

Keep the primary type checker the project already selected. These templates
carry mypy settings, so a template fits a project that already uses mypy as that
checker. Do not use a template to replace a selected checker such as ty or
Pyright with mypy, and state the behavior you want before you translate a
diagnostic from one checker into settings for another checker.

Validate the merged configuration with the actual tools and with real positive
and negative cases, and use a check mode that changes no files first. A TOML
parse alone does not prove that a tool accepts the configuration or that the
configuration detects the defect you want detected.
