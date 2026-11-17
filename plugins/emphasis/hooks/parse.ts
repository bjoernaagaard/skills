// Turns a reply's Markdown into blocks: the ones that hold emphasis as lines of spans to draw,
// everything else as Markdown the engine draws itself. Pure, so the audit scripts run it with bun.
import { ACTION_ICONS, LABEL_ICONS, LINE_LABELS, MARKS, MAX_PILL, PILL_ICONS, SYNONYMS, TONES, TREE, type Tone } from './vocabulary'

export type Span =
  | { kind: 'text'; text: string; bold?: true; italic?: true; strike?: true }
  | { kind: 'code'; text: string; bold?: true; italic?: true; strike?: true }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'pill'; text: string; tone: Tone; icon?: string }
  | { kind: 'mark'; text: string }
  | { kind: 'tree'; text: string }
  | { kind: 'icon'; text: string; bold?: true }

/** One drawn row of a block: `at` is its line in the reply, `prefix` the indent and marker drawn before it. */
export type Line = { at: number; prefix: string; spans: Span[] }

export type LinesStyle = 'paragraph' | 'heading' | 'title'

/** `gap` is one blank row before the block, as the engine draws between blocks. */
export type Block =
  | { kind: 'markdown'; text: string; gap: boolean }
  | { kind: 'lines'; style: LinesStyle; lines: Line[]; gap: boolean }

type ChunkKind = 'fence' | 'table' | 'heading' | 'paragraph' | 'list' | 'quote' | 'other'
type Chunk = { kind: ChunkKind; start: number; end: number; gap: boolean }

