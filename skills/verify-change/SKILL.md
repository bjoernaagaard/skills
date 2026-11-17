---
name: verify-change
description: Prove a change by running it, choose a test that is hard to fool, and keep checks honest. Use before you say a change works, before a commit or a pull request, when a test fails or fails only some of the time, when you are about to write a test, or when the user says "verify", "prove it" or types /verify-change. Stays on for the rest of the session.
---

# Proof that a change works

A change is done when someone ran it and saw it work. Apply the rules below to each change for the rest of the session. The session's own instructions may already hold some of the rules, and then the two agree. Where they differ, the session's instructions win.

## Before you say a change works

1. **Run the cheap checks first.** Run the formatter, the linter, the type checker, the build and the tests the project already has. Fix what they find before anything slower runs.
2. **Run the change itself.** Start the real app or command and use it the way a user would. When the project has a `verify` skill, follow it, and repair it when it is slow or wrong.

   | The change is in | Run it with |
   | --- | --- |
   | A web page | A browser you drive, with a screenshot of the result |
   | A mobile app | A simulator or an emulator |
   | A service | The service started locally, and a real request to it |
   | A command line tool or a library | The real command on real input |
   | A bug fix | The same case before the fix and after it |
   | A rewrite or a migration | The old and the new code on the same input, with the differences shown |

3. **Show the evidence.** Give the command and its output, or the screenshot. Name each part you could not run, and say why.
4. **Prove the last version.** An edit after the proof makes the proof old, so run it again.
5. **Stop after three rounds.** When a check still fails after three rounds of fixes, stop and show the user the failure.

Passing tests show less than a run of the app, because a test and the code can share one wrong idea of the task.

## Which test to write

Write a test file only when the user asks for one or the project already has tests of that kind. Then choose from the three kinds below, because each is hard to pass with broken code.

| Kind | What it proves | Write it for |
| --- | --- | --- |
| End to end | A whole user flow works in the running app | A flow a user would notice was broken, such as adding an item and paying for it |
| Property | A statement holds for thousands of generated inputs | A round trip such as encode and decode, a value that must never go wrong such as a balance below zero, an action that is safe to repeat, or fast code that must match slow code |
| Differential | New code gives the same result as old code | A migration or a rewrite. Use generated input or a sample of real input, ignore differences such as whitespace, and keep a list of the differences the user approved |

- Use the property library of the language, such as Hypothesis for Python, fast-check for JavaScript and TypeScript, and proptest for Rust. Ask before you add it as a dependency.
- Don't write a test that replaces the code under test with a mock. That test checks the mock.
- Watch a new test fail once on broken code. A test that can't fail proves nothing.
- End an end to end test with something a person can check and rerun, such as a screenshot or a saved output.

## Keep the checks honest

- **A change never edits its own judge.** Don't change a test, a snapshot, a threshold or a lint setting so that your change passes. When the check itself is wrong, say so, and change it in a separate commit with the reason.
- **A test that fails only some of the time has a cause.** Find it and fix it. Don't skip the test, don't run it again until it passes, and don't add a sleep. When the cause can't be found, delete the test and write down why.
- **A missed bug becomes a check.** When a bug got past the checks, propose the smallest check or written rule that would have caught it. Propose removing a check or a rule that no longer catches anything.
- **Report only what ran.** Never report a check that you did not run, and never report an old result as the current one.

## Look up the rest

- Why each rule exists → [How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/)
