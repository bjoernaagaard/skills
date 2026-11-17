// Draws parsed blocks in the terminal: Markdown blocks as the engine's own Markdown, rows as Text
// that matches how the engine draws the same Markdown, plus the pills, icons and colors.
import type { Elements, RenderChildren, RenderElement, TextProps } from 'claude-code'
import type { Block, LinesStyle, Span } from './parse'
import { BOLD_COLOR, CAPS, MARKS, TONES } from './vocabulary'

export type Look = { icons: boolean; roundEnds: boolean }

const NBSP = '\u00a0'

const BLOCK_STYLE: Record<LinesStyle, TextProps> = {
  paragraph: {},
  heading: { weight: 'bold' },
  title: { weight: 'bold', italic: true, underline: true },
}

/** `bullet` is the engine's reply bullet on the block that opens a reply, and empty on the others. */
const styleOf = (s: { bold?: true; italic?: true; strike?: true }): TextProps => ({
  ...(s.bold ? { weight: 'bold' } : {}),
  ...(s.italic ? { italic: true } : {}),
  ...(s.strike ? { strikethrough: true } : {}),
})

export function draw(blocks: readonly Block[], { Box, Text, Markdown, Link }: Elements['terminal'], look: Look, bullet: string): RenderElement {
  const span = (s: Span): RenderChildren => {
    switch (s.kind) {
      case 'text':
        if (!s.bold && !s.italic && !s.strike) return s.text
        return <Text {...styleOf(s)} {...(s.bold ? { color: BOLD_COLOR } : {})}>{s.text}</Text>
      case 'code':
        return <Text color="permission" {...styleOf(s)}>{s.text}</Text>
      case 'link':
        return <Link href={s.href} label={s.text} />
      case 'mark':
        return <Text color={MARKS[s.text]}>{s.text}</Text>
      case 'tree':
        return <Text dimColor>{s.text}</Text>
      case 'icon':
        if (!look.icons) return null
        return s.bold ? <Text weight="bold" color={BOLD_COLOR}>{`${s.text} `}</Text> : `${s.text} `
      case 'pill': {
        const { bg, fg } = TONES[s.tone]
        const label = (look.icons && s.icon !== undefined ? `${s.icon} ${s.text}` : s.text).replace(/ /g, NBSP)
        if (!look.roundEnds) return <Text backgroundColor={bg} color={fg} weight="bold">{`${NBSP}${label}${NBSP}`}</Text>
        return [
          <Text color={bg}>{CAPS.left}</Text>,
          <Text backgroundColor={bg} color={fg} weight="bold">{label}</Text>,
          <Text color={bg}>{CAPS.right}</Text>,
        ]
      }
    }
  }

  // Rows with a prefix wrap under their own text, as the engine wraps a list item.
  const drawBlock = (block: Block): RenderElement => {
    if (block.kind === 'markdown') return <Markdown text={block.text} />
    if (block.lines.every(line => line.prefix === '')) {
      return <Text {...BLOCK_STYLE[block.style]}>{block.lines.map((line, n) => [n > 0 ? '\n' : null, line.spans.map(span)])}</Text>
    }
    return (
      <Box flexDirection="column">
        {block.lines.map(line =>
          line.spans.length === 0 ? (
            <Text> </Text>
          ) : (
            <Box flexDirection="row">
              <Box flexShrink={0}>
                <Text>{line.prefix}</Text>
              </Box>
              <Box flexGrow={1} flexShrink={1}>
                <Text {...BLOCK_STYLE[block.style]}>{line.spans.map(span)}</Text>
              </Box>
            </Box>
          ),
        )}
      </Box>
    )
  }

  return (
    <Box flexDirection="row" marginTop={1}>
      <Box width={2} flexShrink={0}>
        <Text color="text">{bullet}</Text>
      </Box>
      <Box flexDirection="column" flexGrow={1} flexShrink={1}>
        {blocks.map(block => (block.gap ? <Box marginTop={1}>{drawBlock(block)}</Box> : drawBlock(block)))}
      </Box>
    </Box>
  )
}