const BLANK = /^\s*$/
const FENCE = /^ {0,3}(`{3,}|~{3,})/
const HEADING = /^ {0,3}(#{1,6})(?=\s|$)\s*(.*?)(?:\s+#+)?\s*$/
const QUOTE = /^ {0,3}>/
const ITEM = /^( *)([-*+]|\d{1,9}[.)])(?: +(.*))?$/
const INTERRUPTING_ITEM = /^ {0,3}(?:[-*+]|1[.)]) +\S/
const RULE = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/
const SETEXT = /^ {0,3}(?:=+|-+)[ \t]*$/
const INDENTED = /^(?: {4}|\t)/
const HTML = /^ {0,3}<(?:[a-zA-Z][\w-]*[\s/>]|[a-zA-Z][\w-]*$|\/[a-zA-Z]|!--)/
const TABLE_DELIMITER = /^ {0,3}\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/
const OWN_ICON = /^\s*([\ue000-\uf8ff]|[\u{f0000}-\u{ffffd}])\s*/u
const PILL = new RegExp(`^\\[\\[([^\\[\\]\\n]{1,${MAX_PILL}})\\]\\]`)
const LINK = /^\[((?:\\.|[^\]\\\n])*)\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/
const AUTOLINK = /^<(https?:\/\/[^\s>]+)>/
const PUNCTUATION = /[!-/:-@[-`{-~]/
const LINE_LABEL = new RegExp(`^(${Object.keys(LINE_LABELS).join('|')}):`, 'i')

const isTableStart = (lines: readonly string[], i: number) =>
  (lines[i] ?? '').includes('|') && TABLE_DELIMITER.test(lines[i + 1] ?? '') && (lines[i + 1] ?? '').includes('|')

const startsBlock = (lines: readonly string[], i: number) => {
  const line = lines[i] ?? ''
  return FENCE.test(line) || HEADING.test(line) || QUOTE.test(line) || RULE.test(line) || HTML.test(line) || INTERRUPTING_ITEM.test(line) || isTableStart(lines, i)
}

// What ends a list without a blank line. The engine draws a table right after an item inside that item,
// so such a line stays with the list, and the list then goes to the engine whole.
const endsList = (line: string) => FENCE.test(line) || HEADING.test(line) || HTML.test(line) || RULE.test(line)

/** Splits the reply into its top-level Markdown blocks, the way the engine's lexer reads them. */
function chunk(lines: readonly string[]): Chunk[] {
  const chunks: Chunk[] = []
  let i = 0
  let blankBefore = false

  const push = (kind: ChunkKind, start: number, end: number) => {
    const previous = chunks.at(-1)
    // The engine draws a blank row after a heading and around a table even where the reply has none.
    const gap = previous !== undefined && (blankBefore || previous.kind === 'heading' || previous.kind === 'table' || kind === 'table')
    chunks.push({ kind, start, end, gap })
    blankBefore = false
    i = end
  }
  const indentOf = (line: string) => /^ */.exec(line)![0].length

  while (i < lines.length) {
    const line = lines[i]!
    const start = i

    if (BLANK.test(line)) {
      blankBefore = chunks.length > 0
      i += 1
      continue
    }

    const fence = FENCE.exec(line)
    if (fence) {
      const close = new RegExp(`^ {0,3}${fence[1]![0] === '`' ? '`' : '~'}{${fence[1]!.length},}\\s*$`)
      let end = i + 1
      while (end < lines.length && !close.test(lines[end]!)) end += 1
      push('fence', start, Math.min(end + 1, lines.length))
    } else if (HEADING.test(line)) {
      push('heading', start, i + 1)
    } else if (isTableStart(lines, i)) {
      let end = i + 2
      while (end < lines.length && !BLANK.test(lines[end]!) && !startsBlock(lines, end)) end += 1
      push('table', start, end)
    } else if (QUOTE.test(line)) {
      let end = i + 1
      while (end < lines.length && !BLANK.test(lines[end]!) && (QUOTE.test(lines[end]!) || !startsBlock(lines, end))) end += 1
      push('quote', start, end)
    } else if (ITEM.test(line) && !RULE.test(line) && indentOf(line) < 4) {
      let end = i + 1
      while (end < lines.length) {
        const next = lines[end]!
        if (BLANK.test(next)) {
          let after = end
          while (after < lines.length && BLANK.test(lines[after]!)) after += 1
          const resumes = after < lines.length && ((ITEM.test(lines[after]!) && !RULE.test(lines[after]!)) || indentOf(lines[after]!) >= 2)
          if (!resumes) break
          end = after
        } else if (ITEM.test(next) || indentOf(next) >= 2 || !endsList(next)) {
          end += 1
        } else {
          break
        }
      }
      push('list', start, end)
    } else if (RULE.test(line) || INDENTED.test(line) || HTML.test(line)) {
      let end = i + 1
      if (!RULE.test(line)) while (end < lines.length && !BLANK.test(lines[end]!)) end += 1
      push('other', start, end)
    } else {
      let end = i + 1
      let kind: ChunkKind = 'paragraph'
      while (end < lines.length && !BLANK.test(lines[end]!)) {
        if (SETEXT.test(lines[end]!)) {
          kind = 'other'
          end += 1
          break
        }
        if (startsBlock(lines, end)) break
        end += 1
      }
      push(kind, start, end)
    }
  }
  return chunks
}

type Style = { bold?: true; italic?: true; strike?: true }
type Mode = 'prose' | 'heading'

const DELIMITERS = ['**', '__', '~~', '*', '_'] as const
type Delimiter = (typeof DELIMITERS)[number]
const STYLE_OF: Record<Delimiter, keyof Style> = { '**': 'bold', __: 'bold', '~~': 'strike', '*': 'italic', _: 'italic' }

const isSpace = (char: string | undefined) => char === undefined || /\s/.test(char)
const isWordChar = (char: string | undefined) => char !== undefined && /[\p{L}\p{N}]/u.test(char)

function canOpen(src: string, i: number, d: Delimiter) {
  if (isSpace(src[i + d.length])) return false
  return d[0] !== '_' || !isWordChar(src[i - 1])
}

function canClose(src: string, j: number, d: Delimiter) {
  if (isSpace(src[j - 1])) return false
  return d[0] !== '_' || !isWordChar(src[j + d.length])
}

/** The end of the code span opening at `i`, or -1 when its backticks never close. */
function codeEnd(src: string, i: number): number {
  const run = /^`+/.exec(src.slice(i))![0]
  let j = i + run.length
  while (j < src.length) {
    const next = src.indexOf(run, j)
    if (next === -1) return -1
    const after = next + run.length
    if (src[next - 1] !== '`' && src[after] !== '`') return after
    j = after
    while (src[j] === '`') j += 1
  }
  return -1
}

function findCloser(src: string, from: number, d: Delimiter): number {
  let j = from
  while (j < src.length) {
    const char = src[j]!
    if (char === '\\') {
      j += 2
      continue
    }
    if (char === '`') {
      const end = codeEnd(src, j)
      j = end === -1 ? j + 1 : end
      continue
    }
    if (src.startsWith(d, j)) {
      const single = d.length === 1
      const doubled = single && (src[j + 1] === d || src[j - 1] === d)
      if (!doubled && j > from && canClose(src, j, d)) return j
      if (single && src[j + 1] === d) {
        j += 2
        continue
      }
    }
    j += 1
  }
  return -1
}

