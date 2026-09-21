# Commission breakdown — mobile vs. web

Two questions answered here: **does the mobile screen match the real web product** (no — and the gap is structural, not cosmetic), and **where should it animate** (three real gaps, most candidates rejected).

---

# Part 1 — Does our UI match the web view?

**No.** Not in structure, and not in vocabulary. Some of that is a legitimate mobile decision; a lot of it is drift.

## The web product's actual model

The web view is **side-centric, two-pane, and editable**:

```
toolbar   ← back · title · Closing chip · "Awaiting Agent confirmation" · activity · comments · Finalize
toolbar   ← CDA Status: Generated · Delete · Regenerate ⌄ · Send CDA
stat band ← Total Gross Commission $99,000  |  Sale Price $4,950,000
┌─ left: SIDES TREE ──────────┬─ right: SELECTED SIDE'S MATH ─────────┐
│ Listing Side  $49,500  >    │ Listing Side · Circle Real Estate      │
│   ↳ Andy Martin [Group Lead]│ [Gross][After Deductions][To Agents][To Team]
│       MP Mark Perez $44,115 │ GROSS COMMISSION            $49,500    │
│ Buying Side   $49,500  >    │ Credits   [Deduction]          $50     │
│   Jeanne Gould              │ Referral  [Deduction]          $20     │
│                             │ + Add credit or referral               │
│                             │ + Add pre-split deduction              │
│                             │ GROSS COMMISSION AFTER DED. $49,430    │
│                             │ Mark Perez commissions      $44,115    │
│                             │ Net commission              $44,115    │
│                             │ Radius commission              $495    │
└─────────────────────────────┴────────────────────────────────────────┘
```

The unit of the page is **a side**. You select one; the right pane is that side's math. Agents are children of a side, and the group lead is a *parent* of the agent.

## Our mobile model

**Agent-centric, one flat scroll, read-only:**

hero "Your net commission $4,980" → one flat 10-row "How yours is calculated" list → Caps → Sides (secondary, two-thirds down) → CDA → Comments.

There is no side selection. The thing the web makes primary — a side's math — is buried in a sheet behind a tap on a row near the bottom.

## The structural mismatches

| # | Web | Ours | Verdict |
|---|---|---|---|
| 1 | Page scoped to **a selected side** | Page scoped to **the signed-in agent** | **Drift.** Defensible for an agent-only view, but then it's a different screen, not the mobile version of this one. |
| 2 | **Sides tree is the primary object**, with the side's math beside it | Sides is a section near the bottom; side math is in a sheet | **Wrong priority.** The web's right pane ≡ our `#sideSheet`. We buried the main event. |
| 3 | **Nesting**: Listing Side → Andy Martin (Group Lead) → Mark Perez (Primary agent), with indent guides | Flat `.agentrow` list, no hierarchy; group lead only visible in team-lead role | **Missing model.** The parent/child relationship is information, and we dropped it. |
| 4 | Hero band = **Total Gross Commission + Sale Price** | Hero = **Your net commission** (+ price/rate/gross in a sub-line) | **Drift.** Ours is arguably better for an agent — but we already compute total gross in the auditor role, so this is role-gating a number the web shows everyone. |
| 5 | **4 summary tiles per side**: Gross · After Deductions · To Agents · To Team | Nothing equivalent | **Gap.** That tile row is the at-a-glance the mobile screen most needs. |
| 6 | **Editable**: + Agent, 50% commission chip, Add credit or referral, Add pre-split deduction, Regenerate, Delete | Read-only; "edited on desktop" | **Fine** — but only if the read model matches. It doesn't. |
| 7 | CDA is a **top-level toolbar** (Status · Send · Regenerate · Delete) | CDA is a card near the bottom; **no Regenerate at all** | Priority is a fair mobile call. Missing Regenerate is a gap. |
| 8 | Status reads **"Awaiting Agent confirmation"** — names who's blocking | Pill reads **"Draft"** — names the state | **Web's is better.** Adopt it. |
| 9 | Nothing about caps or post-cap fees in view | Whole **Caps** card + Radius/Team **post-cap fee** rows | **Unverified.** Either it's further down the web page or we invented it. Needs confirming before it ships. |

## The fee model doesn't reconcile — this is the serious one

| | Web | Ours |
|---|---|---|
| Gross | $99,000 | $23,000 |
| Side gross | $49,500 | $11,500 |
| Deductions | −$70 (Credits $50, Referral $20) | −$70 (same two) ✓ |
| After deductions | **$49,430** | **$11,430** (we call it "Commission basis") |
| To the agent | **$44,115** — 89.3% of basis | **$4,980** — 43.6% of basis |
| Path to that number | basis → agent payout, Radius commission $495, To Team −$250 | basis → **80/20 split** → −$495 Radius fee → −$1,070 **post-cap** → −$250 **team post-cap** → −$2,349 **post-split deductions** (8 line items) |

