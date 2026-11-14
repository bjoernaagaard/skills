# Measurement and evidence

Use this reference for benchmarks, benchmark changes, or reviews of measurement
validity. Apply the sections relevant to the claimed operation and its risks.

## Equivalent work and correctness

Choose representative workloads and scales that could expose weaknesses.
Compare equivalent required behavior under comparable resource constraints;
configurations need not be identical. Disclose consequential differences.

Validate correctness separately from timing with existing checks and targeted
cases for actual risks. Remove redundant work only while preserving required
guarantees. For authorized quality or behavior tradeoffs, evaluate both benefit
and loss. Synthetic workloads and mocks establish results only for those
conditions.

Verify that the harness executes and completes the intended operation. Consume
outputs or observe effects, prevent unintended compiler elimination, and account
for deferred or asynchronous work. Restore or evolve trial state to match the
workload. Reuse and specialization must follow actual requirements rather than
knowledge of benchmark fixtures.

## Verify actual loaded code

Before comparative timing, verify from inside each measurement process,
including workers and subprocesses, that the loaded implementation matches the
intended baseline or candidate. Record resolved module or executable paths and
source or binary hashes, or equivalent verifiable artifact identity, against the
preserved code state.

Directory names, revision labels, package versions, and requested import paths
alone are insufficient. Editable installs, import hooks, caches, and stale builds
can load different code. Check outside the timed region and repeat when code or
the launch environment changes.

If identity mismatches, mark affected observations invalid and preserve them.
Correct loading or build isolation and rerun the affected comparisons before
claiming a result. Disclose when identity cannot be established.

## Measure the claimed boundary

Keep timing boundaries comparable. Include setup, I/O, compilation, garbage
collection, cache effects, synchronization, and deferred costs when they belong
to the claimed operation. State exclusions and reasons. Distinguish cold start
from steady state where relevant. Separate profiling from representative timing
when instrumentation changes the result.

Use repetitions and variation summaries suited to the decision and budget.
Address relevant run-order effects, shared load, and environmental drift;
interleave comparable runs where useful. Distinguish loop iterations from
independent runs.

After exploratory selection, confirm gains with fresh baseline and candidate
measurements when noise or selection could change the decision. Use additional
representative inputs when the claim requires broader evidence. Do not select
favorable runs or conceal regressions. Keep excluded observations and reasons.
After harness corrections, rerun affected comparisons consistently. Reuse
successful evidence that later changes do not invalidate.

## Preserve useful evidence

Use existing tools and evidence conventions. When none exist, keep one clearly
named evidence directory in an authorized workspace. Preserve the commands,
code identities or patches, input definitions or seeds, relevant environment
and build settings, timing boundaries, and raw observations supporting the claim.

Keep a compact record of material hypotheses, results, and decisions, including
failed experiments. Retain profiler artifacts only when they support a finding
or reproduction. Do not create a second narrative report unless requested.

Keep secrets and private inputs out of shared artifacts. Record authorized
input access or generation instructions and resulting reproduction limits.
Report spending only when relevant and supported. Tie candidate measurements
to the delivered code, including local changes.
