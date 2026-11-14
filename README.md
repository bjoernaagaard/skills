# skills

The agent skills I use every day. They work in Claude Code and Codex.

## Git workflow

| Skill | Say | What it does |
|---|---|---|
| `ship` | "ship" | Commits everything, rebases, runs the tests, and pushes to `origin/HEAD`. |
| `rebase` | "rebase" | Rebases onto the latest `origin/HEAD` and keeps uncommitted changes. |
| `restack` | "restack" | Rewrites the work since the merge base into reviewable commits. Does not push. |
| `review` | "review" | Has a subagent review the current changes and reports what it found. |

`ship` uses `rebase`. Install both.

## Writing

| Skill | What it does |
|---|---|
| `bluf` | Opens a status update or report with what the reader must do or decide. |
| `sbar` | Writes a handover or escalation as Situation, Background, Assessment, Recommendation. |
| `scholarly-paper-revision` | Revises scholarly LaTeX papers for correctness, clear exposition, and consistent notation. |

## Engineering

| Skill | What it does |
|---|---|
| `honest-performance` | Benchmarks, profiles, and optimizes software, and checks performance claims. |
| `model-router` | Decides whether to use a subagent, and which model and effort level it gets. |
| `python` | Starts, maintains, reviews, debugs, and upgrades Python projects. |
| `simplify-change` | Removes demonstrated excess from a diff while keeping required behavior. |

## Install

```bash
npx skills add bjoernaagaard/skills -g -a universal claude-code -y
```

## License

MIT