Same deal shape, two different fee stacks. Our eight post-split line items — SBTC, E&O, TC fee, RM fee, RERM, team admin fee, vendor referral fee, file review fee — and both post-cap fees appear **nowhere** in the web view. Either the web page has more below the fold, or we invented a fee model and an agent comparing the two screens will not trust either.

**This needs a product answer before any more design work.** It is not a UI question.

## Terminology map — adopt the left column

Almost none of our labels match the product's. Every row here is a rename:

| Web (ground truth) | Ours | Action |
|---|---|---|
| Total gross commission | Gross (in hero sub-line) | Rename |
| Sale price | Sale price ✓ | — |
| Listing side / Buying side | Listing side / Buying side ✓ | — |
| Side total | side total ✓ | — |
| Gross commission | Listing side gross | Rename |
| Credits / Referral `[Deduction]` | Credits / Referral (inside a fold) | Keep names, surface the `Deduction` tag |
| Gross commission after deductions | **Commission basis** | Rename — "basis" is ours, not the product's |
| Mark Perez commissions · "Net amount only" | Your split | Rename |
| Net commission · "Total paid to agents on this side" | Net commission to you | Align |
| Radius commission | Radius fee | Rename |
| To team | Team post-cap fee | Reconcile (see fee model) |
| Awaiting Agent confirmation | Draft | Adopt web's phrasing |
| Finalize | Confirm breakdown | Role-dependent; web's auditor verb is "Finalize" ✓ we match in auditor role |
| Send CDA / Regenerate / Delete | View / Download | Add Regenerate; Delete is auditor-only |

**One caveat:** the web view uses Title Case ("Total Gross Commission", "Group Lead", "Send CDA") and ALL-CAPS section keys ("GROSS COMMISSION"), both of which the Radius DS bans. **Match the web's terminology, not its casing** — "Gross commission after deductions", sentence case.

## What I'd actually do

Restructure the mobile screen around **the side**, keeping the agent's own side as the default:

1. **Header** — title + closing chip + status phrased as *"Awaiting your confirmation"*.
2. **Stat band** — two cells, matching web: `Total gross commission $23,000` · `Sale price $1,150,000`. Your net moves into the side panel where the web has it.
3. **Side selector** — a 2-up segmented control (`Your side · Buying side`), not a section two-thirds down the page. This is the page's primary control.
4. **Four tiles** for the selected side — Gross · After deductions · To agents · To team. This is the web's summary and it works better on a phone than a 10-row list does.
5. **The math** for the selected side, using the web's labels, with the `Deduction`-tagged rows inline rather than folded.
6. **Agents on this side**, nested: group lead → primary agent → payout, with the indent guide the web uses.
7. **Caps / post-cap / post-split deductions** — hold until the fee model question above is answered.
8. CDA + comments stay where they are; add Regenerate for the auditor role.

That's a rebuild of the middle of the screen, not a tweak. Worth confirming the fee model first.

---

# Part 2 — Animation opportunities

Judged with restraint: this screen is a dense, professional money tool that an auditor may open dozens of times a day. Most candidates were rejected. The existing motion is already about 80% right — `--ease-drawer` `cubic-bezier(.32,.72,0,1)` on the sheets, `--ease-out` `cubic-bezier(.23,1,.32,1)` on the CTA, 160ms toast, `prefers-reduced-motion` respected throughout.

## Opportunities

| # | Location | Today | Term | Purpose | Frequency | Suggested motion |
|---|---|---|---|---|---|---|
| 1 | `[data-fold]` → `.sub` (`sub.hidden = openNow`) | The chevron rotates smoothly over 160ms while the content **teleports** via `display:none` | **Accordion / Collapse** | Preventing a jarring change | Occasional | `.sub { display:grid; grid-template-rows:0fr; opacity:0; transition:grid-template-rows 200ms cubic-bezier(.23,1,.32,1), opacity 160ms ease-out }` → `1fr`/`1` when open. Drop the `hidden` attribute for a `data-open` attr so it can transition. Sync to the chevron's 160ms. |
| 2 | `.hd-btn`, `.btn`, `.abar .ghost`, `.cfield .send`, `.rolechip` | `:active { transform:scale(...) }` with **no `transition` declared** — press snaps, release snaps | **Press / tap feedback** | Feedback | Tens/day | `transition: transform 160ms cubic-bezier(.23,1,.32,1)` on each. `.rolechip` has no `:active` at all — add `scale(.97)`. `.abar .prim` already does this correctly; copy it. |
| 3 | `.sheet .grab` | A grabber pill that promises drag-to-dismiss; **no gesture is wired** | **Swipe to dismiss** + **Rubber-banding** + **Momentum** | Feedback / spatial consistency | Occasional | Pointer-capture drag on `.grab`; set `transform:translateY(px)` directly on the sheet (never a CSS var — it recalcs every child). Dismiss on `Math.abs(dy)/elapsedMs > 0.11` **or** past 25% height; otherwise snap back 300ms `cubic-bezier(.32,.72,0,1)`. Damping above the resting position instead of a hard stop. Ignore extra touch points once dragging. |
| 4 | `setRole()` — hero label, hero value, math heading, net label, status text | Five values rewrite at once with **zero bridge**; `$4,980` → `$23,000` reads as a glitch | **Crossfade** (+ **Blur** to mask it) | State indication | Rare (role switch) | Wrap the hero + math heading; on change `filter:blur(2px); opacity:.6` for 120ms, swap text, release over 180ms ease-out. This is exactly the case blur is for — it bridges two overlapping states so the eye sees one transformation, not two numbers. |
| 5 | `.abar` — `prim.hidden` / `stateMsg.hidden` swap after confirming | The indigo CTA vanishes and a green status line appears in the same slot, instantly | **Crossfade** / **Morph** | State indication | Rare (once per deal) | Crossfade the two 200ms ease-out; scale the `ph-check-circle` from `.9` → `1` with opacity (never from `scale(0)` — nothing appears from nothing). This is the emotional peak of the screen; it's where the delight budget belongs. |

