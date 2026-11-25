---
name: research-design-implement
description: Investigate how a codebase or system works with sourced evidence and stop at findings, or run and resume scoping questions, design discussion, PRD, technical design, implementation outline, and implementation phases. Use when the user asks for "research only", a codebase or system investigation, a design discussion, a PRD, a technical design, an outline, or a phased change. Skip for routine edits and simple path or symbol lookups, answering directly or suggesting /where when installed. Route general handover recovery to session-pickup.
---

# Research, design and implement

Use normal project work for a routine edit with no phase request. Enter directly at the requested phase, do only the prerequisite discovery that phase needs, and reuse evidence and decisions already in hand. Iterate when evidence changes, and stop at the end of the last requested phase.

## Phases and finish conditions

| Phase | Finish condition |
| --- | --- |
| Questions | Project evidence answers every question the code or docs can settle. Ask only about remaining decisions the user owns. |
| Research | Findings explain current behavior and constraints with source paths and the inspected revision. Distinguish manifests, configuration, and documented instructions from observed runtime behavior, and label anything outside observed evidence as unverified. A request for research only stops after reporting the findings. |
| Design discussion | Viable options, consequences, and a recommendation are clear. Show a compact comparison table or [visual-explanation](../visual-explanation/SKILL.md) view when it helps settle a choice. |
| PRD | The document defines user outcomes, scope, and observable acceptance criteria. |
| Technical design | The document defines system and code shape, including interfaces, state, and failure behavior. Technical design produces a design document rather than code or tests. Test-driven development is a coding method subject to the implementation test rules below. |
| Outline | Work is ordered into implementable slices with observable checks. |
| Implementation | The lead completes the agreed change and proves it through the real app or command using [verify-change](../verify-change/SKILL.md) and existing project checks. |

## Continuity and resume

Carry the goal, source paths and revisions, settled choices, open decisions, and observed checks in the existing task artifact or workflow state. When neither exists, put the same facts in the reply. Create a new artifact only when requested.

On resume, confirm the current phase and record before advancing, recheck stale evidence against the current revision, and reopen a settled choice only when new evidence warrants it. Route general interrupted session recovery to [session-pickup](../session-pickup/SKILL.md). For simple path or symbol lookups, answer directly or suggest `/where` when installed.

## Ownership, permissions, and tests

The lead owns implementation and proof, and delegates only when authorized. Apply the permissions of the requested phase to file edits, command execution, and external actions. Research, design, and planning phases authorize no project edits, delegation, or publishing on their own.

During implementation, follow the user's standing test rules. Never add unit, integration, or mock tests. Add an end-to-end, property, or differential test only when requested or when the project already has tests of that kind. Watch any new test fail once on broken behavior, leave a rerunnable artifact, and rerun the relevant proof after any edit.

## Example

In a design discussion about repeated saves, a two-row table can compare one expected disk write with zero and show where each result comes from. Check callers first to see whether a file watcher depends on the write before recommending a cached return. If the request asks for research only, report the current behavior with source paths and the inspected revision, and stop there.

## Related skills

Use one when its case comes up and it is installed.

- A why question with several possible causes, or a choice between options → [issue-tree](../issue-tree/SKILL.md)
- An implementation with several outcomes that each need a check → [deliver](../deliver/SKILL.md)
- A phase ends and another person or agent takes the next one → [sbar](../sbar/SKILL.md)
