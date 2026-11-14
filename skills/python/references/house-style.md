# Optional house style

Read this only when the user or project explicitly adopts an opinionated style.
These preferences retain useful parts of the upstream Dignified Python style;
they are not Python correctness requirements. Adoption can be selective. Existing
project policy and the user's requested scope take precedence.

| Preference | Reason to choose it | Boundary or exception |
| --- | --- | --- |
| Absolute imports within a package | Make origin explicit | Relative imports are valid; preserve established package conventions. |
| A canonical implementation import path | Reduce accidental indirection | Public re-exports and `__all__` can define a stable facade; do not remove them merely for style. |
| Explicit arguments for policy decisions | Make consequential choices visible | Stable, safe defaults reduce noise; do not require every caller to restate them. |
| Keyword-only options in complex signatures | Prevent swapped arguments | Choose by call-site ambiguity, not an arbitrary parameter count; preserve required external signatures. |
| Explicit preconditions for ordinary branching | Make intent easy to inspect | Prefer narrow exception handling for parsing and race-prone operations. |
| An interface only for a second real implementation | Share implementation or match a shape that two real classes already have | A concrete class or a plain callable covers one implementation. Neither an abstract base class nor a protocol checks signatures at runtime. |
| Kebab-case for internal finite string values | Consistent spelling | Match external schemas and existing project literals instead of renaming them. |
| Shallow nesting and nearby variable definitions | Reduce reading effort | Extract meaningful operations, not helpers that only satisfy a depth limit. |
| Direct attribute access for trivial single-use values | Avoid redundant names | Keep a local when it explains meaning, avoids repeated work, or captures a stable value. |
| Clean internal API migrations | Avoid unused compatibility branches | Migrate all known callers; preserve externally supported APIs or follow the project's deprecation policy. |

When a project adopts a preference, state the convention once in project
guidance or in the existing lint configuration. Do not scatter repeated checks
or comments through implementation code to enforce a prose preference.
