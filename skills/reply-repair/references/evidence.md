# Evidence behind the rules

Read the file before you edit the skill, so that a change keeps what was tested.

## Where the rules come from

The rules come from turns in the owner's own sessions where a reply failed. In October and November 2026, 15 of 523 follow-up turns were a complaint such as "TLDR", "I'm so confused", "what do I do", or a question asked for the fourth time. Each rule under "When the last reply failed" answers one of those complaints.

No study tests reply format for agent output. The rules rest on three findings about reading, working memory and attention, so they are inferences.

| Rule | Finding it rests on |
|---|---|
| Keep each fact in the reply | Extra working memory load lowers reading comprehension (Kofler 2018 and 2020, children) |
| Labelled closing lines, answer first | Guidance during reading closed a comprehension gap in adult readers (Brann and Sidi 2024) |
| Short, one topic | Dull or long text raises mind wandering, and mind wandering lowers comprehension (Brann and Sidi 2024) |
| Do the step, hand over one step | Barkley's "point of performance" account, which is supported for groups and not for each person |

## What the tests showed

The tests replayed ten failed turns in fresh sessions, and a judge model from another provider scored each reply blind against the complaint that followed the original reply.

| Rules loaded | Replies that fixed the complaint, of 40 |
|---|---|
| none | 18 |
| a list of ten general rules from another skill | 18 |
| the skill alone | 26 |
| the skill with the owner's global instructions | 26 |

The results set three choices in the wording.

- **Both closing lines are always written.** A wording that left out "You do:" when the reader had nothing to do scored 1 of 8 on the "what do I do" turn, and the wording that always writes it scored 8 of 8.
- **The word limit names an outlet.** Models held the limit of 100 words in 37 of 40 replies once the rule said to put the rest in a table or a tree. Without the outlet, the two largest Claude models held it in about half.
- **Global instructions point to the skill.** With 198 skills installed, a model opened the skill in 0 of 5 complaint turns from the description alone, and in 6 of 10 once the global instructions named it.

## Known limits

- Ten turns and one judge are a small sample, and a difference of two or three replies is noise.
- A reply that shows a change with real rows needs a tool that can read the data. Without one, the reply labels its values as made up.
- No hook counts the words, so the limit depends on the model following the rule.
