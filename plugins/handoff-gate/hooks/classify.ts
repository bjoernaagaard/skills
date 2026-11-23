export type Verdict = {
  kind:
    | 'none' // the reply hands over nothing
    | 'session' // a slash command, which only the user can type
    | 'hands' // a passkey, a code, a sign-in or a click in an app
    | 'admin' // a credential or admin rights the agent lacks
    | 'restart' // a restart of the app the agent runs in
    | 'delete' // deleting the user's data
    | 'leaves' // a release, a deploy, a shared push or a message to a person
    | 'money' // a purchase or a paid plan
    | 'review' // a draft the user asked to read, or a note for a later task
    | 'offer' // work the agent recommends under "Next:", which waits for a yes
    | 'command' // a command the agent can run
    | 'permission' // a go-ahead for work the agent can do
  line: string
}

const CLOSING = /^\**(you do|next step|action needed|your turn|to do|next(?=\**:)):?\**:?\s*(.+)$/im
const NOTHING = /^[*"'`]*(nothing|none|n\/a)\b/i
const AWAITS_YES = /\b[Yy]es\b|\bI\b/
const OFFER =
  /[^.\n]*\b(should I\b|shall I\b|want me to\b|would you like me to\b|let me know (if|when|whether)\b|say (yes|go|the word)\b|you('ll| will) need to run\b|please run\b|you can run\b)[^.\n?]*[.?]?/i

const RULES: readonly (readonly [Verdict['kind'], RegExp])[] = [
  ['session', /(^|\s)`?\/[a-z][a-z-]+( [a-z]+)?`?/],
  ['hands', /passkey|security key|yubikey|touch id|fingerprint|\b(mfa|2fa)\b|authenticator|sign[ -]in\b|log ?in\b|\bclick\b|approval|your phone|in (the|your) browser/i],
  ['admin', /\bsudo\b|\badmin(istrator)?\b|\belevated\b|\bpassword\b|\b(api )?(token|key)\b|\bcredential/i],
  ['restart', /\brestart\b|\breload\b|\breopen\b/i],
  ['delete', /\b(delete|remove|drop|wipe|purge|revoke)\b/i],
  ['leaves', /\b(publish|release|deploy|ship)\b|\bpush\b.*\b(main|master|shared|public|origin)\b|\bproduction\b|\b(email|message|notify|tell)\b.*\b(team|customer|client|colleague|channel)\b/i],
  ['money', /\b(buy|purchase|pay|paid plan|upgrade the plan|billing)\b/i],
  ['review', /\b(send|change|correct|edit)\b.*\b(prompt|draft|comments|text|line)\b|\bnext\b.*\btask\b/i],
  ['command', /`[^`]+`|^(run|execute|merge|review|check|commit|type|test|verify)\b/i],
]

/** Says what the last reply of a turn hands to the user. */
export function classify(reply: string): Verdict {
  const closing = CLOSING.exec(reply)
  const line = closing ? closing[2].trim() : (OFFER.exec(reply.slice(-600))?.[0].trim() ?? '')

  if (line === '' || NOTHING.test(line)) return { kind: 'none', line }
  if (closing?.[1].toLowerCase() === 'next' && AWAITS_YES.test(line)) return { kind: 'offer', line }

  for (const [kind, pattern] of RULES) {
    if (pattern.test(line)) {
      const isGoAhead = kind === 'command' && /^(say|tell me|decide|answer|approve|confirm)\b/i.test(line)
      return { kind: isGoAhead ? 'permission' : kind, line }
    }
  }

  return { kind: 'permission', line }
}

const HOW: Partial<Record<Verdict['kind'], string>> = {
  command: 'Run it now and report the output.',
  permission: 'Take the option you recommend and do it now.',
}
const HOW_UNDER_NEXT =
  'If it belongs to what I asked for, take it now and report the result. If it is new work, keep it as the Next line and wait for my yes.'

/** The text that sends the agent back to work, or undefined when the reply may stand. */
export function objection(reply: string): string | undefined {
  const { kind, line } = classify(reply)
  const how = HOW[kind]

  if (how === undefined) return undefined

  const underNext = CLOSING.exec(reply)?.[1].toLowerCase() === 'next'

  return [
    `Your reply hands me a step that you can take: "${line.slice(0, 300)}"`,
    underNext ? HOW_UNDER_NEXT : how,
    'Hand me a step only when it needs a credential or admin rights you lack, my hands, my money, the deletion of my data, something that leaves my machine, or a restart of the app you run in, and then name which one it is.',
  ].join(' ')
}
