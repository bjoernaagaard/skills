---
name: optimize
description: Review a script or a whole codebase for code that could be shorter, simpler or faster in ways its linters cannot see, and make the changes with proof that the result is the same.
disable-model-invocation: true
argument-hint: "[optional file, folder or concern to focus on]"
---

# Optimize

Make the code in scope shorter, simpler and faster, and finish every change you
start. The scope is the argument, or the whole project when there is none.

A linter reads one line or one call at a time, so it finds a slow or wrong use
of a function. It cannot know what the code is for. The reductions left after
the linter is clean need that knowledge, and they are the work of this skill.

In T3 Code, [optimize.workflow.ts](optimize.workflow.ts) runs the same stages
with a fresh agent for each one, and it fits a whole codebase. Its first lines
say how to start it. Follow the stages yourself for one script or one folder.

## Survey

Find the commands the project checks itself with, in its hook, task and CI
files: the formatter, the linters and rule packs such as `ruff check`,
`xpd check .` or `cargo clippy`, the type checker and the tests. Run each one,
and fix what the linters report before you go on, because a clean linter is the
starting point and no finding below repeats a rule.

Record the baseline: the line count of the scope, the result of each check,
and the run time of one representative workload when the code has one.

## Find

Change nothing in this stage. For each function, class and script in scope,
write one sentence that names its inputs and its result and leaves out how it
gets there. Then describe the shortest program that gives the same result with
the libraries the project already uses, and compare the code with that program.
Read the callers together with the code, because a guarantee often lives in one
place and its check in another.

Write down every difference, with its file and line. The differences come in
six kinds, and each kind has tools that find it.

| Kind | What it looks like | Tools that find it |
| --- | --- | --- |
| **Written twice** | Two functions or classes that differ in one value, such as the distribution they call. One of them with that value as a parameter replaces both. | `xpd rules outline <scope>` lists every definition with its members, so twins stand side by side. `xpd rules run --pattern '<pattern>'` finds each copy of a shape. |
| **In the way** | A wrapper that only forwards, a setting that never varies, a branch for a case no caller sends, and code nothing calls. | `xpd rules run --pattern '<name>($$$ARGS)'` lists the callers and what they pass. |
| **Already guaranteed** | A check, a clip, a sort, a copy or a conversion whose result an earlier step or the library already ensures. | `xpd api <Class.method>` shows what a library call returns and its defaults. |
| **Already in a library** | Code that rebuilds what a dependency of the project provides. | `xpd find "<task>"` ranks the symbols of the project's libraries for a task. Outside Python, read the documentation of the dependency. |
| **Done again** | The same value computed in several places, on every call or inside a loop, when one computation before the loop serves them all. | `xpd graph <file>` shows which step reads what. `xpd graph impact` traces one column to its uses. |
| **Larger than the answer** | A matrix, a list or a join much larger than the result it is reduced to, or work that grows with the square of the input when the result needs one pass. | A profiler on the representative workload. `xpd graph map` plans a move from pandas to Polars or from eager to lazy. |

The xpd commands that read Python need a Python project. `xpd rules outline` and
`xpd rules run` read most languages. When the installed xpd has `xpd optimize`,
start from its list: it reports near copies, calls computed twice or repeated by
a loop, arguments that pass a library default and matrices built to be reduced,
and its `xpd-optimize` skill holds the steps for a project that uses xpd.

Give each finding its kind, the mechanism that makes the code shorter or
faster, and whether a rule could have caught it from the syntax alone. Look for
the one change behind several findings before you list them one by one. A data
shape that fits the work often removes a conversion at every step.

## Decide

Read the code behind each finding and drop the ones the code disproves. Group
the rest into changes that each stand alone, and sort each change. Search for
callers outside the scope before you rename or remove a public name.

| The change | Keep it when |
| --- | --- |
| Removes code and keeps the result | The result is proven equal |
| Makes the code faster and no longer | The result is proven equal. A speedup you did not measure is reported as a guess. |
| Makes the code faster and longer or harder to read | A measurement on the representative workload shows a gain the user would notice |
| Changes what a user can notice: a result beyond rounding error, a public name, a message or an error | The user agrees |

## Change and prove

Apply one change at a time, and update every caller with it. Then run the
proof that fits.

| The code is | Proof |
| --- | --- |
| A data script that assigns `result` | `xpd equiv <script.py> --since HEAD` prints `{"equivalent": true}` |
| A function or a class | The old and the new version run on the same inputs, including an empty one and one at each boundary, and the outputs match |
| Covered by the project's tests | The tests pass as they did at the baseline |

Measure a claim about speed as
[honest-performance](../honest-performance/SKILL.md) describes: the baseline
and the changed code on the same input, with the time in units, and a second
input size when the claim is about scaling. Drop a change that its proof or its
measurement does not support, and say that you dropped it.

Run every check of the survey again after the last change, since a rewrite can
add what a rule reports.

## Repeat

Have a fresh subagent run the Find stage on the changed code without your list,
and take its findings through Decide and Change. Stop when it reports nothing
worth a change.

## Report

Give the line count and the measured times before and after, each change with
its kind and the proof you ran for it, and the code you left as it is with the
reason. Name each finding that a rule could have caught from the syntax alone,
because that finding is a rule the project's rule pack is missing.

## Related skills

Use one when its case comes up and it is installed.

- The scope is one diff and speed is not part of the goal → [simplify-change](../simplify-change/SKILL.md)
- A benchmark or a claimed speedup is the main question → [honest-performance](../honest-performance/SKILL.md)
- Proof that a change still behaves correctly → [verify-change](../verify-change/SKILL.md)
