---
name: honest-performance
description: Benchmark, profile, diagnose, optimize, or review software performance. Use when measurements, resource costs, or performance claims are central, not for unrelated development.
---

# Honest performance

Distinguish improvement over the baseline, adequacy for the user's targets,
competitiveness against a strong comparator, and distance from the hardware
ceiling. Evidence for one does not establish the others. A large gain over a
poor baseline does not establish a good design.

## Choose the authorized work

Benchmarking delivers measurements and limits; diagnosis delivers supported explanations and open uncertainty; claim review assesses evidence. None authorizes code edits. Optimization delivers retained changes with correctness and performance evidence.

Establish workload, constraints, and finish conditions. Infer the primary metric when clear. Use stated targets, label proposed targets separately, and leave adequacy unknown without a target. Preserve correctness and fixed constraints before stated priorities, and never invent weights for unresolved tradeoffs.

Stay within authorized resources. Finish the requested outcome, not the first speedup alone, and stop once evidence settles it or stops justifying runs. Report unmet targets and negative or inconclusive results. Exhaustive optimization and reference parity are not required unless asked.

## Compare and explain

Preserve starting code and capture a baseline first where possible. Label missing evidence and naive baselines. Inspect a competent comparator when it informs the decision, explain material differences in behavior, scale, and resources, and avoid building one without clear decision value. Treat published numbers as context, not controlled comparisons.

Inspect necessary work, repetition, allocation, copying, and scaling before local tuning, and consider eliminating work, reuse, algorithms, data layout, and existing libraries. Estimate the hardware ceiling (CPU, memory bandwidth, GPU, I/O) and check for runtime or container caps leaving capacity idle. Separate explanations for large gaps or implausible numbers with profiling or focused experiments, because a hotspot alone does not prove a cause. Label hypotheses, estimates, and bounds.

Read [measurement and evidence](references/MEASUREMENT.md) before running or changing benchmarks, or when auditing measurement validity. For a source-only review, load it only when a measurement question needs it.

## Retain changes and report

Retain changes with a plausible mechanism and supporting evidence. Check tradeoffs (memory, startup, tail latency, complexity, larger inputs). Expand investigation only when it could change correctness, targets, the retained code, claim credibility, or the user's decision. Reuse valid evidence tied to the delivered code, and keep abandoned experiments separate.

Read [visual-explanation](../visual-explanation/SKILL.md) when installed. Answer first, then show a comparison table with absolute measurements, units, comparator, and observed or supplied status (or an inline HTML chart for trends and distributions). Limit surrounding prose to one or two sentences, and skip the table only when one number answers the question.

| Metric | Baseline | Candidate | Delta | Evidence |
| --- | --- | --- | --- | --- |
| p95 latency (example) | 142 ms | 68 ms | -52% | Observed (5 runs, `bench.py`) |
| Peak RSS (example) | 410 MB | 465 MB | +13% | Observed (same runs) |

State separately whether improvement is verified, targets are met, a comparator gap remains, and hardware headroom or caps are known, marking unsupported judgments unknown. Distinguish your measurements from supplied figures, estimates, and untested explanations. Microbenchmarks do not prove application-wide gains, and a baseline win does not prove optimality or production readiness. Report correctness evidence, delivered state, evidence locations, material variation or regressions, and limitations. When execution is unavailable, finish analysis or a requested harness and mark performance unverified.

## Related skills

Use one when its case comes up and it is installed.

- Picking a comparison table or inline HTML chart for measurements → [visual-explanation](../visual-explanation/SKILL.md)
- Proof that a retained change still behaves correctly → [verify-change](../verify-change/SKILL.md)
- The measurement shows work the code does not need → [simplify-change](../simplify-change/SKILL.md)
- Several possible causes of a slowdown → [issue-tree](../issue-tree/SKILL.md)
