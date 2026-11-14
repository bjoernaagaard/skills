---
name: honest-performance
description: Benchmark, profile, diagnose, optimize, or review software performance. Use when measurements, resource costs, or performance claims are central, not for unrelated development.
---

# Honest performance

Distinguish improvement over the starting point, adequacy for the user's
requirements, and competitiveness against a competent alternative. Evidence for
one does not establish the others. A large gain over a poor baseline does not
establish a good design.

## Choose the authorized work

Benchmarking delivers measurements and limitations. Diagnosis delivers supported
explanations and unresolved uncertainty. Claim review assesses evidence. Neither
diagnosis nor review authorizes implementation changes. Optimization delivers
retained changes with correctness and performance evidence.

Establish the workload, constraints, and completion conditions. Infer the primary
metric when the task makes it clear. Use stated targets; label proposed targets and their rationale separately. Leave
adequacy unknown when no target supports a judgment. Preserve correctness and
fixed constraints before pursuing the stated priorities. Do not invent weights
for unresolved tradeoffs or retain an unsupported compromise.

Keep investigation within authorized resources; a missing budget does not
authorize unlimited experiments. Finish the requested outcome, not merely the
first speedup. Stop experimenting when the outcome is supported or evidence
no longer justifies another check. Report unmet targets. Negative or inconclusive
results are valid. Neither exhaustive optimization nor reference parity is
required unless requested.

## Compare and explain

Preserve the starting code state and obtain a relevant baseline before changes
where possible. Label missing evidence and deliberately naive baselines. Seek a
competent existing implementation when it could inform the decision. Explain
material differences in behavior, scale, and resources. Bound comparator search
by its decision value; do not build a comparator without a clear need. Published
results provide context, not a controlled comparison. Inspect the reference's
avoided work and design choices when accessible.

Inspect necessary work, repetition, allocation, copying, and scaling before
local tuning. Consider eliminating work, reuse, algorithms, data layout, and
existing libraries. Investigate substantial reference gaps or implausible results.
Use profiling or focused experiments to distinguish explanations; a hotspot
alone does not establish a cause. Label hypotheses, estimates, and bounds.

Read [measurement and evidence](references/MEASUREMENT.md) before running or
changing benchmarks, or when auditing measurement validity. For a source-only
design review, load it only if a measurement question requires it.

## Retain changes and report

Retain changes with a plausible mechanism and evidence for the claimed benefit.
Check material tradeoffs such as memory, startup, tail latency, complexity, and
larger inputs. Expand investigation only when it could change correctness,
target attainment, the retained implementation, claim credibility, or the user's
decision. Reuse valid evidence and ensure results describe the delivered code.
Keep abandoned experiments distinct from retained changes.

Answer the question first. State separately whether improvement is verified,
requirements are met, and a competitive gap remains; mark unsupported judgments
unknown. Give absolute measurements with units, the metric and comparator for
relative claims, and material variation, regressions, or exclusions.

Distinguish measurements you ran from supplied results, estimates, and untested
explanations. Microbenchmarks do not establish application-wide gains. Do not
infer optimality or production readiness from a baseline win. Include relevant
correctness evidence, delivered state, evidence locations, and limitations.
When execution is unavailable, finish useful analysis or a requested harness
and mark performance unverified.
