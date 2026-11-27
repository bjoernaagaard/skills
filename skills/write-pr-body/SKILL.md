---
name: write-pr-body
description: Draft, revise, preview, or publish a GitHub PR title and body from the actual diff and checks. Route code review to review and branch delivery to ship.
---

# Write a PR body

Start from the exact source the request identifies. Resolve the repository, base branch, and head branch, read the complete intended diff, and include uncommitted local edits only when requested. Read the PR template if one exists. When revising an existing PR, read its current title and body first and preserve relevant wording, migration notes, links, and checklists.

## Write for the reviewer

Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Lead with why the change exists and the behavior reviewers can expect. Use portable GitHub Markdown, never T3 `html_render`, for PR content. For any multi-file or behavioral change, show a focused `diff`, compact Markdown table, or small Mermaid diagram instead of paragraphs, and skip a visual only for a trivial single-line change. Label illustrative code as a behavior sketch.

Include consequential risks, migrations, or rollout steps when needed. Report checks for the exact version described, with command and result when known, and label missing, stale, or supplied evidence. Use [verify-change](../verify-change/SKILL.md) when asked to prove the change.

## Match the authorized action

| Request | Allowed action and finish check |
| --- | --- |
| Preview wording | Show the requested excerpt or layout in chat. Make zero PR writes. |
| Draft in chat | Return the requested title or body as copyable GitHub Markdown. Make zero PR writes. |
| Apply an authorized edit | Confirm repository, PR number, and current head. Update only requested fields while keeping untouched sections. Read back saved fields before retrying an uncertain write. |
| Publish or open a PR | Reuse an existing matching PR for the resolved repository, base, and head. Use [ship](../ship/SKILL.md) for authorized branch preparation. Confirm push is in scope before calling T3 PR creation, then read back the created PR. |

Use T3 PR tools where available and link PRs only after an authorized live PR action. Preview, draft, or edit permission grants no authority to stage, commit, push, comment, merge, or upload media. Each external action needs explicit authorization and then proceeds without asking again, subject to host permissions. Route independent critique to [review](../review/SKILL.md).

## Example

For a change that skips duplicate saves with a supplied CLI result, lead with "Identical saves reuse the cached result." A labeled behavior sketch shows the guard:

~~~diff
+ if content matches, return the cached result
  write changed content to disk
~~~

Report "The CLI reported zero writes on the second identical save." Include a command only if supplied or observed.

## Related skills

Use one when its case comes up and it is installed.

- Picking the smallest `diff`, table, or Mermaid diagram → [visual-explanation](../visual-explanation/SKILL.md)
- Plain prose for PR descriptions → [human-writing](../human-writing/SKILL.md)
- Proving checks before citing them → [verify-change](../verify-change/SKILL.md)
- Independent critique of the diff → [review](../review/SKILL.md)
- Preparing and pushing the branch → [ship](../ship/SKILL.md)
