---
name: human-writing
description: Write or edit human-facing text (docs, README, guide, report, design note, handover, email, commit, PR, or long reply) so one pass is enough. Uses tables and diagrams over prose, plain literal language, and current state with no work log. Not for code.
---

# Human writing

The reader is smart, busy and has none of your context. They read the text
once. Write so that one pass is enough.

Work in the order of the sections below: choose the structure, draw the views,
write the prose, and check the result.

## 1. Choose the structure

| The text is | Structure |
| --- | --- |
| A status update, a report or a summary | The first sentence says what the reader must do or decide, and by when. With nothing to decide, it gives the result. [bluf](../bluf/SKILL.md) has the detail. |
| A handover or an escalation | Situation, background, assessment and recommendation, as [sbar](../sbar/SKILL.md) defines them |
| A pull request title and body | [write-pr-body](../write-pr-body/SKILL.md) |
| A README, a guide or a docs page | The first sentence says what the thing is and who uses it. Then come the steps to use it, which the reader can run as written. Reference tables come last. |
| A design note or a decision | The decision comes first. One table compares the options, and the consequences follow. |
| A commit message | A subject line that says what the commit does, then the reason for it |
| A reply in a chat | The answer comes first. Then give the context a reader needs who has forgotten the problem, and say what changed. |

## 2. Show it

Start each section from the view that carries its content. The prose connects
the views and says what to see in each one, in a sentence or two.

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
not been drawn yet. [visual-explanation](../visual-explanation/SKILL.md) has
the detail for each view.

## 3. Write the prose

### Words

- **Everyday words.** Write "use", "help", "show" and "start". Leave out the
  words machines reach for, such as "leverage", "robust", "delve", "seamless",
  "streamline", "pivotal", "landscape" and "testament".
- **One name for each thing.** Use the real name, and repeat it. A second word
  for the same thing reads as a second thing.
- **No private shorthand.** Leave out a label, an abbreviation or a joined
  word that you made up while working. Explain a technical term the reader may
  not know.
- **No words that only add force.** Cut "really", "very", "key", "crucial",
  "simply", "just" and "actually". Give the fact that makes the point strong.
- **Literal.** Describe the thing itself. Leave out metaphors, comparisons,
  slogans and clever headings. A heading says what its section holds.
- **The direct verb.** Write "decided" for "made a decision", "can" for "has
  the ability to", and "is" for "serves as".

### Sentences

- **Complete.** Each sentence has a subject and a verb, and one or two clauses.
- **Explained, not punchy.** Write the way a person explains something aloud.
  Join related thoughts with "and", "because" or "so". A stack of short
  sentences reads as a slogan.
- **A named subject.** Start a sentence with the thing it is about. A sentence
  that starts with "This", "That", "These" or "Those" makes the reader look
  back, so write "The setting adds" where you would write "This adds".
- **The real actor.** A person or a process does the action. "You can search
  the logs" is clearer than "The logs become searchable".
- **Point first.** A paragraph opens with its point, and the support follows.
- **Steps in order.** Give each step its own sentence or its own number.
- **The specific fact.** Give the number, the name, the date or the mechanism
  that your source holds, and never invent one. Cut a sentence that would fit
  any other project unchanged.
- **A named source.** Write who measured or said it. Cut "studies show" and
  "experts agree".

### Punctuation and format

- **Plain marks.** Use no em dash, no en dash, no semicolon, no middle dot, no
  arrow, and no slash between words. Write "to" in a range, and "and", "or" or
  "then" between words.
- **A colon** comes before a list or after a short label such as "Summary:".
  It never joins two clauses.
- **Plain format.** Use straight quotes and sentence case in headings. Bold
  only the few words a reader scans for.
- **Short lists.** Keep a list to about four items, and nest the rest.

### Habits of machine writing

Leave out each of these. A reader who spots one stops trusting the text.

| Habit | Example | Write |
| --- | --- | --- |
| A warm-up before the point | "Here's the thing." "It's worth noting that" | The point |
| A closing recap, or a last line meant to sound deep | "Ultimately, speed is a journey." | Stop at the last fact or the next action |
| A contrast that sets up the claim | "It's not just a parser, it's a toolchain." | "It is a parser and a formatter." |
| Questions the text answers itself | "Is it fast? Is it safe?" | "We have not measured the speed yet." |
| A line that tells the reader what to notice | "The key point is", "As you can see" | The fact that makes it matter |
| A trailing clause that claims a meaning | ", highlighting our commitment to quality" | The consequence, with "so", or nothing |
| A count of what is coming | "Three things to know." | The first thing |

## 4. Describe how things are now

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
  document the same length or shorter when it can.
- **A changelog is its own file.** Write one only when the project already
  keeps one.

## 5. Check before you send

1. A reader who stops after the first sentence knows what the text is for.
2. Each section has its view, or holds one fact that needs none.
3. No sentence starts with "This", "That", "These" or "Those".
4. The text holds no dash, no semicolon and no row of the habits table.
5. No line tells the history of the work.
6. You ran each command the text shows, and it gave the output shown.

## When you edit someone else's text

Make the smallest edit that fixes the problem. Keep the writer's meaning, their
order of points and each sentence that already reads well. Add no claim,
number, example or opinion that the draft does not hold. When asked to clean up
your own earlier reply, rewrite it for a reader with no context and return only
the rewrite.

## Look up the rest

- A rule is unclear, or you edit a long text and want a before and after for each rule → [references/examples.md](references/examples.md)

## Related skills

Use one when its case comes up and it is installed.

- The length and the closing line of a reply → [reply-repair](../reply-repair/SKILL.md)
- Proof that a command in the text works → [verify-change](../verify-change/SKILL.md)
- A scholarly paper in LaTeX → [scholarly-paper-revision](../scholarly-paper-revision/SKILL.md)
- A breakdown of a question into causes, parts or options → [issue-tree](../issue-tree/SKILL.md)
