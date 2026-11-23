---
name: write-pr-body
description: Draft, revise, preview, or publish a GitHub pull request title and body from the actual diff and check results. Use when writing or updating a PR description, opening a PR with a clear reviewer summary, or previewing PR wording. Route independent code review to review and branch preparation or delivery to ship.
---

# Write a PR body

Start from the exact source the request identifies.

- **Self-contained fixture.** When the request supplies the change and check results directly, work from that fixture alone. Do not inspect an unrelated checkout or run git searches unless the request ties that checkout to the change. Keep fixture actions inside the fixture.
- **Real repository change.** Resolve the repository, base branch, and head branch, and read the complete intended diff. Include uncommitted local edits only when the request calls for them. Read the repository PR template if one exists. When revising an existing PR, read its current title and body first and preserve relevant authored wording, migration notes, links, and checklists.

## Write for the reviewer

Lead with why the change exists and the behavior reviewers can expect. Use portable GitHub Markdown, never T3 `html_render`, for PR content. Add a focused `diff` block, compact Markdown table, or small Mermaid diagram when it clarifies the structural change. Label inferred or illustrative code as a behavior sketch.

Include consequential risks, migrations, or rollout steps when the change calls for them. Report checks for the exact version being described, with the command and result when known. Label missing, stale, or supplied evidence explicitly. Use [verify-change](../verify-change/SKILL.md) when asked to prove the change.

## Match the authorized action

| Request | Allowed action and finish check |
| --- | --- |
| Preview wording | Show the requested excerpt or layout in chat. Make zero PR writes. |
| Draft in chat | Return the requested title or body as copyable GitHub Markdown. Make zero PR writes. |
| Apply an authorized edit | Confirm the repository, exact PR number, and current head. Update only the requested fields while preserving untouched sections. Read back the saved fields, including before retrying an uncertain write. |
| Publish or open a PR | Check for an existing PR for the resolved repository, base, and head, and reuse it when it matches the request. Use [ship](../ship/SKILL.md) for any needed, authorized branch preparation. Because T3 PR creation pushes the branch, confirm push is within scope before calling it. Read back the created PR. |

Use T3 PR tools where available and follow the host's PR linking rules only after an authorized live PR action. Permission to preview, draft, or edit PR text grants no authority to stage, commit, push, post comments, merge, or upload media. Commenting, merging, uploading media, and publishing outside permitted destinations each need their own explicit authorization. An explicitly authorized action proceeds without asking again, subject to host permissions. Route independent critique to [review](../review/SKILL.md).

## Example

For a change that skips duplicate saves with a supplied CLI result, lead with "Identical saves reuse the cached result." A labeled behavior sketch can show the guard:

~~~diff
+ if content matches, return the cached result
  write changed content to disk
~~~

Report "The fixture CLI reported zero writes on the second identical save." Include a command only if it was supplied or observed.
