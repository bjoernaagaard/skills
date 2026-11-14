---
name: restack
description: Rewrite all work since the merge base into logical, easy-to-review commits without pushing. Use when the user says "restack", or asks to clean up, split, squash, or reorder commits.
---

# Restack

Turn all committed and uncommitted changes since the merge base into logical,
easy-to-review commits. Keep the final tree and behavior exactly the same. Do
not push.

## 1. Read the whole change

1. Find the base with `git merge-base HEAD origin/HEAD`.
2. Read `git log --reverse <base>..HEAD`, then the complete diff from the base
   to the worktree, including untracked files.
3. Save the target tree: `git stash create` gives a commit that holds the
   worktree, or use `HEAD` when the worktree is clean. Also note the current
   branch tip so you can go back to it.

## 2. Plan the commits

Group the changes into commits that each do one thing and that a reviewer can
read in order. Put refactors and moves before the behavior changes that depend
on them. Keep each commit buildable when you can. Split a file across commits
with `git add -p` style hunks when one file holds two ideas.

## 3. Rewrite

Reset softly to the base, then build the planned commits with partial adds.
Do not use interactive commands. Write each message in the repository's style
and explain why the commit exists.

## 4. Prove the tree is the same

Run `git diff <saved target> HEAD`. It must print nothing, apart from changes
you deliberately left uncommitted. If it prints anything else, fix the commits
before you report.

## Report

List the new commits, oldest first, with one line on what each one does, and
confirm the tree matches the original.
