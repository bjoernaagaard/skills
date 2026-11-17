# skills

The repository holds the agent skills I use every day, and each skill works in Claude Code and Codex.

## Install the skills

Run the following command to install the skills:

```bash
npx skills add bjoernaagaard/skills
```

## Skills for git work

The `ship`, `rebase`, `restack`, and `review` skills move local changes onto the default branch on GitHub, which git calls `origin/HEAD`. You start a skill by typing its name, e.g., "ship".

| Skill | What the skill does |
|---|---|
| `ship` | It commits all changes, rebases them onto `origin/HEAD`, runs the tests, and pushes. |
| `rebase` | It moves the current commits onto the newest `origin/HEAD` and keeps uncommitted changes. |
| `restack` | It rewrites the commits since the branch started into small commits that are easy to review, and it does not push. |
| `review` | It asks a second agent to review the current changes, and it reports the findings that hold up. |

The `ship` skill follows the steps of the `rebase` skill, so install both. The diagram shows the order of the steps in `ship`.

```mermaid
flowchart TD
    A[Commit uncommitted changes] --> B[Fetch origin and rebase onto origin/HEAD]
    B --> C[Run the full test suite once]
    C --> D{Does a test fail?}
    D -- yes --> E{Does the test also fail on origin/HEAD?}
    E -- yes --> F[Note the old failure and continue]
    E -- no --> G[Fix the code and commit the fix]
    G --> C
    D -- no --> H[Push to origin/HEAD]
    F --> H
    H --> I{Did origin/HEAD move?}
    I -- yes --> B
    I -- no --> J[Report the pushed commits]
```

When `ship` rebases again after a rejected push, it reruns the tests only if a conflict fix changed files.

## Skills for writing

| Skill | What the skill does |
|---|---|
| `reply-repair` | It shapes replies so the reader can act on them, and it repairs a reply the reader could not use. |
| `emphasis` | It marks each claim in a reply with a bold status badge such as **[Done]** or **[Needs you]**, and it works where hooks and plugins are blocked. |
| `bluf` | It starts a status update or report with what the reader must do or decide. |
| `sbar` | It writes a handover as Situation, Background, Assessment, and Recommendation. |
| `scholarly-paper-revision` | It revises LaTeX papers for correct math, clear explanations, and consistent notation. |

## Skills for engineering

| Skill | What the skill does |
|---|---|
| `honest-performance` | It measures, profiles, and speeds up software, and it checks claims about speed. |
| `verify-change` | It proves a change by running it, chooses a test that is hard to fool, and keeps tests and checks honest. |
| `deliver` | It writes down what done means before the work, proves each part with a check, and has a model from the other family grade the result. |
| `model-router` | It decides whether to hand work to a second agent, and which model and effort level the agent gets. |
| `no-handoff` | It takes every step it can before a reply ends, and it hands you only a step that needs your hands, your money, a credential or a release. |
| `simplify-change` | It removes code that a change does not need, and it keeps the required behavior. |

## How a skill is stored

Each skill has its own folder with the instructions and an optional settings file for Codex.

```text
skills/
└── ship/
    ├── SKILL.md            # instructions the agent follows
    └── agents/
        └── openai.yaml     # name, summary, and example prompt for Codex
```

## License

The skills use the MIT license, and the [LICENSE](LICENSE) file holds the full text.

## The handoff-gate mod

`handoff-gate` is a Claude Code mod that enforces the `no-handoff` skill. It reads the last reply of a turn, and when the reply hands you a command or asks for a go-ahead that the agent could take itself, it sends the agent back to work once.

```text
/plugin install handoff-gate --marketplace bjoernaagaard/skills
```

The mod is a hooks module, so it does not load where an administrator has turned hooks off. Install the skill there instead, which needs no hook:

```bash
npx skills add bjoernaagaard/skills --skill no-handoff
```
