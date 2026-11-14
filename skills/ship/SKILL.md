---
name: ship
description: Commit, rebase, test, and push all work straight to origin/HEAD. Use when the user says "ship", "ship it", or asks to push their changes to main.
---

# Ship

Ship all committed and uncommitted changes to `origin/HEAD`. Asking to ship is
the permission to commit and push.

## 1. Commit

Commit any uncommitted changes. Follow the repository's commit message
conventions. Use [restack](../restack/SKILL.md) only if the user asks for clean
history.

## 2. Rebase

Follow [rebase](../rebase/SKILL.md), including its shallow clone recovery. Ask
the user before you resolve a conflict where both sides changed behavior and
the right result is not obvious. Resolve mechanical conflicts yourself.

## 3. Test

Run the full test suite once, on the rebased tree.

If a check fails, decide whether this work broke it. Create a disposable
worktree at `origin/HEAD`, run the same check there, then remove the worktree.

- The check also fails on `origin/HEAD`: the failure came before this work.
  Ignore it and name it in the report.
- The check passes on `origin/HEAD`: this work broke it. Fix it, commit the
  fix, and run the suite again.

## 4. Push

Push with `git push origin HEAD:<default branch>`. Never force push the default
branch.

If the push is rejected because `origin/HEAD` moved, fetch and rebase again,
then push again. Do not rerun the test suite after a later fetch, rebase, or
rejected push. Rerun it only when conflict resolution or another local edit
changed files after the last passing run.

## Report

Give the pushed commit range, the test result, any failure you ignored and the
proof that it also fails on `origin/HEAD`, and how you resolved each conflict.
