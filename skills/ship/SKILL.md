---
name: ship
description: Prepare and verify changes for the delivery branch allowed by the project. Use when the user says "ship", "ship it", or asks to push their changes to main.
---

# Ship

Read the applicable Git instructions and the request before choosing a destination.
For direct delivery, use the authorized default branch. For branch-based delivery,
work on the task branch and push only to that branch when authorized. Treat a
push, a merge request, a remote merge and a comment as separate actions. Apply
the environment's approval rule to each. Choose the permitted local branch before
committing. If publication permission
is unclear, finish the local work and ask about the exact outstanding action.

## 1. Commit

Inspect the diff and stage only the requested changes. Check the commits that would leave the machine too. If unrelated work is mixed into the outgoing history, isolate the requested changes before pushing. Follow the repository's commit message
conventions. Use [restack](../restack/SKILL.md) only if the user asks for clean
history.

## 2. Update the branch

Resolve the push remote, destination branch and integration base from the
request, repository instructions and Git configuration. Fetch the relevant
refs. For direct delivery, rebase onto the fetched destination. For an
unpublished task branch, use its intended base. Follow the working-tree and
shallow-clone guidance in [rebase](../rebase/SKILL.md) with the resolved refs.

For a published task branch, check that its fetched tip is an ancestor of HEAD.
If it is, no synchronization with that tip is needed. If the tips diverged,
preserve published commits when integrating remote changes. Update from the
integration base only when the project requires it. If the only permitted
strategy would rewrite published history, ask before rewriting it.

Resolve mechanical conflicts. Ask when both sides changed behavior and the
intended result is unclear.

## 3. Test

Run the project's full test suite on the outgoing commit. If a check fails,
run the same check in a disposable worktree at the fetched integration base.
Remove that worktree afterwards. Report a failure present on the base. Fix a
regression introduced by the change and rerun the suite.

## 4. Push

Verify the push URL and destination before pushing the tested commit with
`git push <remote> HEAD:<authorized-branch>`. Never force push the default
branch. If the remote moved, fetch again and apply the same branch rules.
Run the checks again if the resulting tree changed.

## Report

Give the remote, destination and pushed commit range, or the local commit and
the action awaiting approval. Include the test result, any failure reproduced
on the base, and how you resolved conflicts.
