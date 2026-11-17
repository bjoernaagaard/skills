import type { Register } from 'claude-code'
import { objection } from './classify'

export const register: Register = on => {
  // One objection per stop: a reply written after it stands, so a real handoff gets through.
  on('classic.Stop', ($, e, next) => {
    if (e.stop_hook_active) return next(e)

    const block = objection(e.last_assistant_message ?? '')

    return block === undefined ? next(e) : { block }
  })
}
