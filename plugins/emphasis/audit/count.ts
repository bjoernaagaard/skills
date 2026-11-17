// Counts, in the owner's final replies, the pill words, labels and marks the emphasis mod draws,
// and checks which words the reply rules teach against the rule: 10 replies or more, or a word for
// a step only the owner can take. A synonym is never taught, because it displays as another word.
import { readFileSync } from 'node:fs'
import { LINE_LABELS, MARKS, OWNER_WORDS, SYNONYMS, TONES, TREE, type Tone } from '../hooks/vocabulary.ts'

const TAUGHT_FROM = 10

const replies = readFileSync(process.argv[2], 'utf8')
  .trim()
  .split('\n')
  .map(line => (JSON.parse(line) as { text: string }).text.replace(/^ {0,3}(```|~~~)[^\n]*\n[\s\S]*?(^ {0,3}\1[^\n]*$|(?![\s\S]))/gm, ''))

const share = (test: (text: string) => boolean) => replies.filter(test).length
const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')

function top(pattern: RegExp, limit: number): string {
  const counts = new Map<string, number>()
  for (const text of replies) {
    for (const label of new Set([...text.matchAll(pattern)].map(m => m[1]!.trim()))) counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([label, n]) => `${label} ${n}`).join(', ')
}

console.log(`${replies.length} final replies, code fences left out\n`)

const rows = Object.entries(TONES).flatMap(([tone, entry]) =>
  [...entry.core.map(word => ({ word, tone: tone as Tone, core: true })), ...entry.also.map(word => ({ word, tone: tone as Tone, core: false }))],
)
const counted = rows
  .map(row => ({ ...row, n: share(text => new RegExp(`\\b${escape(row.word)}\\b`, 'i').test(text)) }))
  .sort((a, b) => b.n - a.n)
const byRule = (row: (typeof counted)[number]) =>
  SYNONYMS[row.word.toLowerCase()] === undefined && (row.n >= TAUGHT_FROM || OWNER_WORDS.includes(row.word))

console.log('Pill words, replies that use each')
console.log(counted.map(row => `  ${row.word.padEnd(14)} ${row.tone.padEnd(8)} ${String(row.n).padStart(4)}  ${row.core ? 'core' : 'also'}`).join('\n'))

const disagree = counted.filter(row => byRule(row) !== row.core)
console.log(`\nThe rule teaches a word used in ${TAUGHT_FROM} replies or more, and ${OWNER_WORDS.join(', ')}, but never a synonym`)
console.log(`  core by the rule: ${counted.filter(byRule).map(row => row.word).join(', ')}`)
console.log(`  also by the rule: ${counted.filter(row => !byRule(row)).map(row => row.word).join(', ')}`)
console.log(`  table disagrees:  ${disagree.length === 0 ? 'none' : disagree.map(row => `${row.word} (${row.core ? 'core' : 'also'} in the table)`).join(', ')}`)

console.log('\nLabels and marks, replies that use each')
console.log(`  plain line labels   ${top(/^(?:[-*+] |\d+\. )?([A-Z][A-Za-z]*(?: [a-z]+)?):(?:\s|$)/gm, 12)}`)
console.log(`  bold lead labels    ${top(/^\s*(?:[-*+] |\d+\. )?\*\*([^*`\n]{1,32}?)\*\*/gm, 12)}`)
console.log(`  headings            ${share(text => /^ {0,3}#{1,6}\s/m.test(text))} replies: ${top(/^ {0,3}#{1,6}\s+(.+)$/gm, 8)}`)
console.log(`  drawn line labels   ${Object.keys(LINE_LABELS).map(label => `${label} ${share(text => new RegExp(`^(?:[-*+] |\\d+\\. )?${escape(label)}:`, 'im').test(text))}`).join(', ')}`)
console.log(`  marks               ${[...Object.keys(MARKS), ...TREE].map(mark => `${mark} ${share(text => text.includes(mark))}`).join(', ')}`)
console.log(`  bold                ${share(text => /\*\*[^*\n]+\*\*/.test(text))} replies`)
console.log(`  tables              ${share(text => /^\s*\|.*\|\s*$\n^\s*\|?\s*:?-{3,}/m.test(text))} replies`)

// The emphasis skill teaches the same words on a machine where no mod can load.
const skill = readFileSync(new URL('../../../skills/emphasis/SKILL.md', import.meta.url), 'utf8')
const skillWords = new Set(skill.slice(skill.indexOf('## The words'), skill.indexOf('## Where a badge goes')).split('\n').filter(line => line.startsWith('| ') && !line.startsWith('| Meaning')).flatMap(line => line.split('|')[2]!.split(',').map(word => word.trim())))
const taught = new Set(Object.values(TONES).flatMap(tone => tone.core))
const skillOnly = [...skillWords].filter(word => !taught.has(word))
const modOnly = [...taught].filter(word => !skillWords.has(word))
console.log(`\nThe emphasis skill and the mod teach ${skillOnly.length + modOnly.length === 0 ? `the same ${taught.size} words` : `different words: skill only ${skillOnly.join(', ') || 'none'}, mod only ${modOnly.join(', ') || 'none'}`}`)

process.exit(disagree.length + skillOnly.length + modOnly.length === 0 ? 0 : 1)
