---
name: rebase
description: Fetch origin and rebase the current work onto the latest origin/HEAD, keeping uncommitted changes. Use when the user says "rebase", "rebase on main", or asks to update the branch.
---

# Rebase

Rebase the current work onto the latest `origin/HEAD`. Keep every uncommitted
change.

1. Record `git status` so you know which changes are staged, unstaged, and
   untracked.
2. If the worktree is dirty, run `git stash push --include-untracked`.
3. Run `git fetch origin`, then `git rebase origin/HEAD`. If `origin/HEAD` does
   not resolve, run `git remote set-head origin --auto` first.
4. Resolve conflicts. Ask the user before you resolve a conflict where both
   sides changed behavior and the right result is not obvious.
5. Restore the stash with `git stash pop --index`. Resolve any conflicts it
   raises, and make sure the staged and unstaged split matches step 1.

## Shallow clones

If the rebase floods you with add/add conflicts in files this work never
touched, the clone is shallow and Git cannot find the merge base. Run:

```bash
git rebase --abort
git fetch --quiet --unshallow origin HEAD
git rebase origin/HEAD
```

## Report

Give the old base, the new base, how many commits you replayed, how you
resolved each conflict, and confirm that the uncommitted changes are back.
