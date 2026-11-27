---
name: research-design-implement
description: Run or resume research-only codebase investigations, scoping questions, design discussions, PRDs, technical designs, outlines, or phased implementations with sourced evidence and default visuals. Skip routine edits and simple lookups (or suggest /where).
---

# Research, design and implement

Use normal project work for a routine edit. Enter at the requested phase, do only the discovery it needs, reuse evidence and decisions in hand, iterate when evidence changes, and stop after the last requested phase.

## Show structure instead of prose walls

Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Lead every phase reply and design doc with the takeaway and the view below, using real paths, symbols, values, and revisions. Limit surrounding prose to one or two sentences, and skip a visual only when one sentence answers it.

## Phases and finish conditions

| Phase | Show with | Finish condition |
| --- | --- | --- |
| Questions | Table or 3 to 5 bold bullets of open choices with options and pick | Settle everything code or docs can answer. Ask only decisions the user owns. |
| Research | File or call tree, Mermaid flow, or config vs. observed table | Explain current behavior and constraints with paths and inspected revision. Separate manifests, config, and docs from observed runtime, and label unverified claims. Research only stops here. |
| Design discussion | Comparison table of options, consequences, and pick (or `diff` or diagram) | Viable options, consequences, and a recommendation are clear. |
| PRD | Tables for outcomes, scope, and acceptance criteria | Defines user outcomes, scope, and observable acceptance criteria. |
| Technical design | Mermaid diagram, file tree, interfaces or pseudocode, and failure table | Defines system and code shape, interfaces, state, and failure behavior, not code or tests. TDD follows the test rules below. |
| Outline | Ordered table of slices, scope, and observable check | Orders work into implementable slices with observable checks. |
| Implementation | Result, focused `diff` or before and after table, and check output | Lead completes the change and proves it on the real app or command with [verify-change](../verify-change/SKILL.md) and existing checks. |

## Continuity and resume

Keep the goal, paths and revisions, settled choices, open decisions, and observed checks in the existing artifact or workflow state, else in the reply. Create a new artifact only when requested.

On resume, confirm the phase and record before advancing, recheck stale evidence against the current revision, and reopen settled choices only on new evidence. Route interrupted session recovery to [session-pickup](../session-pickup/SKILL.md), and answer simple lookups directly or suggest `/where`.

## Ownership, permissions, and tests

The lead owns implementation and proof, and delegates only when authorized. Match file edits, commands, and external actions to the requested phase. Research, design, and planning authorize no project edits, delegation, or publishing on their own.

Follow standing test rules. Never add unit, integration, or mock tests. Add end-to-end, property, or differential tests only when requested or already in the project. Watch a new test fail once on broken behavior, leave a rerunnable artifact, and rerun proof after any edit.

## Example

Design discussion on repeated saves (`abc1234`, `store.go:42`). Recommend **Write always** because `watcher.go:19` depends on mtime updates.

| Option | Disk writes | Effect on `watcher.go:19` |
| --- | --- | --- |
| Write always (recommended) | 1 per save | Triggers reload as expected |
| Cache unchanged payload | 0 on repeat | Misses reload until watcher changes |

For research only, report current behavior with a view, source paths, and inspected revision, then stop.

## Related skills

Use one when its case comes up and it is installed.

- Picking a table, tree, Mermaid diagram, `diff`, or HTML chart → [visual-explanation](../visual-explanation/SKILL.md)
- Plain prose and structure for a PRD, design doc, or report → [human-writing](../human-writing/SKILL.md)
- A why question with several causes, or a choice between options → [issue-tree](../issue-tree/SKILL.md)
- An implementation with several outcomes that each need a check → [deliver](../deliver/SKILL.md)
- A phase ends and another person or agent takes the next one → [sbar](../sbar/SKILL.md)
