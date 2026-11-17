// Counts what each recorded final reply handed to the user, and what the gate would have stopped.
import { readFileSync } from 'node:fs'
import { classify, objection } from '../hooks/classify.ts'

const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(line => JSON.parse(line) as { text: string; ts: string })
const since = process.argv[3] ?? ''
const counts = new Map<string, { n: number; stopped: number; examples: string[] }>()

for (const row of rows) {
  if (row.ts < since) continue

  const { kind, line } = classify(row.text)
  const entry = counts.get(kind) ?? { n: 0, stopped: 0, examples: [] }

  entry.n += 1
  entry.stopped += objection(row.text) === undefined ? 0 : 1
  if (entry.examples.length < 2 && !entry.examples.includes(line)) entry.examples.push(line)
  counts.set(kind, entry)
}

const total = [...counts.values()].reduce((sum, entry) => sum + entry.n, 0)
const handed = total - (counts.get('none')?.n ?? 0)
const stopped = [...counts.values()].reduce((sum, entry) => sum + entry.stopped, 0)

console.log(`${total} final replies${since ? ` since ${since}` : ''}, ${handed} hand the user a step, the gate stops ${stopped}`)
for (const [kind, entry] of [...counts].sort((a, b) => b[1].n - a[1].n)) {
  if (kind === 'none') continue
  console.log(`\n${kind.padEnd(11)} ${String(entry.n).padStart(4)}   ${entry.stopped > 0 ? 'stopped' : 'let through'}`)
  for (const example of entry.examples) console.log(`    ${example.slice(0, 150)}`)
}
