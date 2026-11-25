---
name: scholarly-paper-revision
description: "Revise existing scholarly LaTeX papers, surveys, or books for mathematical correctness, clear exposition, consistent notation, and teaching quality, including integration of supplied research sources. Use when the user asks to revise, edit, proofread, tighten or check a paper, a thesis, a survey, a book chapter or another `.tex` manuscript, or to work new sources into one."
---

# Scholarly Paper Revision

Improve the user's existing manuscript within the requested scope. Preserve its purpose, audience, authorial voice, structure, class, bibliography, notation conventions, and substantive claims unless the task calls for changes. A paper, book, or chapter need not become a survey or a PhD teaching document. Scale the depth of revision to the request; do not invent page or word limits, standard sections, boxes, title conventions, or extra deliverables.

## Assess and revise

- Read the actual root, relevant included files, and surrounding text before editing. Identify the build engine, dependencies, and the user's intended audience and scope. For a focused edit, inspect enough context to avoid breaking consistency; do not rewrite unrelated material.
- Improve grammar, clarity, logical order, and notation where relevant. Define nontrivial objects and state assumptions before they are needed. For technical claims in scope, check derivations, conditions, units, and citations; preserve distinctions and qualifications. Repair a demonstrable gap when authorized and feasible; otherwise identify the issue and a concrete correction without overstating certainty. Add examples or derivations when they materially aid the intended reader.
- If additional research sources are supplied for integration, distinguish papers from macro files and style examples. Read the relevant full texts and appendices, verify claims and bibliographic details, and track page or theorem references and notation translations. Preserve attribution, disagreements, and limits; distinguish reported evidence, illustrative calculations, and new results. Report inaccessible sources instead of implying they were reviewed. Do not invent empirical findings or launch substantial experiments without authorization.
- Preserve the project's macro setup. Follow [LaTeX workflow](references/latex-workflow.md) when changing macros or building the manuscript.
- Use [teaching-and-review.md](references/teaching-and-review.md) when a substantive scholarly or pedagogical review would help. Independent review may be valuable for extensive or difficult work when available and authorized; a small edit does not require separate agents. Report unresolved material issues accurately.

## Correct and avoid AI stylistic tropes

Edit for precision, natural authorial voice, and economy, following the useful principles of William Zinsser's *On Writing Well*. The patterns below are prompts for editorial judgment, not bans or proof of AI authorship. Remove a pattern when it is repetitive, vague, overstated, or distracts from the argument; retain a useful contrast, parallelism, technical term, or punctuation when it serves the text. Avoid flattening the author's distinctive prose or replacing precise mathematical language with simpler but inaccurate words.

Before editing or reviewing prose, read [prose patterns](references/prose-patterns.md).

## Build and deliver

For LaTeX changes, follow [latex-workflow.md](references/latex-workflow.md). Rebuild after the final source changes. Report changes, verification, and material unresolved limitations; provide the requested deliverables.

## Related skills

Use one when its case comes up and it is installed.

- The choice of an independent reviewer → [model-router](../model-router/SKILL.md)
