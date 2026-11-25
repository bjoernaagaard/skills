---
name: setup-bstack
description: Configure approved delegate models and quota fallbacks in T3 Code, and pick the model for a delegate or a workflow agent. Use when the user asks to set up bstack, before a `delegate_task` or a T3 workflow `agent` step on a machine that has a bstack profile, and when a delegate stops on a usage or quota limit.
---

## Configure once per machine

1. Call T3 Code's `orchestrator_capabilities`. Use exact provider instance IDs, models and option values. Check the existing profile at `${XDG_CONFIG_HOME:-$HOME/.config}/bstack/t3-routes.json`.
2. Agree on ordered peers for each tier you need, named S, A, B and C as [model-router](../model-router/SKILL.md) defines them. The order is the rotation, because the first target with quota left is picked. Use a shared `quota` label for targets drawing from the same account, even when they appear under different provider instances. Use only providers and funding authorized for the project.
3. Run `node <this skill directory>/scripts/route.mjs validate` with `{ "catalog": ..., "profile": ... }` as JSON on stdin. Save the validated profile and read it back. An example entry is `{"routes":{"A":[{"target":{"providerInstanceId":"codex","model":"gpt-6.2-sol","options":{"reasoningEffort":"medium"}}}]}}`. Use the live catalog to verify IDs in the example too.

## Route a delegate

Run the same script with `select` and JSON containing `catalog`, `profile`, and `tier`. Set `independentFamily: true` when cross-family review is required. Pass the returned `target` to native `delegate_task`, and change only its effort option when model-router calls for another level. A blocked result leaves the work or review open. Use separate T3 worktrees for concurrent writers.

## Route a workflow agent

A workflow `agent` step without `model` runs on the project default, which is often the most expensive model. Run the script with `models` and `{ "catalog": ..., "profile": ... }`. It prints each tier's targets in order, in the shape `model` takes. Give every `agent` step the first target of the tier that fits its stage, and pass the next target to its `agent.try` retry.

## Replace a failed delegate

On a suspected quota failure, wait for the terminal result. Read `task_status` and the child thread's `t3_thread_read` activity, paging to the failed run if needed. Pass `attempts: [{ "status": ..., "activity": ... }]` to `select` and keep all failed attempts for this logical task. The router checks the child, run and quota message before allowing retry. Optionally pass `unavailableQuotaGroups` for accounts with confirmed unexpired limits from other tasks. Missing quota data means unknown.

Before dispatching a replacement, check the prior worktree and completed side effects. Give the replacement the original goal, the same authorized workspace, a new request ID, and only the unfinished actions. Preserve completed writes. If a child is still active, cancel it and confirm there are no pending runs before replacing it. Diagnose ordinary failures before deciding whether to retry.

An exhausted lead requires a T3 continuation outside the stopped agent. After switching that thread to an approved model, reconcile any pending work and continue from the last completed action.

## Related skills

Use one when its case comes up and it is installed.

- Whether to delegate at all, and which tier and effort a step needs → [model-router](../model-router/SKILL.md)
