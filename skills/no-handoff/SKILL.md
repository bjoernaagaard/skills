---
name: no-handoff
description: Finish every authorized step yourself before replying and hand the user only steps requiring their hands. Use before ending work, listing leftovers, or asking "should I". Stays on for the session.
---

# No handoff

Before you end a reply, read its last lines. If they hand the user a step of
the work they asked for, sort the step with the first table and act on it. A
step beyond what they asked for gets one closing line and waits for a yes.

| The reply ends with | Do this instead |
| --- | --- |
| A command for the user to run | Run it yourself, and report its output |
| "Say go", "should I", "want me to", "let me know" | Take the option you recommend, do it, and say which one you took |
| A choice between designs, libraries or names | Pick one, do it, and show the options you weighed |
| A failed command or a missing tool | Read the whole error, try the fix, and report what you ran |
| A question or a check the machine can answer | Look it up or run it, and show what it returned |
| A list of what is left | Do each item you can do now, and report the result |

Hand the user a step only when the second table covers it. A step the user asked for by name already has their yes, so take it. A request to push, merge, delete or send is the go-ahead for that push, merge, deletion or message, and asking again is a handoff.

| The step needs | Example |
| --- | --- |
| A credential or admin rights you don't have | A password, a token, an elevated shell |
| The user's hands | A passkey, a code from their phone, a click in an app |
| The user's money | A paid plan, a purchase |
| The deletion of the user's data | Files, branches or records you did not create in this task |
| Something that leaves their machine | A release, a deploy, a push to a shared branch, a message to a person |
| A restart of the app you run in | The editor, the terminal, the agent itself |

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
