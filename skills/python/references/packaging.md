# Packaging and dependencies: check the delivered installation

Use this page for package creation, dependency changes, installation failures,
or release work. Do not impose a package layout or a build backend during a small
fix in an existing project.

## Start a new project

Choose the supported version range from the project purpose, dependency
support, and deployment targets. Prefer a current maintained stable release
for an application; choose a library's consumer support deliberately. Declare
`requires-python` in `pyproject.toml` and check current official guidance before
making version claims.

Add only dependencies needed for the first requested behavior through the
chosen environment workflow. Reuse the standard library or a declared
dependency when it already provides the capability.

Use the smallest layout that supports the first public path. Create a package
when an import or distribution boundary needs it, and an entry point when a
command needs it. Avoid speculative interfaces, packages, helper scripts, and
maintenance documents.

Write the first real end to end case before its feature implementation. Choose
and configure the checks needed for the project using each tool's native
configuration; keep those choices while they serve the project.

## Identify the environment and artifact

Read the affected package's metadata and existing build/test commands. Distinguish
build-system requirements, runtime dependencies, optional extras, and development
or dependency groups. A tool being installed locally does not make it a declared
runtime dependency. Match import names to distribution names deliberately.

Use the declared supported interpreter range and check dependency/stub support
separately. For applications, preserve the chosen lockfile and deployment policy.
For reusable libraries, declare compatible runtime ranges rather than treating
a developer's complete environment freeze as the consumer's requirements.
Record the exact resolved environment used for evidence; do not claim a lockfile
alone makes execution identical across platforms or external services.

Do not install missing packages globally or modify unrelated lockfiles. Use the
project's existing isolated environment and authorized dependency workflow.
Dependency installation and build backends can execute code; inspect unfamiliar
projects before building. Do not publish a package as part of a local build check.

## Verify outside the source checkout

Build the source distribution and wheel using the existing backend. Also build a
wheel from the source distribution when source releases are promised. Install the
wheel into a fresh environment and run relevant imports, packaged-resource access,
console commands, and representative tests from an unrelated working directory.
Inspect the imported module's path so checkout imports cannot hide missing files.

Check package data, public re-exports, optional features, and the no-extra install.
A `src/` layout can help prevent accidental checkout imports; it is not a required
migration. Prefer `importlib.resources` for package-owned resources rather than
assuming the caller's working directory or an ordinary filesystem layout.

For a typed distribution, include and test the intended `py.typed`/stub contents.
Check dependency metadata and entry-point exit statuses. Run the supported-version
and operating-system cases affected by the artifact; a universal-looking wheel
filename does not prove its runtime behavior is portable.

## Preserve migration and release contracts

Keep compatible public imports and data formats unless a migration was requested.
Update documentation and example consumers with intentional changes. Follow the
project's deprecation/version policy rather than inventing a fixed grace period.
Test editable and ordinary installs separately when both are supported.

Rebuild after changes to metadata or package contents. Inspect the exact artifact
being delivered, excluding caches, local environments, build residue, and secrets.
Distinguish build failure, dependency resolution failure, and test failure.

Sources: [project metadata](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/),
[packaging tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/),
[installed-package tests](https://docs.pytest.org/en/stable/explanation/goodpractices.html),
[package resources](https://docs.python.org/3/library/importlib.resources.html),
[typed package distribution](https://typing.python.org/en/latest/spec/distributing.html).
