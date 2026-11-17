// Runs pi-emphasis and the emphasis mod's parser on the same 50 recorded replies, reduces both to
// the same events per reply line, and prints every difference grouped by its cause.
// bun differential.ts <finals.jsonl> <pi-emphasis folder>
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse, type Span } from '../hooks/parse.ts'

const [finals, piFolder] = process.argv.slice(2)
if (finals === undefined || piFolder === undefined) throw new Error('usage: bun differential.ts <finals.jsonl> <pi-emphasis folder>')

type Pi = {
  createPalette: (theme: unknown) => unknown
  decorate: (markdown: string, palette: unknown) => string
}
const pi = (await import(join(piFolder, 'index.ts'))) as Pi

// A theme whose colors are readable tags, as in pi-emphasis's own tests.
const palette = pi.createPalette({
  fg: (color: string, text: string) => `<${color}>${text}</>`,
  getFgAnsi: (color: string) => `\x1b[38;fg-${color}m`,
  getBgAnsi: (color: string) => `\x1b[48;bg-${color}m`,
})

const SAMPLE = 50
const CANDIDATE = /\*\*[^*\n]+\*\*|\[\[[^\]\n]{1,32}\]\]|[✓✔✗✘→]|[├└]──|^(?:Outstanding|You do):/gm
const FENCED = /^ {0,3}(```|~~~)[^\n]*\n[\s\S]*?(^ {0,3}\1[^\n]*$|(?![\s\S]))/gm
const PI_TONES: Record<string, string> = {
  'bg-toolSuccessBg': 'success', 'bg-toolErrorBg': 'error', 'bg-searchMatchBg': 'warning', 'bg-selectedBg': 'neutral',
  '[31m': 'danger', '[36m': 'mode', '[34m': 'owner',
}
const PI_MARKS = new Set(['success', 'error', 'accent'])
const PRIVATE_USE = /[\ue000-\uf8ff]/

const replies = readFileSync(finals, 'utf8').trim().split('\n').map(line => (JSON.parse(line) as { text: string }).text)
const sample = replies
  .map((text, index) => ({ text, index, candidates: text.replace(FENCED, '').match(CANDIDATE)?.length ?? 0 }))
  .sort((a, b) => b.candidates - a.candidates || a.index - b.index)
  .slice(0, SAMPLE)

const show = (text: string) => JSON.stringify(text).replace(/[\ue000-\uf8ff]/g, c => `\\u${c.charCodeAt(0).toString(16)}`)
const boldText = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/`+[^`]*`+/g, '')
    .replace(/\\([!-/:-@[-`{-~])/g, '$1')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** pi's events for one decorated line: pills by tone and text, icons, colored bold runs, marks, tree connectors. */
function piEvents(line: string): string[] {
  const events: string[] = []
  const rest = line.replace(/((?:\x1b\[[^m]*m)+)\x1b\[1m(.*?)\x1b\[22;27m\x1b\[39m\x1b\[49m/g, (_, escapes: string, text: string) => {
    const tone = Object.entries(PI_TONES).find(([key]) => escapes.includes(key))?.[1] ?? 'unknown'
    events.push(`pill ${tone} ${show(text.replace(/\u00a0/g, ' ').trim())}`)
    return ''
  })
  const plain = rest.replace(/\x1b\[[^m]*m/g, '').replace(/[\ue0b4\ue0b6]/g, '')
  const stack: string[] = []
  let bold = ''
  const flush = () => {
    const icon = bold.match(/^\s*([\ue000-\uf8ff])\s*/)
    if (icon) events.push(`icon ${show(icon[1]!)}`)
    const text = boldText(icon ? bold.slice(icon[0].length) : bold)
    if (text !== '') events.push(`bold ${show(text)}`)
    bold = ''
  }
  for (const token of plain.split(/(<\/?[A-Za-z]*>)/)) {
    if (token === '</>') {
      if (stack.at(-1) === 'mdLink') flush()
      stack.pop()
    } else if (/^<[A-Za-z]+>$/.test(token)) {
      // pi opens the bold color again after code and marks without closing it first.
      if (token === '<mdLink>' && stack.at(-1) === 'mdLink') continue
      if (stack.at(-1) === 'mdLink') flush()
      stack.push(token.slice(1, -1))
    } else if (stack.at(-1) === 'mdLink') {
      bold += token
    } else if (PI_MARKS.has(stack.at(-1) ?? '')) {
      events.push(`mark ${token}`)
    } else if (stack.at(-1) === 'dim') {
      events.push(`tree ${token}`)
    } else {
      for (const icon of token.match(new RegExp(PRIVATE_USE.source, 'g')) ?? []) events.push(`icon ${show(icon)}`)
    }
  }
  if (bold !== '') flush()
  return events
}

/** The mod's events for one drawn row, read the same way. */
function modEvents(spans: readonly Span[]): string[] {
  const events: string[] = []
  let bold = ''
  const flush = () => {
    const text = boldText(bold)
    if (text !== '') events.push(`bold ${show(text)}`)
    bold = ''
  }
  for (const span of spans) {
    if (span.kind === 'text' && span.bold) {
      bold += span.text
      continue
    }
    if (span.kind === 'code' || span.kind === 'link') continue
    if (span.kind === 'pill') {
      events.push(`pill ${span.tone} ${show(span.icon === undefined ? span.text : `${span.icon} ${span.text}`)}`)
      continue
    }
    flush()
    if (span.kind === 'icon') events.push(`icon ${show(span.text)}`)
    if (span.kind === 'mark') events.push(`mark ${span.text}`)
    if (span.kind === 'tree') events.push(`tree ${span.text}`)
  }
  flush()
  return events
}

type Difference = { reply: number; at: number; side: 'pi only' | 'mod only'; event: string; source: string }

function causeOf(d: Difference, drawnByMod: boolean): string {
  const line = d.source
  if (/^\s*\|/.test(line)) return 'inside a table, which the engine draws'
  if (/^\s*>/.test(line)) return 'inside a blockquote, which the engine draws'
  if (d.side === 'mod only' && /^(?:[-*+] |\d+\. )?(?:Outstanding|You do):/i.test(line.trim())) return 'the plain labels Outstanding: and You do:'
  if (/bold/.test(d.event) && (line.replace(/`+[^`]*`+/g, '').replace(/\\\*/g, '').match(/\*\*/g)?.length ?? 0) % 2 === 1) return 'a bold span that crosses a line end, which pi cuts there'
  if (!drawnByMod && /^\s*(?:[-*+]|\d+[.)])\s/.test(line)) return 'a list the engine draws, because an item holds a fence, table, quote, task box or second paragraph'
  if (!drawnByMod) return 'another block the engine draws'
  return 'UNEXPLAINED'
}

const differences: Difference[] = []
let piCount = 0
let modCount = 0
for (const { text, index } of sample) {
  const sourceLines = text.split('\n')
  const piLines = pi.decorate(text, palette).split('\n')
  const mine = new Map<number, string[]>()
  for (const block of parse(text)) {
    if (block.kind !== 'lines') continue
    for (const line of block.lines) mine.set(line.at, [...(mine.get(line.at) ?? []), ...modEvents(line.spans)])
  }
  sourceLines.forEach((source, at) => {
    const theirs = piEvents(piLines[at] ?? '')
    const ours = mine.get(at) ?? []
    piCount += theirs.length
    modCount += ours.length
    const left = [...ours]
    for (const event of theirs) {
      const match = left.indexOf(event)
      if (match === -1) differences.push({ reply: index, at, side: 'pi only', event, source })
      else left.splice(match, 1)
    }
    for (const event of left) differences.push({ reply: index, at, side: 'mod only', event, source })
  })
  for (const d of differences) if (d.reply === index) (d as Difference & { drawn?: boolean }).drawn = mine.has(d.at)
}

const causes = new Map<string, (Difference & { drawn?: boolean })[]>()
for (const d of differences as (Difference & { drawn?: boolean })[]) {
  const cause = causeOf(d, d.drawn === true)
  causes.set(cause, [...(causes.get(cause) ?? []), d])
}

console.log(`${sample.length} replies with the most emphasis candidates, ${piCount} pi events, ${modCount} mod events\n`)
for (const [cause, list] of [...causes].sort((a, b) => b[1].length - a[1].length)) {
  const sides = ['pi only', 'mod only'].map(side => `${list.filter(d => d.side === side).length} ${side}`).join(', ')
  const example = list[0]!
  console.log(`${String(list.length).padStart(4)}  ${cause} (${sides})`)
  console.log(`      reply ${example.reply} line ${example.at + 1}, ${example.side}: ${example.event}`)
  console.log(`      ${example.source.slice(0, 150)}`)
}
const unexplained = causes.get('UNEXPLAINED')?.length ?? 0
console.log(`\n${differences.length} differences in all, ${unexplained} unexplained`)
process.exit(unexplained === 0 ? 0 : 1)
