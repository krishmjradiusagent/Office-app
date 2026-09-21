# Change protocol — read before touching any file

This overrides every other instinct. If this file and anything else conflict, this file wins.

## The gate

**No edit to any file without an approved plan in chat first.** I post the plan, then stop and
wait. I do not write, edit, or delete anything until you reply with one of:

- `yes` / `go` / `go ahead` / `ship it` / `approved`

Anything else — silence, a question, a comment, a screenshot, "hmm", "why" — is **not** approval.
If your reply changes the plan, I post a revised plan and wait again.

### The only exceptions (no plan needed)

1. You name the exact change and it is one property or one string: "make it 13px", "change that
   copy to X", "remove the pill".
2. You explicitly say "no plan, just do it".
3. You say "revert" — see Revert below.

Everything else is gated. Including things I think are obviously right.

## Plan format

Short. Plain text. No essays. Three parts, always in this order:

```
WHAT CHANGES
- one line per change, in the file and selector it lands in

WIREFRAME
- ASCII before → after, only the region that changes

RISK
- what this could break, named specifically (not "might affect layout")
```

### Wireframe rules

- 40 chars wide max, so it reads on a phone.
- Show BEFORE and AFTER side by side or stacked, labelled.
- Only the affected region. Never the whole screen.
- Mark what moves with `<<` and what is new with `+`.

Example:

```
BEFORE                    AFTER
┌──────────────────┐      ┌──────────────────┐
│ ⑃ Sides    2 ▾   │      │ ⑃ Sides    2 ▾   │
├──────────────────┤      ├──────────────────┤
│ Listing side  $  │      │ Listing side  $  │
│ Your side        │      │ 50% · Your side  │ <<
└──────────────────┘      └──────────────────┘
                          + % now on the sub line
```

## Hard rules, no plan overrides them

1. **One cause, one edit.** Diagnose, name the cause in one sentence, fix that. No second guess
   at the same property. If the first fix misses, I re-measure — I do not re-tune.
2. **Never invent a mechanism.** No new scroll containers, height caps, locks, gestures, sticky
   positioning, or state machines unless the plan says so and you approved it.
3. **Nothing rides along.** If you ask for A, only A changes. Problems I spot become a sentence at
   the end of my reply, never an edit.
4. **Never redesign an approved screen.** Approved = it's frozen unless you ask.
5. **Measure before editing layout.** Read the real box — computed styles, rects, parent
   constraints — and state the number in the plan. No guessing at pixels.
6. **Copy is role, not status.** Second lines name what something IS ("Co-agent", "Primary agent ·
   you"), never a transient state ("Added", "pending auditing").
7. **No invented numbers.** If the math isn't wired, the cell stays empty — never `$0`, never a
   placeholder figure on a money screen.
8. **Every number on screen reconciles.** If a row, a panel, and the hero name the same thing,
   they show the same value or the plan explains why they differ.

## Revert

"Revert" means: put it back to the last state you approved, remove everything added since,
change nothing else, and say exactly what was removed. No improvements while reverting.

I keep the last approved state identifiable — if I'm unsure which one it is, I ask before
reverting rather than guessing.

## After any edit

One reply, at most three lines: what changed, what I did NOT touch, what to check. No
self-congratulation, no "done" — you decide when it's done.

## Scope

Applies to every file in this project, both tracks (root implemented screens and `redesign/`).
The freeze rules in `CLAUDE.md` still apply on top of this.
