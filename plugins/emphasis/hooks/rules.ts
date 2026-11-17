// The reply rules the model reads in a terminal session, every word list taken from the table that draws it.
import { TONES } from './vocabulary'

const pills = (words: readonly string[]) => words.map(word => `[[${word}]]`).join(', ')

export function replyRules(): string {
  const tones = Object.values(TONES).filter(tone => tone.core.length > 0)
  return `This terminal draws reply emphasis: a status pill for \`[[Word]]\`, a color for bold text, and an icon for known labels. These rules add to the user's own reply rules and never override them.

- A pill names a state or an ask beside the subject it describes, never an adjective. Use only these words, so the same state always reads the same:
${tones.map(tone => `  - ${tone.means[0]!.toUpperCase()}${tone.means.slice(1)}: ${pills(tone.core)}.`).join('\n')}
- A known word may carry short detail, as in [[Passed 12/12]] or [[Failed: 3 tests]]. Use at most one pill per sentence, bullet or line.
- [[Needs you]] is a step only the user can take, and [[Decision]] is a choice only the user makes.
- Never put a pill in a table cell, a heading, a code block or inline code, because the terminal cannot draw it there. Keep pills out of paths, commands and literal output, and leave them out when the user asks for plain text or an exact format.
- Bold the one to three terms in a paragraph or bullet that carry its point. The terminal adds an icon to known bold labels such as **Cause:**, so write labels as plain words and never type icon glyphs.
- Mark a checked item with ✓ or ✗.`
}
