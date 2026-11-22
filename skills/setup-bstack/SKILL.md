---
name: setup-bstack
description: Configure and use approved delegate models and quota fallbacks in T3 Code.
---

## Configure once per machine

1. Call T3 Code's `orchestrator_capabilities`. Use exact provider instance IDs, models and option values. Check the existing profile at `${XDG_CONFIG_HOME:-$HOME/.config}/bstack/t3-routes.json`.
2. Agree on ordered peers for the roles you need. Use a shared `quota` label for targets drawing from the same account, even when they appear under different provider instances. Use only providers and funding authorized for the project. One target per role is valid in a single provider environment.
3. Run `node <this skill directory>/scripts/route.mjs validate` with `{ "catalog": ..., "profile": ... }` as JSON on stdin. Save the validated profile and read it back. An example entry is `{"routes":{"implementation":[{"target":{"providerInstanceId":"codex","model":"gpt-6.2-sol","options":{"reasoningEffort":"medium"}}}]}}`. Use the live catalog to verify IDs in the example too.

## Route a delegate

Run the same script with `select` and JSON containing `catalog`, `profile`, and `role`. Set `independentFamily: true` when cross-family review is required. Pass the returned `target` unchanged to native `delegate_task`. A blocked result leaves the work or review open. Use separate T3 worktrees for concurrent writers.

On a suspected quota failure, wait for the terminal result. Read `task_status` and the child thread's `t3_thread_read` activity, paging to the failed run if needed. Pass `attempts: [{ "status": ..., "activity": ... }]` to `select` and keep all failed attempts for this logical task. The router checks the child, run and quota message before allowing retry. Optionally pass `unavailableQuotaGroups` for accounts with confirmed unexpired limits from other tasks. Missing quota data means unknown.

Before dispatching a replacement, check the prior worktree and completed side effects. Give the replacement the original goal, the same authorized workspace, a new request ID, and only the unfinished actions. Preserve completed writes. If a child is still active, cancel it and confirm there are no pending runs before replacing it. Diagnose ordinary failures before deciding whether to retry.

An exhausted lead requires a T3 continuation outside the stopped agent. After switching that thread to an approved model, reconcile any pending work and continue from the last completed action.
