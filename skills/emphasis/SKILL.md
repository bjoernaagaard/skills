---
name: emphasis
description: Make replies easy to scan with bold status badges, evidence beside each claim, and the action each badge calls for. Works with plain Markdown, so it needs no hook, plugin, or special font. Use when the user asks for emphasis, status badges, or scannable replies, or types /emphasis. Stays on for the rest of the session.
---

# Emphasis

A status badge is a known word in bold brackets, such as **[Done]**, beside the claim it describes. Write badges in every reply for the rest of the session, progress updates included. Stop when the user asks you to stop. The user's requested format and the project's own instructions win where they differ from this skill.

If the session's instructions already define a pill form such as `[[Done]]`, the machine has a renderer for it. Use that form and its word list instead of the badges below.

## The words

Use exactly these words, so the same state always reads the same. Do not invent a status word.

| Meaning | Words |
|---|---|
| Something is wrong | Failed, Broken, Unsafe, Rejected, Down |
| Look here | Needs you, Decision, Unverified, Skipped, Pending, Review, Stale, Draft |
| Settled | Done, Passed, Fixed, Live, Keep, Ready, Merged, Safe, Verified, Shipped, Approved |
| Consequence | Costs money, Destructive, Irreversible |
| Ownership | Shared |
| Context | New, Changed, Inferred |

A known word may carry short detail that real output supports, such as **[Passed 12 of 12]** or **[Failed: 3 tests]**. Keep a badge under 33 characters.

## Where a badge goes

- **Answer first.** Start the reply with the answer or the outcome, then badge the claims under it.
- **One badge for each claim.** Put it beside the subject it describes. Use the fewest badges that keep settled work, open work, and required action apart, and state a verdict once.
- **Every failure, every ask, and every unchecked claim gets one.** A reply that reports work without them hides what is open.
- **Mark a consequence before the action.** Put **[Costs money]**, **[Destructive]**, or **[Irreversible]** beside the action, and wait for the user where the choice is theirs.
- **Keep copyable text clean.** Leave badges out of code, commands, paths, quoted text, table cells, and output a program reads.

## What follows a badge

Follow each badge for a problem or an ask with the one fact the reader needs, introduced by a bold lead word and a colon.

| Badge | What follows it |
|---|---|
| **[Done]**, **[Fixed]**, **[Live]**, **[Shipped]** | **See:** the address, file, or command that shows it |
| **[Passed]**, **[Verified]** | the output or count that supports it |
| **[Unverified]** | **Check:** the fastest check and who can run it. Run the check yourself when you can, and report the result instead. |
| **[Needs you]** | **Do:** the exact action and what it unblocks. Use it only for a step the user alone can take. |
| **[Decision]** | the options, your pick, and **Next:** what you do meanwhile |
| **[Failed]**, **[Broken]**, **[Down]** | the cause, and **Next:** what you are doing about it |
| **[Pending]**, **[Draft]** | **Left:** what remains |
| **[Skipped]** | why, and **Run:** how to run it anyway |
| **[Unsafe]** | what would make it fail, and **Guard:** the protection against it |
| **[Costs money]** | the amount, before acting |
| **[Destructive]**, **[Irreversible]** | what is lost, and **Undo:** how to get it back, or that nothing can |
| **[Shared]** | who else the change affects |
| **[Inferred]** | what it was inferred from |

## What to leave out

The program that shows the reply draws it, and a reply cannot change that. Leave out terminal color codes, HTML, badge images, and icon font glyphs. Do not run a tool only to decorate a reply. Bold only the few terms a reader scans for, since bold on every noun hides the badges.
