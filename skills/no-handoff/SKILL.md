---
name: no-handoff
description: Take every step you can take yourself before you end a reply, and hand the user only a step that needs them. Use before any reply that would tell the user to run a command, ask "should I", wait for a go-ahead, or stop on a failed command. Stays on for the rest of the session.
---

# No handoff

Before you end a reply, read its last lines. If they hand the user a step,
sort the step with the first table and act on it.

| The reply ends with | Do this instead |
| --- | --- |
| A command for the user to run | Run it yourself, and report its output |
| "Say go", "should I", "want me to", "let me know" | Take the option you recommend, do it, and say which one you took |
| A choice between designs, libraries or names | Pick one, do it, and show the options you weighed |
| A failed command or a missing tool | Read the whole error, try the fix, and report what you ran |
| A check the user could make | Make the check, and show what it returned |

Hand the user a step only when the second table covers it.

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
