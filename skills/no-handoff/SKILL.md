---
name: no-handoff
description: Finish every authorized step yourself before replying and hand the user only steps requiring their hands. Use when asked not to hand steps back or to finish everything possible before replying; skip for routine single-step tasks or skills that already own completion (bmode, deliver, ship).
---

# No handoff

Before you end a reply, read its last lines. Sort what remains into four states:
nothing left (`complete`), an authorized step you can take (`agent_action`), an
in-flight job or external event you are waiting on (`agent_wait`), or a step
that genuinely requires the user (`user_action`). When the user asked a question
or a bounded read-only check and it is answered, stop at `complete` without
inventing extra work.

Act on every `agent_action` row in the first table before ending the turn.

| The reply ends with | Do this instead |
| --- | --- |
| A command for the user to run | Run it yourself, and report its output |
| "Say go", "should I", "want me to", "let me know" for work already asked for | Take the option you recommend, do it, and say which one you took |
| A routine, reversible choice (naming, minor layout, local helper) | Pick one, do it, and show the options you weighed |
| A failed command or a missing tool | Read the whole error, try the fix, and report what you ran |
| A question or a check the machine can answer | Look it up or run it, and show what it returned |
| A list of what is left inside the requested scope | Do each item you can do now, and report the result |

If work is waiting on a running background job, subagent, CI check, rate limit,
or offline machine (`agent_wait`), state what it is waiting on instead of
handing a manual step to the user.

Hand the user a step (`user_action`) only when the second table covers it. A
step the user asked for by name already has their yes, so take it. A request to
push, merge, delete or send is the go-ahead for that push, merge, deletion or
message, and asking again is a handoff.

| The step needs | Example |
| --- | --- |
| A credential or admin rights you don't have | A password, a token, or an elevated shell when the host has no private secret-request tool; if it has one, request the secret there and finish the step yourself |
| The user's hands or app UI | A passkey, a phone code, a UI setting or click in an app you do not control |
| The user's money | A paid plan, a purchase |
| The deletion of the user's data | Files, branches or records you did not create in this task |
| Something that leaves their machine | A release, a deploy, a push to a shared branch, a message to a person |
| A restart of the app you run in | The editor, the terminal, the agent session itself |
| A decision that is the user's alone | Authorizing new work beyond a review/design/research request, choosing a major scope or dependency tradeoff, or picking a personal preference |

```text
hand over(a step)
  finish every other step first
  give one step, with its exact command or its exact clicks
  say which row of the second table it falls under
  never write that nothing is needed and then give an instruction
```

## Related skills

Use one when its case comes up and it is installed.

- The form of the closing line and of the one step you hand over → [reply-repair](../reply-repair/SKILL.md)
- Proof that a step you took worked → [verify-change](../verify-change/SKILL.md)
- The step goes to another agent or person → [sbar](../sbar/SKILL.md)
