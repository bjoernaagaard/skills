---
name: write-docs
description: Write or revise a document that a person will read, such as a README, a guide, a docs page, a report, a design note or a handover. Use before writing or editing any documentation file, and when the user asks for documentation, a write-up or an explanation saved to a file. Picks the structure for the purpose, shows with tables and diagrams where prose would describe, writes the prose plainly, and keeps the document a description of how things are now, with no log of the work.
---

# Write docs

Read [plain-writing](../plain-writing/SKILL.md) and
[visual-explanation](../visual-explanation/SKILL.md) before you write. Then find
the document in the first table and follow its structure.

## Pick the structure

| The document is | Structure |
| --- | --- |
| A status update, a report or a summary | [bluf](../bluf/SKILL.md). The first sentence says what the reader must do or decide, and by when. |
| A handover or an escalation | [sbar](../sbar/SKILL.md) |
| A pull request title and body | [write-pr-body](../write-pr-body/SKILL.md) |
| A README, a guide or a docs page | The first sentence says what the thing is and who uses it. Then come the steps to use it, which the reader can run as written. Reference tables come last. |
| A design note or a decision | The decision comes first. Then one table compares the options, and the consequences follow. |

## Show it

Start each section from the view that carries its content. Prose connects the
views and says what to see in each one, in a sentence or two.

| The content | View |
| --- | --- |
| Several things with the same fields, such as options, settings or commands | A table |
| Steps in order | A numbered list |
| Files, ownership or calls | A text tree |
| Parts that send messages, or a flow with branches | A Mermaid diagram |
| A change to code or text | A `diff` |
| Numbers that form a trend or a comparison | A chart, as an HTML file when the reader can open one |
| One fact | A sentence |

Use real names and values from the project, and label a made-up value as made
up. A paragraph that lists three or more things is a table or a list that has
not been drawn yet.

## Describe how things are now

A document says what the thing is and how to use it today. The log of the work
goes in the commit message or the pull request, and a reader of the document
never needs it.

- **No log.** Leave out dated entries, the old name of a thing, what was tried,
  what changed, the status of the work and notes for a later session.
- **Edit in place.** Change the sentence that is now wrong, and delete what is
  no longer true. Add no section about the change.
- **One home for each fact.** Link to the file that owns a fact. A second copy
  goes out of date.
- **Short.** Cut each line that a reader would not miss. An edit leaves the
  document shorter or the same length when it can.
- **A changelog is its own file.** Write one only when the project already
  keeps one.

## Before you save

1. A reader who stops after the first sentence knows what the document is for.
2. Each section has its view, or holds one fact that needs none.
3. The prose follows every rule of plain-writing.
4. No line tells the history of the work.
5. You ran each command the document shows, and it gave the output shown.

## Related skills

Use one when its case comes up and it is installed.

- A reply in the chat, where no file is written → [reply-repair](../reply-repair/SKILL.md)
- Proof that a command in the document works → [verify-change](../verify-change/SKILL.md)
- A scholarly paper in LaTeX → [scholarly-paper-revision](../scholarly-paper-revision/SKILL.md)
- A breakdown of a question into causes, parts or options → [issue-tree](../issue-tree/SKILL.md)
