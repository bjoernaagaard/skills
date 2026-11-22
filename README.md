# Agent skills

I use these skills in Claude Code and Codex to work with Git, check code changes, and write clear replies.

Use `$bmode` to apply the working conventions without hooks. Install it with no-handoff, emphasis, deliver, model-router, and ship.

## Git

| Skill | When to use it |
| --- | --- |
| [rebase](skills/rebase/SKILL.md) | Update your branch and keep uncommitted changes. |
| [restack](skills/restack/SKILL.md) | Split or reorder commits for review. |
| [review](skills/review/SKILL.md) | Ask a second agent to review your changes. |
| [ship](skills/ship/SKILL.md) | Verify the change and ship it to the destination allowed by the project. |

## Planning and code changes

| Skill | When to use it |
| --- | --- |
| [issue-tree](skills/issue-tree/SKILL.md) | Break a question into parts and check for gaps. |
| [model-router](skills/model-router/SKILL.md) | Choose when to delegate and which model to use. |
| [honest-performance](skills/honest-performance/SKILL.md) | Measure performance and check a claimed speedup. |
| [simplify-change](skills/simplify-change/SKILL.md) | Remove code a change doesn't need. |
| [verify-change](skills/verify-change/SKILL.md) | Run the changed feature and show the result. |
| [create-project-verifier](skills/create-project-verifier/SKILL.md) | Write repeatable steps for checking a project through its app or command. |
| [session-pickup](skills/session-pickup/SKILL.md) | Recover where a task stopped and what remains. |
| [deliver](skills/deliver/SKILL.md) | Define what counts as done and check each deliverable. |
| [no-handoff](skills/no-handoff/SKILL.md) | Have the agent finish the steps it can take itself. |

## Writing

| Skill | When to use it |
| --- | --- |
| [bluf](skills/bluf/SKILL.md) | Lead with the result or the decision the reader needs to make. |
| [emphasis](skills/emphasis/SKILL.md) | Make status, evidence, and next steps easy to scan. |
| [reply-repair](skills/reply-repair/SKILL.md) | Rewrite a reply the reader couldn't act on. |
| [sbar](skills/sbar/SKILL.md) | Write a handover with the situation, background, assessment, and recommendation. |
| [scholarly-paper-revision](skills/scholarly-paper-revision/SKILL.md) | Check the math, notation, and explanations in a LaTeX paper. |

## Install the skills

```bash
npx skills add bjoernaagaard/skills
```

If you select individual skills, install `rebase` with `ship`. To use a skill, type its name, such as `$bluf` in Codex or `/bluf` in Claude Code.

## Install an optional plugin

In Claude Code, `handoff-gate` asks the agent to continue when it hands you work it can do itself. The `emphasis` plugin adds color to status labels. Run the command for the plugin you want inside Claude Code.

```text
/plugin install handoff-gate --marketplace bjoernaagaard/skills
/plugin install emphasis --marketplace bjoernaagaard/skills
```

In Codex, install `codex-emphasis` to load the emphasis skill automatically.

```sh
codex plugin marketplace add bjoernaagaard/skills
codex plugin add codex-emphasis@skills-codex
```

Review the hook in `/hooks` and start a new session. If your workplace blocks plugins, you can install the `no-handoff` and `emphasis` skills with the skills command above.

[MIT license](LICENSE)
