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

Apply coherent reductions and update controlled callers together. Follow the
applicable coding and verification policies. Unclear consequential protection
needs investigation before removal. Leave unrelated style changes alone.

Revisit paths whose responsibilities or data flow changed. Follow new evidence
of further in-scope reductions; do not stop at the first local simplification
while known work remains. Avoid fixed pass counts and searching for changes
merely to justify another pass.

Finish after the complete scope has been assessed, supported reductions have
been applied or retained for concrete reasons, and the affected behavior has
adequate evidence. Reuse valid checks. Report meaningful reductions, necessary
complexity retained, and any coverage or verification gaps. Do not claim a
globally minimal implementation.

## Related skills

Use one when its case comes up and it is installed.

- Proof that the behavior survived the reduction → [verify-change](../verify-change/SKILL.md)
- A second look from a fresh agent → [review](../review/SKILL.md)
