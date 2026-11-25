---
name: session-pickup
description: Reconstruct where a task stopped from its handover, thread and current project state. Use when asked to pick up earlier work or find the next unfinished step.
---

# Pick up a session

Read the named handover or thread and the instructions for its project. Recover
the requested outcome, decisions, permissions, last verified result and open
work. Use only history in the authorized scope. If the prior thread is
unavailable, start from the project evidence and label missing context.

Check the machine, checkout, branch and working tree. Compare the handover
with the relevant commits, files and running jobs. If a named job finished,
read its result before starting another. Recheck a claim when the artifact
changed or the handover lacks evidence for the next decision.

Distinguish what you checked now from what the handover reports. Carry an
approval forward only for the action and destination it covered.

For a status request, leave jobs and files as they are. Still run a check that
changes nothing, such as the test the handover cites, and report its result as
checked now. Give the verified state and next step. For a request to
resume, take the first unfinished authorized step. Preserve unrelated local
changes. Ask only when a missing decision blocks progress.

## Related skills

Use one when its case comes up and it is installed.

- The handover you write when you stop in turn → [sbar](../sbar/SKILL.md)
- A `DONE.md` in the work tree → [deliver](../deliver/SKILL.md)
- The work stopped inside a research, design or implementation phase → [research-design-implement](../research-design-implement/SKILL.md)
- Proof of a claim the handover makes → [verify-change](../verify-change/SKILL.md)
