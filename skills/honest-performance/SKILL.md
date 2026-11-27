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

Benchmarking delivers measurements and limits; diagnosis delivers supported explanations and open uncertainty; claim review assesses evidence. None of those three authorize implementation changes. Optimization delivers retained changes with correctness and performance evidence.

Establish workload, constraints, and finish conditions. Infer the primary metric when clear. Use stated targets, label proposed targets separately, and leave adequacy unknown without a target. Preserve correctness and fixed constraints before stated priorities, and never invent weights for unresolved tradeoffs.

Stay within authorized resources. Finish the requested outcome, not merely the first speedup, and stop once evidence supports the outcome or stops justifying more runs. Report unmet targets and negative or inconclusive results. Neither exhaustive optimization nor reference parity is required unless asked.

## Compare and explain

Preserve the starting code state and capture a baseline first where possible. Label missing evidence and naive baselines. Inspect a competent comparator when it informs the decision, explain material differences in behavior, scale, and resources, and avoid building a comparator without clear decision value. Treat published numbers as context, not controlled comparisons.

Inspect necessary work, repetition, allocation, copying, and scaling before local tuning, and consider eliminating work, reuse, algorithms, data layout, and existing libraries. Investigate large reference gaps or implausible numbers. Use profiling or focused experiments to separate explanations, because a hotspot alone does not prove a cause. Label hypotheses, estimates, and bounds.

Read [measurement and evidence](references/MEASUREMENT.md) before running or changing benchmarks, or when auditing measurement validity. For a source-only review, load it only when a measurement question needs it.

## Retain changes and report

Retain changes with a plausible mechanism and evidence for the claimed benefit. Check material tradeoffs such as memory, startup, tail latency, complexity, and larger inputs. Expand investigation only when it could change correctness, target attainment, the retained implementation, claim credibility, or the user's decision. Reuse valid evidence, ensure results describe the delivered code, and keep abandoned experiments distinct from retained changes.

Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Answer the question first, then show a comparison table with absolute measurements, units, comparator, and observed or supplied status (or an inline HTML chart in T3 Code for trends and distributions). Keep surrounding prose to one or two sentences, and skip the table only when a single number answers the question.

| Metric | Baseline | Candidate | Delta | Evidence |
| --- | --- | --- | --- | --- |
| p95 latency (example) | 142 ms | 68 ms | -52% | Observed (5 runs, `bench.py`) |
| Peak RSS (example) | 410 MB | 465 MB | +13% | Observed (same runs) |

State separately whether improvement is verified, requirements are met, and a competitive gap remains, marking unsupported judgments unknown. Distinguish measurements you ran from supplied results, estimates, and untested explanations. Microbenchmarks do not establish application-wide gains, and a baseline win does not prove optimality or production readiness. Report correctness evidence, delivered state, evidence locations, material variation or regressions, and limitations. When execution is unavailable, finish useful analysis or a requested harness and mark performance unverified.

## Related skills

Use one when its case comes up and it is installed.

- Picking a comparison table or T3 Code HTML chart for measurements → [visual-explanation](../visual-explanation/SKILL.md)
- Proof that a retained change still behaves correctly → [verify-change](../verify-change/SKILL.md)
- The measurement shows work the code does not need → [simplify-change](../simplify-change/SKILL.md)
- Several possible causes of a slowdown → [issue-tree](../issue-tree/SKILL.md)
