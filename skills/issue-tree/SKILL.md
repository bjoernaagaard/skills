---
name: issue-tree
description: Splits a question into an issue tree of causes, parts or options, and audits the tree for gaps and overlaps. Use when the user asks why something happened and several causes are possible, what a goal requires, or how a goal could be reached, and when they ask for a breakdown, a decomposition, a hypothesis tree, a driver tree, a set of options to choose from or a MECE check, even if they never say "issue tree". Not for a list of GitHub issues, a file tree, a call tree, or a problem with one obvious cause.
---

# Issue trees

An issue tree splits one question into branches, so the reader can see what is
covered, what is missing and what to check next. Prose that ranks a few likely
answers hides the gaps, which is why the tree comes first and the prose stays
short.

## Build the tree

1. **Root.** Write one question and say what is in scope.
2. **Split basis.** Before the branches, name in one line the rule that divides
   them, such as a formula for the number, the stages of a process, the parts
   of a system, or the groups of customers. The reader can check that nothing
   is missing only when they know the rule.
3. **Evidence.** Mark each leaf as a fact, as inferred, or as unknown. A tidy
   tree is not evidence, and the reader should see which leaves are only
   guesses. In a repository, a fact is something you read or ran.
4. **Audit.** After the tree, name one gap you looked for and one overlap you
   looked for, and say what you did about each. Causes and options often
   affect each other, so name those links and keep them. The reader can trust
   the coverage only when they see what was challenged.

## Show the tree

Give the tree as a fenced text block with numbered branches, then the audit,
then the next check or decision. Put the reasoning in the leaves and leave out
paragraphs that repeat them. This example shows the shape, with made-up
content:

```text
Root (why): Why did weekly signups fall 18% after the pricing page redesign?
Split basis: signups = visitors × share who start the form × share who finish it

|-- [1] Fewer visitors reached the page
|   |-- [1.1] A paid campaign ended the same week        (unknown)
|   `-- [1.2] The redesign changed the address of the page (inferred)
|-- [2] Fewer visitors start the form
|   `-- [2.1] The button moved below the first screen     (fact)
`-- [3] Fewer visitors finish the form
    `-- [3.1] The new form asks for a card number         (fact)

Audit
- Gap: tracking could have broken in the redesign, so the fall may not be real. Added as a check.
- Overlap: none found between [2] and [3], because each visitor is counted at one step.
- Link: [1.2] and [2.1] come from the same release, so one rollback tests both.

Next: compare visitors, form starts and form finishes for the two weeks.
```

Keep the tree in the last message of the turn. When a later reply in the same
turn replaces your answer, carry the tree into it, because the reader sees
only the last message.

## Related skills

Use one when its case comes up and it is installed.

- A leaf that needs an investigation of a codebase or a system → [research-design-implement](../research-design-implement/SKILL.md)
- A leaf about speed, memory or cost → [honest-performance](../honest-performance/SKILL.md)
