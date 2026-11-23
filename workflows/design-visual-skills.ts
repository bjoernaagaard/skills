import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const { workflow, agent, step, title } = T3;
const project = join(homedir(), "src", "skills");
const scope = [
  "Design the user's own successors to HumanLayer show-me, visual-pr and rpi for frontier models in T3 Code.",
  "Follow the user's global AGENTS.md. Show the useful view early, use real values when available,",
  "keep the answer short and self-contained, and leave the user only decisions that need them.",
  "Work read-only in this design run. Return your work through the workflow. Use fixtures for PR actions.",
  "Never install or activate these drafts, publish a PR, or change a real project to demonstrate a skill.",
].join(" ");

const research = {
  upstream: `Read github.com/humanlayer/skills at a recorded commit, including all three SKILL.md files,
    the PR template, render guidance and RPI phase references. Compare installed versions.
    For each skill list the behaviors to keep, adapt or drop and why. Account for attribution.
    Inventory this repo's skills and the installed catalog. Read the closest neighbors and the actual
    global AGENTS.md. Assign ownership of explanation, PR authoring, research, verification, shipping,
    writing and handoffs. Identify discovery collisions, including the three upstream names.`,
  models: `Read Agent Docs/INDEX.md and Model differences.md, then the relevant underlying skill,
    prompting, repository instruction and delegation guides for OpenAI, Anthropic and Google.
    Give exact file/section pointers. Separate skill discovery and host permissions from model prompting.
    For each material model difference give the instruction it changes and an observable example.
    Identify shared rules that can be stated once. Separate documented guidance from measured behavior.`,
  surfaces: `Enumerate and skim the full current pingdotgg/t3code docs/user directory at a recorded
    commit, especially html-renders, appearance, composer, devices, snap-shot and source-control.
    Check tools actually available on this host. Map communication needs to native text, math, tables,
    diffs, Mermaid or other diagrams, HTML preview/render, images/video, file viewers, browser/device
    panels and MCP Apps. Describe when each is justified, visible where, permissions/platform limits,
    a verification signal and the smallest fallback. Distinguish GitHub PR body support from T3 chat.
    In a prior real demo HTML rendered; errors from two xpd calls left "Waiting for content" while a
    successful call showed a table. Treat returned data and user-visible output as separate observations.`,
};

const tasks = {
  showMe: `Use a real decision or comparison to define proactive visual selection without requiring the
    user to say "show me". Include the near miss where a one-line fact is enough. Demonstrate the
    smallest useful view, and how it degrades when tools are unavailable or math rendering is off.`,
  visualPr: `Design reader-first PR authoring from the actual diff and check results. Show the shape
    of one change with a GitHub-compatible visual. Distinguish a chat preview, a PR draft and an
    authorized publish/update. Reuse ship/verify-change and handle an existing PR's authored prose.`,
  rpi: `Preserve the valuable upstream phases, direct entry, iteration and resume. Prefer the shortest
    route the task needs. Specify research-only stopping, carrying decisions forward, ownership of
    implementation and verification, and one case where a T3 visual resolves a design decision.
    Distinguish technical design documents from test-driven development. Honor the user's test rules.`,
};
const drafts = Schema.Struct({
  showMe: Schema.String, visualPr: Schema.String, rpi: Schema.String, designNotes: Schema.String,
});
const trial = Schema.Struct({ response: Schema.String, actions: Schema.String, limits: Schema.String });
const probes = {
  showMe: "Yesterday the queue held 12 jobs at 09:00, 48 at 10:00, and 15 at 11:00. Where was the spike? These are example counts. Answer as you would in T3 Code.",
  visualPr: "Draft a GitHub PR body here. Before: saveDraft always wrote to disk. After: saveDraft returns the cached result when the content matches; changed content is written as before. The CLI reported zero writes on an identical second save. The PR has not been published.",
  rpi: "Research only: how does this skills repo make its skills discoverable in different agent hosts? Show me the important split and stop there.",
};

function work(name, brief, returns) {
  return agent(name, { project, brief, returns, timeout: "35 minutes" });
}

export default workflow("design-visual-skills", { version: 1, payload: Schema.Struct({}) },
  Effect.fn(function* (_, run) {
    yield* title("Design personal show-me, visual-pr and rpi skills");
    const findings = yield* Effect.all(Object.entries(research).map(([name, brief]) =>
      work(name, scope + "\n" + brief + "\nReturn compact source-linked findings.", Schema.String)
    ), { concurrency: 3 });
    const evidence = findings.map((item) => item.value).join("\n\n");
    const draft = yield* work("draft", [scope, evidence, ...Object.values(tasks),
      "Return one complete, original standalone SKILL.md per skill, with frontmatter and unambiguous",
      "discovery triggers. Choose collision-free personal names or specify a verified replacement path.",
      "Use concise directions that leave implementation judgment to capable models. Include a small",
      "example per skill. In designNotes record coverage, material decisions, source-to-behavior links,",
      "reuse boundaries and realistic positive and near-miss cases with expected actions before trials.",
    ].join("\n"), drafts);

    const observed = yield* Effect.all(Object.entries(probes).map(([key, prompt]) =>
      work("try-" + key, [
        "Apply the supplied draft skill to the request below in this T3 thread. Do the actual work",
        "using read-only access to the project. You may render inline HTML in this thread.",
        "Do not publish externally. Return your user-facing response and actual tools/artifacts,",
        "including failures. This direct invocation does not test ambient skill discovery.",
        draft.value[key], prompt,
      ].join("\n"), trial)
    ), { concurrency: 3 });

    const final = yield* work("revise", [scope, evidence, JSON.stringify(draft.value),
      JSON.stringify(Object.entries(probes).map(([key, prompt], i) =>
        ({ key, prompt, observed: observed[i].value }))),
      "Finalize all three standalone SKILL.md drafts. Compare predicted and observed actions. Fix",
      "observed mismatches, and identify revisions that still need a fresh run. Check every trigger",
      "against a near miss and each external action against the user's authorization. Mark paper",
      "checks, actual trials, and untested host/model combinations honestly. Keep evidence and",
      "tradeoffs in designNotes, not in the operational skill text. Include one concise decision",
      "summary and a practical activation path that preserves unrelated skills.",
    ].join("\n"), drafts);

    return yield* step("save-design", { returns: Schema.String }, Effect.tryPromise(async () => {
      const folder = join(homedir(), ".t3", "designs", "visual-skills", run.id);
      await mkdir(folder, { recursive: true });
      const staging = await mkdtemp(join(folder, ".writing-"));
      try {
        for (const [key, filename] of Object.entries({
          showMe: "show-me.md", visualPr: "visual-pr.md", rpi: "rpi.md", designNotes: "design.md",
        })) {
          await writeFile(join(staging, filename), final.value[key] + "\n");
          await rename(join(staging, filename), join(folder, filename));
        }
      } finally {
        await rm(staging, { recursive: true, force: true });
      }
      return folder;
    }));
  })
);
