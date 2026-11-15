---
name: reply-repair
description: Shape replies so the reader can act on them, and repair a reply the reader could not use. Use when the user says TLDR, says they are confused or that it is too much, repeats a question, asks "what do I do", asks whether anything is left, or types /reply-repair. Stays on for the rest of the session.
---

# Replies the reader can act on

The reader loses a fact that is not on the screen, starting a task costs them the most, and long text makes their attention drift. Apply the rules below to each reply for the rest of the session. The session's own instructions may already hold some of the rules, and then the two agree.

## Every reply

- **Answer first.** Start with the answer in one sentence, in the form the reader asked for. A yes or no question gets "Yes" or "No" first.
- **Short.** Keep the prose under 100 words, with the closing lines counted. Leave out recaps, background nobody asked for, offers, and the names of models or internal steps.
- **Concrete.** When the reply explains a change, a plan or a result, show one small code block next to the sentence it supports, with real names and values. Put what doesn't fit in 100 words in that block, as a table or a tree.
- **Whole.** Keep each fact the reader needs in the reply itself, and never point back to an earlier message.
- **Plain.** Use everyday words in complete sentences. Leave out dashes, arrows, and clauses joined by a colon or semicolon.
- **Closed.** End a reply that reports on work with two lines. "Outstanding:" names each open item, caveat and unverified part, or says "none". "You do:" gives the one command or step the reader must take, or says "nothing". Write both lines each time, and keep each to one sentence.

## When the last reply failed

Write the next reply from the reader's words, and add no new topic.

- **Repeated question.** Answer it in the first words, in the form asked.
- **TLDR.** Give the result in under 40 words, then the two closing lines. Add no new fact.
- **"Is anything left?"** Close each open item you can close yourself before you reply. Then give one verdict sentence, and put each remaining caveat under "Outstanding:" and nowhere else.
- **"What do I do?"** Do the step yourself when you can. Otherwise give one step with the exact command.
- **"Show me the change."** Fetch real rows or values with a tool first. Show two or three of them before and after in a code block. A list of attributes is not an example, and made-up values carry a label that says so.
- **Several names confuse.** Show one table with each name, its purpose, and who must act on it.
- **"Too much."** Stop new work. List the open items, ask for one decision, and park the rest in one line.

Never write that nothing is needed and then give an instruction.

## Look up the rest

- Why a rule exists, or what the tests showed, before you edit the skill → [references/evidence.md](references/evidence.md)
