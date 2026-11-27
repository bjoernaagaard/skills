---
name: ship
description: Prepare and verify changes for the delivery branch allowed by the project. Use when the user says "ship", "ship it", or asks to push their changes to main.
---

# Ship

Read the applicable Git instructions and request before choosing a destination. Use the authorized default branch for direct delivery, or the task branch for branch-based delivery. Treat a push, merge request, remote merge, and comment as separate actions under the host's approval rules. Pick the permitted local branch before committing. A request to ship or push to a named branch already authorizes that commit and push, so run them without asking again. If publication permission is unclear, finish local work and ask about the exact action.

## 1. Commit

Inspect the diff and outgoing history, stage only requested changes, and isolate unrelated work before pushing. Follow the repo's commit conventions. Use [restack](../restack/SKILL.md) only when asked for clean history.

## 2. Update the branch

Resolve push remote, destination branch, and integration base from the request, repo instructions, and Git config, then fetch relevant refs. Rebase onto the fetched destination for direct delivery, or the intended base for an unpublished task branch, following [rebase](../rebase/SKILL.md).

For a published task branch, skip sync if the fetched tip is an ancestor of HEAD. If diverged, preserve published commits when integrating remote changes, update from the integration base only when required, and ask before rewriting published history. Resolve mechanical conflicts and ask when both sides changed behavior unclearly.

## 3. Test

Run the full test suite on the outgoing commit, or prove the change with [verify-change](../verify-change/SKILL.md) when there is no suite. On failure, check the same test in a disposable worktree at the fetched base, remove the worktree, report base failures, and fix regressions before retesting.

## 4. Push

Verify push URL and destination, then run `git push <remote> HEAD:<authorized-branch>`. Never force push the default branch. If the remote moved, fetch again, apply the branch rules, and retest if the tree changed.

## Report

Give the remote, destination and pushed commit range, or the local commit and
the action awaiting approval. Include the test result, any failure reproduced
on the base, and how you resolved conflicts.

## Related skills

Use one when its case comes up and it is installed.

- Updating the branch onto the latest remote tip before pushing → [rebase](../rebase/SKILL.md)
- Splitting or reordering commits before shipping → [restack](../restack/SKILL.md)
- Proving the change when the project has no test suite → [verify-change](../verify-change/SKILL.md)
- Drafting or publishing a pull request description → [write-pr-body](../write-pr-body/SKILL.md)