function plainText(spans: readonly Span[]): string {
  return spans.map(span => span.text).join('')
}

const lowerKeys = new Map<string, Tone>()
for (const [tone, entry] of Object.entries(TONES) as [Tone, (typeof TONES)[Tone]][]) {
  for (const word of [...entry.core, ...entry.also]) if (!lowerKeys.has(word.toLowerCase())) lowerKeys.set(word.toLowerCase(), tone)
}
const KNOWN = [...new Set([...lowerKeys.keys(), ...Object.keys(PILL_ICONS), ...Object.keys(SYNONYMS)])].sort((a, b) => b.length - a.length)

/** A pill label read as its word: a known word may carry detail, and a synonym displays as its canonical word. */
export function pillOf(label: string): Extract<Span, { kind: 'pill' }> {
  const own = OWN_ICON.exec(label)
  const text = (own ? label.slice(own[0].length) : label).replace(/\s+/g, ' ').trim()
  const lower = text.toLowerCase()
  const known = KNOWN.find(k => lower === k || (lower.startsWith(k) && /[ :]/.test(lower[k.length] ?? '')))
  const canonical = known === undefined ? undefined : SYNONYMS[known]
  const key = (canonical ?? known ?? lower).toLowerCase()
  const word = canonical !== undefined && known !== undefined ? canonical + text.slice(known.length) : text
  const icon = own?.[1] ?? PILL_ICONS[key]
  return { kind: 'pill', text: word || label.trim(), tone: lowerKeys.get(key) ?? 'neutral', ...(icon === undefined ? {} : { icon }) }
}

