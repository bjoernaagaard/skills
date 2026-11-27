---
name: session-pickup
description: Reconstruct where a task stopped from its handover, thread and current project state. Use when asked to pick up earlier work or find the next unfinished step.
---

# Pick up a session

Read the named handover or thread and project instructions within authorized scope to recover the goal, decisions, permissions, last verified result, and open work. When continuing a thread whose earlier turns were summarized or omitted (such as after a provider switch or context handoff), pull the omitted turns with the host's thread-reading tool when available before re-running finished work. When prior history is unavailable, start from project evidence and label missing context.

Check machine, checkout, branch, working tree, commits, files, and running jobs against the handover. Read finished job results before starting another, and recheck stale or unsupported claims. Distinguish what you checked now from handover claims, and carry approvals forward only for the action and destination they covered.

For a status request, leave jobs and files alone, run a read-only check (such as a cited test), and report it as checked now. Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Lead with verified state and next step, using a compact table (`Handover claim`, `Checked now`, `Status`) for multi-item checks. To resume, take the first unfinished authorized step, keep unrelated local changes, and ask only when a decision blocks progress.

## Related skills

Use one when its case comes up and it is installed.

- Presenting state drift or multi-item checks cleanly → [visual-explanation](../visual-explanation/SKILL.md)
- The handover you write when you stop in turn → [sbar](../sbar/SKILL.md)
- A `DONE.md` in the work tree → [deliver](../deliver/SKILL.md)
- The work stopped inside a research, design or implementation phase → [research-design-implement](../research-design-implement/SKILL.md)
- Proof of a claim the handover makes → [verify-change](../verify-change/SKILL.md)