Reduced motion: items 1, 4 and 5 keep their opacity/blur and drop the transform; item 2 drops entirely; item 3 keeps the gesture, removes the snap-back easing. The existing `@media (prefers-reduced-motion: reduce)` block already lists the right selectors — extend it.

## Rejected candidates

- **Number ticker on the hero `$4,980` on load** — *Rejected: functional data the agent is reading. A commission figure that rolls is a figure you can't read yet, and it implies the number is still settling.*
- **Stagger on the 10 `.kv` math rows** — *Rejected: it's a table of money being scanned top-to-bottom; stagger delays comprehension, and an auditor sees this screen tens of times a day.*
- **Cap progress bars filling on load** — *Rejected: both caps are already at 100%. Animating to full implies live progress that isn't happening, and it's data being read.*
- **Scroll-driven parallax / blur ramp on the glass header** — *Rejected: decoration on functional chrome. The `backdrop-filter` already does the separation work.*
- **Command-style shortcut for the role switcher** — *Rejected: keyboard-initiated, and per Part 1 the switcher shouldn't be in product chrome at all.*
- **Sheet entrance easing** — *Rejected: already correct. `translateY(103%)` → `none` at 300ms `cubic-bezier(.32,.72,0,1)` is the Ionic drawer curve, and percentage translate means it works at any sheet height.*
- **Toast and chevron** — *Rejected: already correct. 160ms, `transform` + `opacity` only.*

## Code review (Before / After)

| Before | After | Why |
|---|---|---|
| `sub.hidden = openNow` | `sub.dataset.open = !openNow` + `grid-template-rows` transition | `display:none` can't transition; the content teleports while the chevron animates |
| `.hd-btn:active { transform:scale(.94) }` (no transition) | add `transition: transform 160ms cubic-bezier(.23,1,.32,1)` | Without a transition both press *and* release snap; the button doesn't feel like it heard you |
| `.rolechip` — no `:active` | `:active { transform:scale(.97) }` + 160ms ease-out | Every pressable element needs press feedback |
| `.scrim { transition: opacity 240ms ease }` | `200ms ease-out` | Scrim is an entrance; `ease-out` gives immediate response, and 240ms is above budget for a backdrop |
| `.kv .chev { transition: transform 160ms ease }` | `160ms cubic-bezier(.23,1,.32,1)` | Built-in `ease` is weak; matches the curve the rest of the file already uses |
| `.grab` rendered with no gesture | wire drag + velocity dismissal, or delete the handle | A grabber is a promise; don't make it and break it |
| `.abar .prim { box-shadow: 0 8px 24px rgba(90,95,242,.34) }` | `var(--shadow-sm)` | Decorative coloured glow; the DS says elevation stays subtle |
| Role swap rewrites 5 text nodes instantly | blur+opacity crossfade, 120ms out / 180ms in | Two numbers overlapping with no bridge reads as a bug; blur merges them into one transformation |

## Verdict

The motion here is closer to right than the structure is. Only **item 1** is a genuine defect — a chevron that animates while its content teleports is the kind of half-finished transition users read as jank — and **item 2** is a one-line fix across five selectors. **Item 3** matters because the UI is currently promising a gesture it doesn't support.

But the highest-leverage change on this screen isn't animation at all: it's Part 1. Animating a flat 10-row list won't fix the fact that the web product is side-scoped and our mobile screen isn't, and that the two disagree on what the agent takes home. **Settle the fee model, then restructure around the side, then spend the motion budget.**
