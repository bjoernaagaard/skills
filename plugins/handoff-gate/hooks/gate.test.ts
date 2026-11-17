import { expect, test } from 'claude-code/testing'

// Made-up replies, one for each kind of ending the gate tells apart.
const CASES: readonly { reply: string; stop: boolean }[] = [
  { reply: 'The fix is in.\n\nYou do: run `npm test` and tell me what fails.', stop: true },
  { reply: 'I found two ways to do it. Should I go with the first one?', stop: true },
  { reply: 'The plan is ready. Say go and I will start.', stop: true },
  { reply: 'Next step: decide whether the parser should use the new library, which I recommend.', stop: true },
  { reply: 'Done. Let me know if you want me to add the same check to the other module.', stop: true },
  { reply: 'The build passes.\n\nYou do: nothing.', stop: false },
  { reply: 'The build passes and all 14 checks are green.', stop: false },
  { reply: 'You do: approve the sign-in with your passkey.', stop: false },
  { reply: 'You do: run `sudo systemctl restart nginx`, because I have no admin rights.', stop: false },
  { reply: 'You do: type `/clear` to start a new session.', stop: false },
  { reply: 'You do: say whether I may delete the three old branches.', stop: false },
  { reply: 'You do: decide whether to deploy this to production today.', stop: false },
  { reply: 'You do: restart the editor so it loads the new setting.', stop: false },
  { reply: 'You do: decide whether to buy the paid plan.', stop: false },
  { reply: 'Here is the draft you asked for.\n\nYou do: send the draft back, changed or as it is.', stop: false },
]

test('the gate stops a step the agent can take, and no other', async ($, on) => {
  on('classic.Stop', () => ({}))

  for (const { reply, stop } of CASES) {
    const answer = await $.classic.Stop({ stop_hook_active: false, last_assistant_message: reply })

    expect({ reply, stopped: answer.block !== undefined }).toEqual({ reply, stopped: stop })
  }
})

test('a reply written after an objection stands', async ($, on) => {
  on('classic.Stop', () => ({}))

  const answer = await $.classic.Stop({ stop_hook_active: true, last_assistant_message: 'You do: run `npm test`.' })

  expect(answer.block).toBeUndefined()
})
