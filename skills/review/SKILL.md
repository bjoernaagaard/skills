---
name: review
description: Have a subagent review the current changes and report its findings. Use when the user says "review", "review this", or asks for a second look at their changes.
---

# Review

Have a fresh subagent review the current changes, then report what it found.

## Brief the reviewer

Choose a fresh reviewer with [model-router](../model-router/SKILL.md).
Use the host the user requested. If independent review is unavailable,
follow model-router's disclosure rule. Give the reviewer:

- The goal of the change, in the user's words.
- The comparison base from the request or the project's branch policy.
  Compare the working tree to its merge base with HEAD and inspect untracked
  files so the review covers committed and uncommitted changes.
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
