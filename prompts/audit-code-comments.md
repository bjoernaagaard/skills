Use the bmode skill to audit code comments in the paths I name, or in this repository
if I give no paths. Account for every comment in scope, even if this change
removes only one batch. Preserve runtime behavior. Read the repository’s
instructions and locate its lint command, tracker, decision records and skills.

**Inventory before editing.** Use a parser, tokenizer or linter that understands
each language. Report the files covered, exclusions such as generated or
vendored code, and any language you could not inspect. A string containing
`https://` is data. A license notice, public API documentation, or a directive
read by a compiler, formatter or other tool can be required. Mark each
protected item with the reason. Before removing the only warning about an
ordering or safety constraint, show where the constraint is enforced. Keep
the warning if that protection is missing.

For each remaining comment, record its original location, category, evidence,
and action. Split a comment that serves two purposes. If the evidence is
inconclusive, keep the comment and say what would settle it.

| Category | How to decide | Action |
| --- | --- | --- |
| Tautology | Reading the adjacent code tells you the same thing. | Delete it. |
| Stale | Current behavior, history or a contract contradicts it. | Verify which is correct. Delete obsolete text. If the code violates the contract, report the defect and preserve the requirement. |
| Excuse | It justifies a workaround that still exists. | File or reuse one issue per underlying problem. Record the trigger, impact and condition for removing the workaround, then delete the comment. If filing needs approval or the tracker is unavailable, give a ready-to-file draft and keep the comment pending. |
| Decision Record | It explains a non-obvious choice and why it matters. | Move the rationale into a new or existing architecture decision record (ADR) using the project’s convention. Group comments about one decision. Preserve the evidence and consequences without inventing alternatives or history. Then remove the migrated text. |

**Ratchet the ban.** Use the existing linter or wire a language-aware check
into the normal lint command for the selected paths. Reject new ordinary
comments while allowing protected comments
and the specific legacy occurrences still awaiting cleanup. Removing one
legacy comment must never buy permission for a new one elsewhere. Retire
allowances as comments disappear. An unrelated line inserted above a legacy
comment should pass. Make the error name the location and fix.

**Make the next pass repeatable.** Create or update the repository-local
`delete-comment` skill for the active host. Give its `SKILL.md` a name,
a description that says when to use it, the scan and lint commands, and how
to apply the same exemptions and retire allowances in the next batch. Include
the project’s issue and ADR conventions. Add `agents/openai.yaml` with a display name,
short description and a default prompt invoking the `delete-comment` skill. Verify
discovery and show the invocation on this host. A repeat run on an unchanged
scope should reuse issues and ADRs and leave the tree unchanged.

**Prove and report.** Use the verify-change skill. Run the real lint command on a
disposable edit: it must reject a new ordinary comment, including a
one-for-one replacement, and accept a required directive and a comment marker
inside a string. Remove the probe and run the normal checks on the final tree.
Report the inventory totals, remaining work and issue or ADR references.

From the original inventory, count physical comment-only lines once, including
lines inside block comments. This gives the upper bound for deleting every
comment. Separately estimate the lines removable under this policy. Removing
an inline comment saves zero lines when the code remains. Report actual
source lines removed in this batch and the net repository line change,
including new ADRs, lint and skill files. Follow the project’s permissions
for issues, pushes and pull or merge requests.
