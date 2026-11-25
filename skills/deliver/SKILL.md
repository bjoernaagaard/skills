---
name: deliver
description: Finish a multi-part task completely and prove each part with a check. Use when the user says "deliver" or "/deliver".
---

# Deliver

You are the lead, at A or S tier as
[model-router](../model-router/SKILL.md) defines them. You own the list of
what done means. Report only what the checks and final assessment show. A first working version is not the end.
Continue until every outcome is met or the user has agreed to drop it. Stop
early only for a blocker described under Stop and report, and call that result
incomplete.

## Done is written down before the work

Reread the request and write `DONE.md` at the root of the work tree. Keep it
out of commits. When a `DONE.md` is already there, continue it only when
you wrote it in this session or the user asks you to continue it. Otherwise
ask the user before you change, replace or delete it.

```markdown
Revision 1

| No. | Outcome | Owner | Check | State |
| --- | --- | --- | --- | --- |
| 1 | `deliver` appears in the README table | lead | `rg -q 'deliver' README.md` | open |
| 2 | The error message tells the user what to do next | worker-a | judged | open |
```

- Write one row for each outcome the user could notice was missing,
  including each constraint that changes what is acceptable. Leave out
  optional ideas.
- A check is a command that passes only when it exits 0. Put the expected
  output inside the command, for example with `rg -q`. Write "judged" only
  when no command can decide the outcome. When a check decides only part of
  the outcome, write the check followed by "and judged" for the rest.
- State is `open`, `met`, `removed`, `deferred` or `abandoned`. A row is
  `removed` or `deferred` only when the user agreed to it. A row is
  `abandoned` only when the task as authorized cannot reach it, and an
  abandoned row means the task is not complete. Each of these three states
  needs its reason in the row.
- When the user changes the request, raise the revision and update the rows
  before you count any row as met.

## Each check can fail

Run each check before the work. A check that already passes either tests the
wrong thing or shows that the outcome was already there, so fix the check or
mark the row `met`. A check that tests for an absence must first fail on an
example that contains the thing it looks for.

## Workers get rows, paths and checks

Do the work yourself, or hand rows to workers through
[model-router](../model-router/SKILL.md). Give each worker its rows, the
paths it owns and the checks, and give no two workers the same path. Only
you edit `DONE.md`. Keep the rows that test how the parts fit together.

## Grade the result

Select one fresh grader using the independent review rule in
[model-router](../model-router/SKILL.md). Give it the request, `DONE.md` and the result, and do not give it
your transcript or your opinion. The grader edits no file. Ask it to run
every check, to judge each "judged" row, to say whether each check proves
its whole outcome, and to name the outcomes the request implies but
`DONE.md` lacks. Read the evidence behind each failure it reports. Fix it, or add a
missing outcome as a row. When you dispute a finding, keep it open and give
the user your evidence. The last grade must come after the last change to the work. Deleting
`DONE.md` at the end is not a change to the work.

## Stop and report

If no fresh grader is available, run the checks and assess each judged row yourself.
State which conclusions are your own. Leave an explicitly required independent grade open.

The task is complete when every row is `met`, `removed` or `deferred` and
the final assessment has no open finding or unmet review requirement. Say that it is complete only then.

Stop with an incomplete result when required review is unavailable, a row is `abandoned`, or you dispute
a finding, because then the user must decide. Start the report with the word
"Incomplete", then each abandoned row and each disputed finding with its
evidence.

In both cases, report the rows that are not `met` with their reasons, then
who assessed the result and what they found. Measure again each number you report.
Delete `DONE.md` only after completion when every row is `met` or `removed`.
Keep it while any outcome, finding or required review remains open.

Run only checks that you wrote or read in this session. Show the user each
check in a `DONE.md` that came from somewhere else before you run it.

## Related skills

Use one when its case comes up and it is installed.

- A check that is hard to fool, and proof through the real app for a judged row → [verify-change](../verify-change/SKILL.md)
- An incomplete result that another person or agent must finish → [sbar](../sbar/SKILL.md)
- The user asks to push the finished work → [ship](../ship/SKILL.md)
