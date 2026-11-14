# Tests and debugging: prove the change against the real system

Preserve the project test framework and the project layout for tests. Investigate
the behavior a user can observe before you change the implementation, a
dependency, or an expected result. Separate a regression from an environment
problem and from a request the code never promised to support.

## Choose the authorized verification

Run the real app or command to verify a change. Write a new end to end test only
when the user requests one. Never write unit tests, integration tests, or tests
that use mocks. The guidance below applies to authorized end to end tests and
existing tests.

Read the relevant caller, public promise, and nearest existing tests. When a new
end to end test is requested, run the case before the fix to confirm the failure,
then run the same case after the fix.

Take the expected value from outside the code you are checking. Use the real
source the code will read in normal use, or use a contract that a published
guide or a caller states. Do not take the expected value from a run of the
candidate code, and do not change an expected result only to make a candidate
fix pass. An import error in the test setup is not proof of the bug you set out
to cover.

Exercise the real public boundary. A live-service integration calls that
service; a local command runs with real input files and processes. A library
uses a real consumer of its public API with values from the caller or a
published contract. Do not add unrelated network, filesystem, or process work
just to give a test an end to end label.

Use authorized read-only public services when they are the real source. Keep
existing authorization boundaries for production writes, secrets, and other
external state changes.

## Use real resources and real data

Use real disposable resources for the state the case needs. Use a temporary
directory with real files for file behavior, and use a real database instance
that the test can discard for database behavior. Let a fixture create and clean
up that real resource, and restore shared state even when a check raises.

Do not use a mock, a patched name, a monkeypatched value, a fake, a replayed
response, or invented input data as a substitute for the proof above. Those
stand ins can pass while the real integration fails, so they do not show that
the change works. Do not add an isolated case for input that no real source
sends, and do not add generated cases across an input space the real source
never produces. Check a bad argument at the place where the code receives it,
with the error the code promises to raise, and write no test for data that no
real source can send.

| Risk | Evidence to choose |
| --- | --- |
| Ordinary transformation | A case that runs the public path with data from the real source and an expected value stated outside the code |
| Parser or validation | Real malformed data from the source when the source sends it, and the precise error the boundary promises |
| One pass or lazy input | The real iterator from the source, checked before the code reads it in full |
| Filesystem or database | A disposable real directory or a disposable real database instance |
| Async or concurrent work | The real workers and the real service, with worker failures and cancellation cleanup visible in the result |
| Public API or installed package | A real consumer and an installed copy of the package outside the checkout |
| Numerical code | Real data with units, tolerance, and a finite or missing value policy taken from the source contract |

## Read the result with care

Collect the tests before you call a run complete. Check the exit status, the
tests that ran, any skips, and the scope you selected, because a run that
collects no tests proves nothing. Coverage shows which paths ran, and it does
not show that the expected values meant anything. A test that catches one
seeded fault shows detection of that fault only.

Keep the artifact the run produced, such as a report file, a saved response, or
a log that a reader can inspect and repeat. Run the affected cases first, then
run the broader checks the project requires. Do not repeat a full run when
neither the code nor a relevant condition changed. Report end to end results,
static check results, packaging results, and performance results as separate
kinds of evidence.

For a flaky case, find the state or ordering that changes the result. Do not
repair a flaky case by adding a longer sleep, by retrying until the run turns
green, or by hiding a worker failure. Make sure a failure in a worker reaches
the test that started the worker.

Sources: [pytest good practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html),
[fixture cleanup](https://docs.pytest.org/en/stable/how-to/fixtures.html).
