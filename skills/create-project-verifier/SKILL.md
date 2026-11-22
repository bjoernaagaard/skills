---
name: create-project-verifier
description: Write or update a project skill that checks a user-visible outcome through the real app or command. Use when the user asks for a reusable verifier.
---

# Create a project verifier

Start with the outcome a user can observe. Find the project's existing verify
skill, run instructions and supported entry points. Update an existing verifier
when it covers the same flow. For a one-off check, use
[verify-change](../verify-change/SKILL.md).

Run the flow from the project's working directory with the tools available to
its users. Record the input, the exact action and the observation that proves
the outcome. A successful command can still produce the wrong result. When a
safe comparison is possible, use a known wrong result to show the check can
distinguish it. Use disposable inputs for writes.

Save the proven steps in a project-local SKILL.md at the location the target
host discovers. Follow the repository's existing naming convention. Include
required setup, observable pass and failure conditions, and cleanup for
anything the flow creates. Respect the project's test and publication rules.

Follow the saved instructions from a fresh starting state. Report the path,
the result you observed and any step you could not exercise.
