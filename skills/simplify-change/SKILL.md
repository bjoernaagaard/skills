---
name: simplify-change
description: Simplify an existing diff or named code scope by removing demonstrated excess while preserving required behavior. Use for simplification requests, not unrelated cleanup.
---

# Simplify a change

Find a simpler implementation of the required behavior within the authorized
scope. A scope that is already simple can finish unchanged.

## Assess the complete scope

Establish acceptance criteria and relevant callers, state changes, side effects,
failure handling, and trust boundaries. Keep track of assessed files, including
those needing no edit, in working context.

Describe the simplest viable flow, then compare the current code against it.
Read known paths directly. Map unfamiliar structure only when it helps locate
relevant code. Trace actual calls and data flow across affected units; an outline
does not establish execution or runtime state.

Look for duplicated transformations, pass-through layers, speculative
configuration, obsolete paths, repeated validation within one trust boundary,
and names that overstate guarantees. Consider callers and consumers together.
For each supported reduction, identify the purpose it serves and how required
behavior survives. Keep justified ownership, variation, and security boundaries.

## Reduce and finish

Apply coherent reductions and update controlled callers together. Follow the applicable coding and verification policies. Investigate unclear consequential protection before removing it, and leave unrelated style changes alone.

Revisit paths whose responsibilities or data flow changed. Follow new evidence of further in-scope reductions without stopping at the first local cut, and avoid fixed pass counts or changes made merely to justify another pass.

Finish after assessing the full scope, applying or retaining reductions with concrete reasons, and proving affected behavior. Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Lead with the outcome and a reduction table (`Location`, `Removed`, `Why behavior survives`) or focused `diff` with one or two sentences of prose, plus retained complexity and verification gaps. Skip the table when unchanged, and do not claim a global minimum.

## Related skills

Use one when its case comes up and it is installed.

- Showing before and after reductions with a `diff` or table → [visual-explanation](../visual-explanation/SKILL.md)
- Proof that the behavior survived the reduction → [verify-change](../verify-change/SKILL.md)
- A second look from a fresh agent → [review](../review/SKILL.md)
