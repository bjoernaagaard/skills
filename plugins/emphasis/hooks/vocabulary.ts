// The one table the drawing and the reply rules both read. Words are written as the rules show them;
// lookups use their lower case. `core` words are taught by the rules, `also` words are drawn the same.
import type { ThemeKey } from 'claude-code'

export type Tone = 'error' | 'warning' | 'success' | 'danger' | 'mode' | 'owner' | 'neutral'

type ToneEntry = {
  means: string
  bg: ThemeKey
  fg: ThemeKey
  core: readonly string[]
  also: readonly string[]
}

// Listed in the order a word found in two tones resolves: the first tone wins.
export const TONES: Readonly<Record<Tone, ToneEntry>> = {
  danger: {
    means: 'consequences, beside any action that has one, before taking it',
    bg: 'bashBorder',
    fg: 'inverseText',
    core: ['Costs money', 'Destructive', 'Irreversible'],
    also: [],
  },
  error: {
    means: 'something is wrong',
    bg: 'error',
    fg: 'inverseText',
    core: ['Failed', 'Broken', 'Unsafe', 'Rejected', 'Down'],
    also: ['Blocked', 'Fail', 'Failing', 'Error'],
  },
  warning: {
    means: 'look here',
    bg: 'warning',
    fg: 'inverseText',
    core: ['Needs you', 'Decision', 'Unverified', 'Skipped', 'Pending', 'Review', 'Stale', 'Draft'],
    also: ['Partial', 'In progress', 'At risk', 'Needs review', 'Waiting', 'Todo'],
  },
  success: {
    means: 'settled',
    bg: 'success',
    fg: 'inverseText',
    core: ['Done', 'Passed', 'Fixed', 'Live', 'Keep', 'Ready', 'Merged', 'Safe', 'Verified', 'Shipped', 'Approved'],
    also: ['Observed', 'Recommended', 'Pass', 'Ok', 'Complete', 'Completed', 'Finished', 'Healthy'],
  },
  mode: {
    means: 'the kind of work',
    bg: 'planMode',
    fg: 'inverseText',
    core: [],
    also: ['Brainstorm', 'Investigate', 'Preview', 'Implement', 'Qualify'],
  },
  owner: {
    means: 'ownership of a changed file, service or setting',
    bg: 'ide',
    fg: 'inverseText',
    core: ['Shared'],
    also: ['Owned', 'Foreign'],
  },
  neutral: {
    means: 'context',
    bg: 'permission',
    fg: 'inverseText',
    core: ['New', 'Changed', 'Inferred'],
    also: ['Optional'],
  },
}

/** Words a reply may use that only the owner can act on, taught whatever their count. */
export const OWNER_WORDS: readonly string[] = ['Needs you', 'Decision', 'Costs money', 'Destructive', 'Irreversible']

// Font Awesome glyphs from the Nerd Font set, one cell wide in every terminal.
const CHECK = '\uf00c'
const CROSS = '\uf00d'
const CLOCK = '\uf017'

/** The icon each known pill word carries. A word without one draws text only. */
export const PILL_ICONS: Readonly<Record<string, string>> = {
  done: CHECK, passed: CHECK, pass: CHECK, complete: CHECK, completed: CHECK, ok: CHECK, verified: CHECK, ready: CHECK,
  observed: '\uf06e', recommended: '\uf005', fixed: '\uf0ad', live: '\uf135', shipped: '\uf135', approved: '\uf164',
  failed: CROSS, fail: CROSS, failing: CROSS, error: CROSS, rejected: CROSS,
  blocked: '\uf05e', broken: '\uf127', unsafe: '\uf132', down: '\uf063',
  'needs you': '\uf007', decision: '\uf126', unverified: '\uf128', 'at risk': '\uf071',
  'in progress': '\uf110', pending: CLOCK, waiting: CLOCK, partial: '\uf042', skipped: '\uf04e',
  inferred: '\uf0eb', new: '\uf067', changed: '\uf040', optional: '\uf10c', 'costs money': '\uf155',
  destructive: '\uf1f8', irreversible: '\uf023', review: '\uf06e', stale: '\uf1da', draft: '\uf044', safe: '\uf132',
  brainstorm: '\uf0eb', investigate: '\uf002', preview: '\uf06e', implement: '\uf0ad', qualify: '\uf0c3',
  owned: '\uf007', shared: '\uf0c0', foreign: '\uf023',
  keep: '\uf08d', merged: '\uf126', healthy: '\uf004', todo: '\uf0ae',
}

/** Words that display as one canonical word, so the same state always reads the same. */
export const SYNONYMS: Readonly<Record<string, string>> = {
  complete: 'Done', completed: 'Done', ok: 'Done', finished: 'Done', pass: 'Passed',
  fail: 'Failed', failing: 'Failed', error: 'Failed', waiting: 'Pending', 'needs review': 'Review',
}

/** The icon a heading or a line's leading bold label takes from its word. */
export const LABEL_ICONS: Readonly<Record<string, string>> = {
  finding: '\uf002', terminal: '\uf120', folder: '\uf07b', file: '\uf15b', branch: '\uf126', review: '\uf06e',
  ideas: '\uf0eb', cause: '\uf0e7', fix: '\uf0ad', risk: '\uf071', limits: '\uf071', next: '\uf061', rollback: '\uf0e2',
  undo: '\uf0e2', options: '\uf0ca', result: '\uf11e', why: '\uf059', how: '\uf013', cost: '\uf155', rule: '\uf0e3',
  example: '\uf121', checked: '\uf00c', pills: '\uf02b', colors: '\uf1fc', icons: '\uf005', scoreboard: '\uf080',
  verdict: '\uf0e3', effect: '\uf140', evidence: '\uf06e', plan: '\uf0ae', status: '\uf012', decision: '\uf126',
}

/** Bold lead-ins that name an action. Written with a colon, they take an icon anywhere in a line. */
export const ACTION_ICONS: Readonly<Record<string, string>> = {
  check: '\uf046', do: '\uf0a4', next: '\uf061', unblock: '\uf09c', left: '\uf141', run: '\uf04b', guard: '\uf132',
  undo: '\uf0e2', see: '\uf08e',
}

/** Plain labels that open a line without bold, drawn as a bold label with an icon. */
export const LINE_LABELS: Readonly<Record<string, string>> = {
  outstanding: '\uf0ae',
  'you do': '\uf007',
}

/** Characters drawn in a color of their own wherever they stand in prose. */
export const MARKS: Readonly<Record<string, ThemeKey>> = {
  '✓': 'success', '✔': 'success', '✗': 'error', '✘': 'error', '→': 'claude',
}

/** Tree connectors, drawn dim. */
export const TREE: readonly string[] = ['├──', '└──']

/** The color bold text takes, link-like, so anchor terms stand out from inline code. */
export const BOLD_COLOR: ThemeKey = 'ide'

/** Rounded Nerd Font end caps for a pill, drawn in the pill's color. */
export const CAPS = { left: '\ue0b6', right: '\ue0b4' } as const

/** Longest pill label drawn; a longer one stays as typed. */
export const MAX_PILL = 32
