# A check the project keeps

Start with the outcome a user can observe. Find the project's existing verify
skill, run instructions and supported entry points. Update an existing verifier
when it covers the same flow. A check you run once needs no file.

Run the flow from the project's working directory with the tools available to
its users. Record the input, the exact action and the observation that proves
the outcome. A successful command can still produce the wrong result. When a
safe comparison is possible, use a known wrong result to show the check can
distinguish it. Use disposable inputs for writes.

Save the proven steps in a project-local SKILL.md at the location the target
host discovers. Follow the repository's naming convention. If it has none, use
`verify-<app>/SKILL.md` in the host's project skills directory. Supply a
name and a description that identifies the flow. Include
required setup, observable pass and failure conditions, and cleanup for
only the scratch data and processes this run creates. Preserve evidence the
user needs and avoid collisions with a running instance. Respect the project's test and publication rules.

Follow the saved instructions from a fresh starting state. Report the path,
the result you observed and any step you could not exercise.
