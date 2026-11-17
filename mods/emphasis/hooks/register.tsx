import type { Register } from 'claude-code'
import { draw } from './draw'
import { parse } from './parse'
import { replyRules } from './rules'

export const register: Register = (on, options) => {
  const look = { icons: options['icons'] !== false, roundEnds: options['roundEnds'] !== false }
  let bullet: Promise<string> | undefined

  // Draws only: the stored message keeps its Markdown, so copies, exports and other surfaces see [[Word]].
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || e.props.isSummary) return next(e)

    const blocks = parse(e.props.text)

    if (!blocks.some(block => block.kind === 'lines')) return next(e)

    // The engine's own reply bullet, which a drawn tree replaces along with the rest of the row.
    bullet ??= $.session.info().then(info => (info.platform === 'macos' ? '\u23fa' : '\u25cf'))

    return draw(blocks, $.ui.resolve(e), look, e.props.isFirstOfReply ? await bullet : '')
  })

  // The rules travel with the drawing: only a session a terminal draws is told to write pills.
  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)

    if (!e.surfaces.includes('terminal')) {
      $.ui.log(`emphasis: reply rules left out, surfaces [${e.surfaces.join(', ')}]`, { to: 'debug' })
      return composed
    }

    $.ui.log('emphasis: reply rules added, surfaces [terminal]', { to: 'debug' })
    return { sections: [...composed.sections, { id: 'emphasis:reply-rules', text: replyRules(), scope: 'session' }] }
  })
}
