---
name: visual-explanation
description: Explain a system, change, trend, or tradeoff using the smallest visual (table, tree, diff, pseudocode, Mermaid diagram, or T3 Code HTML chart). Use proactively even unasked. Skip single lookups and live CSS inspection (/explain-interface).
---

# Visual explanation

Lead with the answer and the smallest visual that makes the relationship clear. Place the takeaway beside the view so a reader with no prior context can understand the answer in one pass. Use real labels, values, units, and sources from the task, and mark any example or placeholder data explicitly.

Skip visuals for a single lookup or simple fact, and answer in one sentence instead.

## Choose the view

| Question or structure | View |
| --- | --- |
| Separate items, findings, or options | Three to five bullets, each starting with a bold label |
| Exact comparison across shared fields | Compact Markdown table |
| File layout, ownership, or call hierarchy | Indented text tree |
| Branching logic or state transitions | Pseudocode |
| Structural before and after change | Focused `diff` with enough surrounding context |
| Request flow or messages between parts | Small Mermaid diagram |
| Numeric trend, spike, magnitude, or spatial layout | Self-contained HTML chart or visual in T3 Code |
| Formula or equation | LaTeX math as `$…$` or `$$…$$`, which T3 Code typesets when Render math is on |
| Screenshots or image files side by side | HTML page in T3 Code that places the local images by file path |

## Use the right T3 surface

- **Inline T3 thread HTML.** When a chart, spatial layout, or interactive view earns HTML in T3 Code, build self-contained HTML with inline styles and scripts. Call `html_preview` first and inspect the rendered PNG, height, and console output for legibility, clipping, narrow layout, and errors. When the native `html_render` tool is exposed, send the checked HTML with it. Never start a server or use `preview_*` browser tools to show an explanation.
- **Check the receipt.** Check the `html_render` receipt. Report the preview or the receipt only when one shows a problem. They show what was sent, not what the reader's client displays.
- **Fallbacks.** If `html_preview` or `html_render` is unavailable, disabled, or fails, report the tool limit and present the labeled values or relationship in Markdown instead of stalling or working around tool permissions. When math rendering is off, write an essential formula in plain words.
- **Other requested surfaces.** When the user asks for an image to post, send, or use elsewhere, write a `.png` file and return its path instead of calling `html_render`. When the user names another surface, use it within task scope.
- **Scope and routing.** An explanation request authorizes inline delivery in the current thread. Controlling a browser or device, writing files to disk, or sharing externally each requires matching task scope. Skip inspection of how a live web interface or CSS effect was built, or suggest `/explain-interface` when installed.

## Example

Takeaway for "Which commit slowed the build?" (example data): commit B jumped to **72 s**, four times commit A. In T3 Code, render an inline HTML bar chart; without HTML tools, show the labeled table:

| Commit | Build time (example) | Change vs. A |
| --- | --- | --- |
| A | 18 s | Baseline |
| B | 72 s | 4x slower |
| C | 24 s | +33% |

By contrast, "How long did commit B take?" gets one sentence ("Commit B took 72 seconds.") with no visual.

## Related skills

Use one when its case comes up and it is installed.

- The length and the closing line of the reply around the view → [reply-repair](../reply-repair/SKILL.md)
- A breakdown of a question into causes, parts or options → [issue-tree](../issue-tree/SKILL.md)
- A document saved to a file, such as a README or a guide → [human-writing](../human-writing/SKILL.md)
- A view for a pull request body → [write-pr-body](../write-pr-body/SKILL.md)
