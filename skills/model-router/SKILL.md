---
name: model-router
description: Decide whether to hand work to a subagent, and which model and effort level each subagent gets. Use before starting, delegating to, or configuring a subagent, and when choosing a model or effort level for a task.
---

# Model router

## Delegate or not

Delegate work that splits into independent pieces whose results come back as a summary, such as finding code, reading logs, searching sources, or running tests. Do the work yourself when it is one chain of dependent steps or it fits in your context. Keep edits, synthesis, and consequential judgment with the lead.

## Pick the tier

| Tier | Use for | Claude | OpenAI |
| --- | --- | --- | --- |
| Light | high-volume simple work (classify, route, tag, extract) and subagents whose errors are easy to catch | Haiku | Luna |
| Fast | fast, well-scoped work: a bug fix, a specified feature, an everyday document | Sonnet | Terra |
| Main | the default lead: everyday engineering, debugging, multi-PR work, complex knowledge work | Opus | Sol |
| Top | the hardest work: large refactors and migrations, architecture plans, deep research, quantitative analysis | Fable | Astra |

- **Lowest tier that fits the step.** Give each subagent a check and the lowest tier whose mistakes that check catches. A step that later steps build on starts at the tier it needs, because a failed cheap try is paid twice.
- **Effort.** Start at `medium`. Use `low` for simple work with a check, and `high` for harder work or more self-checking.
- **Escalate in order.** Add a check, then raise effort one level, then move up one tier at lower effort. Move to Top before raising Main past `high`.
- **Ask before Top.** When Top is the right pick, start nothing. Ask the user to confirm it, and offer Main as the cheaper choice.
- **Use the harness's own IDs.** List the models your harness can start, match a tier by the name inside an ID, such as `opus` or `terra`, and pass the ID exactly as listed, with whatever provider or proxy prefix it carries. If the tier you want is missing, take the nearest listed one and say so.
- **The user's choice wins.** A model, effort level, or routing table that the user or project sets overrides this skill.

## Routes

- **Second review from another family.** When a missed error is costly, add one reviewer from a different family at Main or Top, in a fresh session that has not seen the first review.

## Look up the rest

- Claude prices and the source of the tiers → [references/claude.md](references/claude.md)