/** Inline Markdown to spans. Text spans may hold newlines, which `toLines` turns into rows. */
function inline(src: string, mode: Mode, style: Style = {}): Span[] {
  const out: Span[] = []
  let text = ''
  const flush = () => {
    if (text !== '') out.push({ kind: 'text', text, ...style })
    text = ''
  }
  let i = 0
  while (i < src.length) {
    const char = src[i]!
    const rest = src.slice(i)

    if (char === '\\' && src[i + 1] === '\n') {
      text += '\n'
      i += 2
      continue
    }
    if (char === '\\' && PUNCTUATION.test(src[i + 1] ?? '')) {
      text += src[i + 1]
      i += 2
      continue
    }
    if (char === '`') {
      const end = codeEnd(src, i)
      const run = /^`+/.exec(rest)![0]
      if (end === -1) {
        text += run
        i += run.length
        continue
      }
      flush()
      let code = src.slice(i + run.length, end - run.length).replace(/\n/g, ' ')
      if (code.length > 1 && code.startsWith(' ') && code.endsWith(' ') && code.trim() !== '') code = code.slice(1, -1)
      out.push({ kind: 'code', text: code, ...style })
      i = end
      continue
    }
    if (mode === 'prose' && char === '[') {
      const pill = PILL.exec(rest)
      if (pill && pill[1]!.trim() !== '') {
        flush()
        out.push(pillOf(pill[1]!))
        i += pill[0].length
        continue
      }
    }
    if (char === '[') {
      const link = LINK.exec(rest)
      if (link) {
        flush()
        out.push({ kind: 'link', text: plainText(inline(link[1]!, 'heading')), href: link[2]! })
        i += link[0].length
        continue
      }
    }
    if (char === '<') {
      const auto = AUTOLINK.exec(rest)
      if (auto) {
        flush()
        out.push({ kind: 'link', text: auto[1]!, href: auto[1]! })
        i += auto[0].length
        continue
      }
    }
    const d = DELIMITERS.find(candidate => src.startsWith(candidate, i))
    if (d !== undefined) {
      const close = canOpen(src, i, d) ? findCloser(src, i + d.length, d) : -1
      if (close !== -1) {
        flush()
        out.push(...inline(src.slice(i + d.length, close), mode, { ...style, [STYLE_OF[d]]: true }))
        i = close + d.length
        continue
      }
      text += d
      i += d.length
      continue
    }
    if (mode === 'prose') {
      if (MARKS[char] !== undefined) {
        flush()
        out.push({ kind: 'mark', text: char })
        i += 1
        continue
      }
      const tree = TREE.find(connector => src.startsWith(connector, i))
      if (tree !== undefined) {
        flush()
        out.push({ kind: 'tree', text: tree })
        i += tree.length
        continue
      }
    }
    text += char
    i += 1
  }
  flush()
  return out
}

/** Splits spans at their newlines into rows. */
function rows(spans: readonly Span[]): Span[][] {
  const result: Span[][] = [[]]
  for (const span of spans) {
    if (span.kind !== 'text' || !span.text.includes('\n')) {
      result.at(-1)!.push(span)
      continue
    }
    span.text.split('\n').forEach((piece, n) => {
      if (n > 0) result.push([])
      if (piece !== '') result.at(-1)!.push({ ...span, text: piece })
    })
  }
  return result
}

const labelWord = (label: string) => label.replace(/[:\s]+$/, '').trim().toLowerCase()

const isBold = (span: Span | undefined) => (span?.kind === 'text' || span?.kind === 'code') && span.bold === true

/** Icons for the labels of one row: a plain line label, a leading bold label, and bold action lead-ins. */
function labelled(row: readonly Span[]): Span[] {
  const first = row[0]
  const plain = first?.kind === 'text' && first.bold === undefined ? LINE_LABEL.exec(first.text) : null
  const spans: Span[] =
    plain && first?.kind === 'text'
      ? [{ kind: 'icon', text: LINE_LABELS[plain[1]!.toLowerCase()]!, bold: true }, { ...first, text: plain[0], bold: true }, ...(plain[0] === first.text ? [] : [{ ...first, text: first.text.slice(plain[0].length) }]), ...row.slice(1)]
      : [...row]
  const lead = plain ? -1 : spans.findIndex(span => span.kind !== 'tree' && !(span.kind === 'text' && span.bold === undefined && span.text.trim() === ''))
  return spans.flatMap((span, n): Span[] => {
    if (span.kind !== 'text' || !span.bold || isBold(spans[n - 1]) || spans[n - 1]?.kind === 'icon' || OWN_ICON.test(span.text)) return [span]
    // A label is a whole bold run of plain words, as pi reads it: one that holds code takes no icon.
    let end = n
    while (isBold(spans[end + 1])) end += 1
    const run = spans.slice(n, end + 1)
    if (run.some(part => part.kind === 'code')) return [span]
    const label = run.map(part => part.text).join('')
    const word = labelWord(label)
    const icon =
      n === lead && label.length <= MAX_PILL
        ? (LABEL_ICONS[word] ?? (label.trimEnd().endsWith(':') ? ACTION_ICONS[word] : undefined))
        : /^[A-Za-z]+:$/.test(label.trim()) ? ACTION_ICONS[word] : undefined
    return icon === undefined ? [span] : [{ kind: 'icon', text: icon, bold: true }, span]
  })
}

const ORDERED = /^\d/

function toLetters(n: number): string {
  let s = ''
  for (let k = n; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(97 + ((k - 1) % 26)) + s
  return s
}

function toRoman(n: number): string {
  const table: [number, string][] = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']]
  let s = ''
  let rest = n
  for (const [value, numeral] of table) while (rest >= value) (s += numeral), (rest -= value)
  return s
}

/** The marker the engine draws for an item: `-` for bullets, a number, letter or numeral by depth for ordered items. */
function markerFor(ordered: boolean, depth: number, number: number, first: number): string {
  if (!ordered) return '-'
  if (depth === 1 && first >= 1) return `${toLetters(number)}.`
  if (depth === 2 && first >= 1 && number <= 3999) return `${toRoman(number)}.`
  return `${number}.`
}

/** A list item: `blankBefore` when a blank row precedes it, which the engine keeps only between two lists. */
type Item = { depth: number; marker: string; blankBefore: boolean; lines: { at: number; text: string }[] }

/** The items of a list chunk, or undefined when it holds a construct only the engine draws. */
function items(lines: readonly string[], start: number, end: number): Item[] | undefined {
  type Open = { indent: number; content: number; ordered: boolean; first: number; next: number }
  const open: Open[] = []
  const result: Item[] = []
  let afterBlank = false
  for (let at = start; at < end; at += 1) {
    const line = lines[at]!
    if (BLANK.test(line)) {
      afterBlank = true
      continue
    }
    const item = RULE.test(line) ? null : ITEM.exec(line)
    const body = line.trim()
    if (FENCE.test(body) || QUOTE.test(body) || HEADING.test(body) || HTML.test(body) || body.startsWith('|')) return undefined
    if (item === null) {
      if (afterBlank || result.length === 0) return undefined
      result.at(-1)!.lines.push({ at, text: body })
      continue
    }
    const indent = item[1]!.length
    if (/^\[[ xX]\](\s|$)/.test(item[3] ?? '')) return undefined
    while (open.length > 0 && indent < open.at(-1)!.indent) open.pop()
    const ordered = ORDERED.test(item[2]!)
    const number = ordered ? Number.parseInt(item[2]!, 10) : 0
    const top = open.at(-1)
    const sibling = top !== undefined && indent < top.content && top.ordered === ordered
    if (top !== undefined && indent < top.content && !sibling) open.pop()
    if (top !== undefined && indent >= top.content + 4) return undefined
    const depth = sibling ? open.length - 1 : open.length
    const list = sibling ? top : { first: number, next: number }
    const spaces = /^ *\S+( *)/.exec(line)![1]!.length
    result.push({ depth, marker: markerFor(ordered, depth, list.next, list.first), blankBefore: afterBlank && depth === 0 && !sibling, lines: [{ at, text: item[3] ?? '' }] })
    open.length = depth
    open.push({ indent, content: indent + item[2]!.length + (spaces >= 1 && spaces <= 4 ? spaces : 1), ordered, first: list.first, next: list.next + 1 })
    afterBlank = false
  }
  return result
}

/** The rows a chunk draws as, or undefined when only the engine can draw it. */
function toLines(lines: readonly string[], chunk: Chunk): { style: LinesStyle; lines: Line[] } | undefined {
  if (chunk.kind === 'heading') {
    const [, hashes, title] = HEADING.exec(lines[chunk.start]!)!
    const spans = inline(title!, 'heading').map(span => (span.kind === 'text' && span.bold ? (({ bold: _bold, ...rest }) => rest)(span) : span))
    const icon = OWN_ICON.test(title!) ? undefined : LABEL_ICONS[labelWord(title!)]
    return { style: hashes!.length === 1 ? 'title' : 'heading', lines: [{ at: chunk.start, prefix: '', spans: icon === undefined ? spans : [{ kind: 'icon', text: icon }, ...spans] }] }
  }
  if (chunk.kind === 'paragraph') {
    const text = lines.slice(chunk.start, chunk.end).map((line, n) => (n === 0 ? line.replace(/^ {0,3}/, '') : line).replace(/\s+$/, '')).join('\n')
    return { style: 'paragraph', lines: rows(inline(text, 'prose')).map((spans, n) => ({ at: chunk.start + n, prefix: '', spans: labelled(spans) })) }
  }
  if (chunk.kind === 'list') {
    const listItems = items(lines, chunk.start, chunk.end)
    if (listItems === undefined) return undefined
    const drawn: Line[] = []
    let indents: number[] = []
    for (const item of listItems) {
      indents = indents.slice(0, item.depth)
      const indent = ' '.repeat(indents.reduce((sum, width) => sum + width, 0))
      const hanging = indent + ' '.repeat(item.marker.length + 1)
      indents.push(item.marker.length + 1)
      if (item.blankBefore) drawn.push({ at: item.lines[0]!.at - 1, prefix: '', spans: [] })
      rows(inline(item.lines.map(line => line.text).join('\n'), 'prose')).forEach((spans, n) => {
        drawn.push({ at: item.lines[n]?.at ?? item.lines[0]!.at, prefix: n === 0 ? `${indent}${item.marker} ` : hanging, spans: labelled(spans) })
      })
    }
    return { style: 'paragraph', lines: drawn }
  }
  return undefined
}

const emphasizes = (span: Span) => span.kind === 'pill' || span.kind === 'mark' || span.kind === 'tree' || span.kind === 'icon' || (span.kind === 'text' && span.bold === true)

/** The reply as blocks: rows for each block that holds emphasis, Markdown for the rest, merged where they touch. */
export function parse(markdown: string): Block[] {
  const lines = markdown.split('\n')
  const blocks: (Block & { end: number; start: number })[] = []
  for (const piece of chunk(lines)) {
    const drawn = toLines(lines, piece)
    if (drawn !== undefined && drawn.lines.some(line => line.spans.some(emphasizes))) {
      blocks.push({ kind: 'lines', style: drawn.style, lines: drawn.lines, gap: piece.gap, start: piece.start, end: piece.end })
      continue
    }
    const previous = blocks.at(-1)
    if (previous?.kind === 'markdown') {
      previous.text = lines.slice(previous.start, piece.end).join('\n')
      previous.end = piece.end
    } else {
      blocks.push({ kind: 'markdown', text: lines.slice(piece.start, piece.end).join('\n'), gap: piece.gap, start: piece.start, end: piece.end })
    }
  }
  return blocks.map(({ start: _start, end: _end, ...block }) => block)
}
