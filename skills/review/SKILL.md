---
name: review
description: Have a subagent review the current changes and report its findings. Use when the user says "review", "review this", or asks for a second look at their changes.
---

# Review

Have a fresh subagent review the current changes, then report what it found.

## Brief the reviewer

Start one subagent with the Task tool (`Agent` in Claude Code,
`spawn_agent` in Codex). Give it:

- The goal of the change, in the user's words.
- How to read the change: `git diff $(git merge-base HEAD origin/HEAD)` plus
  untracked files, so it sees committed and uncommitted work.
- The scope: correctness bugs, breaking changes, security problems, and code
  that is harder to maintain than it needs to be.
- An instruction to report each finding with its file and line, the concrete
  input or state that triggers it, and how sure it is.

Do not share your own opinion of the change. The reviewer should reach its
own view. Do not let it edit files.

## Check the findings

Read the code behind each finding. Drop findings that the code disproves, and
say which ones you dropped and why.

## Report

Give the confirmed findings, most severe first. Change nothing until the user
asks for a fix.
