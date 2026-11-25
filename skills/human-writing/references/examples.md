# Before and after for each rule

Every value below is made up.

## Words

| Rule | Before | After |
| --- | --- | --- |
| Everyday words | We leverage a robust queue to streamline uploads. | We use a queue, so a failed upload is tried again. |
| One name for each thing | Upload the invoice. The file is checked, and the record is stored. | Upload the invoice. The invoice is checked and stored. |
| No private shorthand | The fast path skips the DQ gate. | A file under 1 MB skips the data quality check. |
| No words that only add force | Caching is really crucial here. | Without the cache, each page load runs 14 queries. |
| Literal | The index is the map the planner steers by. | The index lists each table with its row count, and the planner reads it to pick a join order. |
| The direct verb | The service serves as the hub, and we made a decision to keep it. | The service routes each request, and we decided to keep it. |

## Sentences

| Rule | Before | After |
| --- | --- | --- |
| Complete | Faster builds. Fewer failures. | The build takes 4 minutes where it took 11, and it failed twice in the last 100 runs. |
| Explained, not punchy | The check runs nightly. It finds drift. Nobody ignores it. | The check runs each night and reports any setting that differs from the file in Git, and the team fixes each report the next morning. |
| A named subject | This adds a retry. That fixed the timeout. | The patch adds a retry. The retry fixed the timeout. |
| The real actor | The report gets generated and the numbers become visible. | The job writes the report at 06:00, and you can read the numbers in the dashboard. |
| Point first | The parser skips unchanged files. The cache keeps the last result. Most builds are fast. | Most builds are fast. The parser skips unchanged files, and the cache keeps the last result. |
| Steps in order | After you restart the worker, which needs the new key that you get from the vault, the queue drains. | First, read the new key from the vault. Second, restart the worker with the key. The queue then drains. |
| The specific fact | The tool greatly improves review speed. | The tool cut the median review from 30 minutes to 8. |
| A named source | Studies show that small pull requests merge faster. | In our last 40 pull requests, those under 200 lines merged in half the time. |

## Punctuation and format

| Rule | Before | After |
| --- | --- | --- |
| Plain marks | The build is fast — 10–20 seconds; input → output. | The build is fast. It takes 10 to 20 seconds to turn the input into the output. |
| A colon | Check the header: the limit resets hourly. | Check the header. The limit resets each hour. |
| Plain format | ## How To Install The **Tool** | ## How to install the tool |
| Short lists | A list of nine changes in a row | Two groups, "Shipped" and "Still open", with three items each |

## A document that describes how things are now

Before, with a log in it:

```markdown
## Settings

UPDATE 12 November: we added `round_to`. Previously the tool was called
timecalc and only had `separator`. We tried argparse first and went back.

- separator: the text between hours and minutes
- NEW: round_to rounds the minutes
```

After, edited in place:

```markdown
## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| `separator` | `":"` | Sets the text between hours and minutes. |
| `round_to` | `1` | Rounds the minutes to the nearest multiple of the value. |
```
