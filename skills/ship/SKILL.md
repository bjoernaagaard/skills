---
name: ship
description: Prepare and verify changes for the delivery branch allowed by the project. Use when the user says "ship", "ship it", or asks to push their changes to main.
---

# Ship

Read the applicable Git instructions and the request before choosing a destination.
For direct delivery, use the authorized default branch. For branch-based delivery,
work on the task branch and push only to that branch when authorized. Treat a
push, a merge request, a remote merge and a comment as separate actions. Apply
the environment's approval rule to each. Choose the permitted local branch before committing. If publication permission
is unclear, finish the local work and ask about the exact outstanding action.

## 1. Commit

Inspect the diff and stage only the requested changes. Check the commits that would leave the machine too. If unrelated work is mixed into the outgoing history, isolate the requested changes before pushing. Follow the repository's commit message
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

Verify the remote and destination, then push the tested commit with
`git push <remote> HEAD:<authorized-branch>` when permitted. Never force push
the default branch. For a task branch rejected because it moved, fetch and
inspect the new commits before reconciling the histories.

If the push is rejected because `origin/HEAD` moved, fetch and rebase again,
then push again. Do not rerun the test suite after a later fetch, rebase, or
rejected push. Rerun it only when conflict resolution or another local edit
changed files after the last passing run.

## Report

Name the destination and pushed commit range, or the local commit and pending action, the test result, any failure you ignored and the
proof that it also fails on `origin/HEAD`, and how you resolved each conflict.
