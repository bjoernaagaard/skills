---
name: review
description: Have a subagent review the current changes and report its findings. Use when the user says "review", "review this", or asks for a second look at their changes.
---

# Review

Have a fresh subagent review the current changes, then report what it found.

## Brief the reviewer

Pick a fresh reviewer with [model-router](../model-router/SKILL.md) on the requested host, or disclose unavailability per model-router. Give the reviewer:

- The goal in the user's words.
- The comparison base from the request or branch policy, comparing the working tree and untracked files to its merge base with HEAD.
- Scope: correctness bugs, breaking changes, security problems, and needless maintenance complexity.
- Output: each finding's file and line, concrete triggering input or state, and confidence.

Withhold your opinion, and forbid file edits.

## Check the findings

Read the code behind each finding. Drop findings the code disproves, and state which ones you dropped and why.

## Report

Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Lead with the verdict and a findings table (`Severity`, `Location`, `Trigger`, `Impact`), most severe first, then one short bullet per dropped finding. If none hold, say so in one sentence. Change nothing until asked.

## Related skills

Use one when its case comes up and it is installed.

- Picking a table or `diff` for review findings → [visual-explanation](../visual-explanation/SKILL.md)
- A finding you can reproduce by running the case → [verify-change](../verify-change/SKILL.md)
- The user asks you to fix a finding about needless complexity → [simplify-change](../simplify-change/SKILL.md)
- The review goes into a pull request → [write-pr-body](../write-pr-body/SKILL.md)
