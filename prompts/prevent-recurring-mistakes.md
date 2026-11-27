Use the bmode skill on this repository. Read the Git history, past bug fixes, and
available review comments. Start with the best-evidenced recurring mistake.
Name two occurrences and the constraint both violated.

Make that mistake impossible instead of documenting it. Try the design first,
then types, then a lint rule whose error names the fix, then a permitted
behavioral check. Choose the first option that actually prevents or catches
the mistake. Remove comments that repeat the code. Encode the constraint
behind a comment that matters in the same order, show where it is now
enforced, and then remove the comment.

For a bug involving concurrency, retries, or state transitions, build a
formal model when it can replay a documented failure. Show the failing
trace, fix the model, and run the check in CI. Also exercise the real
implementation through its public entry point.

Keep every test that protects security or legal behavior. Replace a test
that pins an implementation detail only after a permitted check catches
the same historical failure. For database behavior, use the real database
through the application’s end-to-end flow. Follow the project’s test rules.

Deliver one independently verifiable change at a time. For each new check,
show it failing on the historical mistake and passing after the fix. Follow
the repository’s shipping policy. Where it uses pull requests or merge
requests, submit one per step when authorized. Continue with the next
evidenced mistake until each is addressed or has a specific blocker.
