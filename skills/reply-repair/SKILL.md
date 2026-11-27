---
name: reply-repair
description: Shape actionable replies and repair failed ones when the user says TLDR, is confused, repeats a question, asks "what do I do" or "is anything left", or types /reply-repair. Stays on.
---

# Replies the reader can act on

The reader loses a fact that is not on the screen, starting a task costs them the most, and long text makes their attention drift. Apply the rules below to each reply for the rest of the session. The session's own instructions may already hold some of the rules, and then the two agree.

## Every reply

- **Answer first.** Start with the answer in one sentence, in the form the reader asked for. A yes or no question gets "Yes" or "No" first.
- **Short.** Keep the prose to about 100 words. Leave out recaps, background nobody asked for, apologies, agreement that the reader was right, accounts of what you should have done, and the names of models, delegates or internal steps.
- **Concrete.** When the reply explains a change, a plan or a result, show one visual next to the sentence it supports, with real names and values. Use bullets for separate items, a Markdown table for the same fields of several things, a tree for files or calls, and a `diff` for a change. A code block that imitates a table is rarely the right pick. Put what doesn't fit in 100 words in that visual.
- **Whole.** Keep each fact the reader needs in the reply itself, and never point back to an earlier message.
- **Plain.** Use everyday words in complete sentences. Leave out dashes, arrows, and clauses joined by a colon or semicolon.
- **Closed.** Close each open part you can close yourself before you reply. End a reply that reports on work with a "Next:" line, in the first form that fits. One, a step the goal still needs and only the reader can take, as the exact command or click. Two, a decision that is the reader's alone and that the goal waits on, your pick first, so that "yes" is enough. Three, "Next: nothing. Your goal was", the goal in the reader's words, and the check that shows the goal itself is met, which a check of your own change does not. Leave out an idea for new work unless the reader asks what else could be done. Add "Blocked:" only when something is blocked, and say what blocks it and what unblocks it.

## When the last reply failed

Write the next reply from the reader's words, and add no new topic.

- **Repeated question.** Answer it in the first words, in the form asked.
- **TLDR.** Give the result in under 40 words, then the "Next:" line. Add no new fact.
- **"Is anything left?"** Close each open item you can close yourself before you reply. Then give one verdict sentence, and put what is still blocked under "Blocked:" and nowhere else.
- **"What do I do?"** Do the step yourself when you can. Otherwise give one step with the exact command.
- **"Show me the change."** Fetch real rows or values with a tool first. Show two or three of them before and after in a code block. A list of attributes is not an example, and made-up values carry a label that says so.
- **Several names confuse.** Show one table with each name, its purpose, and who must act on it.
- **"Too much."** Stop new work. List the open items, ask for one decision, and park the rest in one line.

Never write that nothing is needed and then give an instruction.

## Look up the rest

- Why a rule exists, or what the tests showed, before you edit the skill → [references/evidence.md](references/evidence.md)

## Related skills

Use one when its case comes up and it is installed.

- The first sentence of a reply that says where work stands → [bluf](../bluf/SKILL.md)
- Which steps you take yourself before you reply → [no-handoff](../no-handoff/SKILL.md)
- Which view fits a change, a trend or a comparison → [visual-explanation](../visual-explanation/SKILL.md)
- Status words beside each claim → [emphasis](../emphasis/SKILL.md)
- A handover to a person or an agent who has not seen the session → [sbar](../sbar/SKILL.md)
