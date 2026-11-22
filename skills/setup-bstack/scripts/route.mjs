import { readFileSync } from "node:fs";

const modelFamily = (model) => model.split("/").at(-1).split("-")[0];
const quotaGroup = (entry) => entry.quota ?? entry.target.providerInstanceId;

function targetProblem(target, catalog) {
  if (
    !target ||
    typeof target.providerInstanceId !== "string" ||
    typeof target.model !== "string" ||
    Object.keys(target).some((key) => !["providerInstanceId", "model", "options"].includes(key)) ||
    (target.options !== undefined && (!target.options ||
      typeof target.options !== "object" || Array.isArray(target.options)))
  ) {
    return "Target must contain only a provider instance, model and optional settings.";
  }

  const provider = catalog.providers.find(
    ({ providerInstanceId }) => providerInstanceId === target.providerInstanceId,
  );
  if (!provider?.canRunChildTask || (
    provider.canRunCrossProviderChildTask === false &&
    target.providerInstanceId !== catalog.inheritedProviderInstanceId
  )) {
    return `Provider cannot delegate here: ${target.providerInstanceId}`;
  }
  const model = provider.models.find(({ id }) => id === target.model);
  if (!model) return `Model absent from catalog: ${target.model}`;

  for (const [id, value] of Object.entries(target.options ?? {})) {
    if (!model.options?.some((option) => option.id === id && option.values.includes(value))) {
      return `Unsupported option: ${target.model} ${id}=${value}`;
    }
  }
}

function validateProfile(profile, catalog) {
  const groups = new Map();
  const routes = Object.entries(profile.routes);
  if (!routes.length) throw new Error("Configure at least one role.");

  for (const [role, entries] of routes) {
    if (!Array.isArray(entries) || !entries.length) {
      throw new Error(`Configure at least one target for ${role}.`);
    }
    const seen = new Set();
    for (const entry of entries) {
      const { target } = entry;
      const problem = targetProblem(target, catalog);
      const key = JSON.stringify([target?.providerInstanceId, target?.model]);
      if (problem) throw new Error(`${role}: ${problem}`);
      if (seen.has(key)) throw new Error(`Duplicate target in ${role}: ${key}`);

      const group = quotaGroup(entry);
      if (typeof group !== "string" || !group.trim()) throw new Error("Quota groups need a name.");
      const assigned = groups.get(target.providerInstanceId);
      if (assigned && assigned !== group) {
        throw new Error(`Assign one quota group to ${target.providerInstanceId}.`);
      }
      groups.set(target.providerInstanceId, group);
      seen.add(key);
    }
  }

  return { valid: true, roles: routes.map(([role]) => role) };
}

function failedQuota(attempt, entries) {
  const { status, activity } = attempt;
  const run = status.latestTerminalRunId;
  if (
    status.status !== "failed" ||
    status.workState !== "result_available" ||
    status.hasPendingChildRuns !== false ||
    !run ||
    !status.childThreadId ||
    activity.thread.threadId !== status.childThreadId
  ) {
    throw new Error("Retry requires a failed T3 child with no pending runs and its own activity.");
  }

  const quotaError = activity.items.some(({ type, text, runId }) =>
    type === "error" && runId === run && typeof text === "string" &&
    /subscription quota exhausted|usage limit (?:reached|exceeded)|usage window resets|you(?:'ve| have) hit your usage limit|reached your (?:[\w-]+ )?usage limit/i.test(text),
  );
  if (!quotaError) throw new Error("No confirmed quota failure in the failed run.");

  const entry = entries.find(({ target }) =>
    target.providerInstanceId === status.providerInstanceId && target.model === status.model,
  );
  if (!entry) throw new Error("The failed target is outside this approved route.");
  return quotaGroup(entry);
}

function select({ profile, catalog, role, attempts = [], unavailableQuotaGroups = [], independentFamily = false }) {
  const entries = Object.hasOwn(profile.routes, role) && profile.routes[role];
  if (!entries?.length) throw new Error(`No approved route for ${role}.`);

  const exhausted = new Set([...unavailableQuotaGroups, ...attempts.map((attempt) => failedQuota(attempt, entries))]);
  const skipped = [];
  for (const entry of entries) {
    const { target } = entry;
    const problem = targetProblem(target, catalog);
    if (problem || exhausted.has(quotaGroup(entry)) || (independentFamily &&
      (!catalog.inheritedModel || modelFamily(target.model) === modelFamily(catalog.inheritedModel)))) {
      skipped.push({
        target,
        reason: problem ?? (exhausted.has(quotaGroup(entry)) ? "quota exhausted" : "independent family required"),
      });
      continue;
    }
    return { kind: "target", target, skipped };
  }
  return { kind: "blocked", skipped };
}

try {
  const [action] = process.argv.slice(2);
  const input = JSON.parse(readFileSync(0, "utf8"));
  if (action !== "validate" && action !== "select") throw new Error("Expected validate or select.");
  const output = action === "validate" ? validateProfile(input.profile, input.catalog) : select(input);
  console.log(JSON.stringify(output));
} catch (error) {
  process.exitCode = 1;
  console.error(error.message);
}
