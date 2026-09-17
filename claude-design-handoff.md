# Handoff — Commission breakdown

**The deliverable is the file, not this document.** `Commission breakdown.html` in this folder is
the approved design. Take it wholesale. This document exists so you know what it replaces and what
you must not touch.

---

## Scope

**Replace exactly one screen: `Commission breakdown.html`.**

Do not modify, redesign, reformat or "align" any of these:

| Off-limits | Why |
|---|---|
| `Implemented Home.html` | Frozen. Engineering is building it. |
| `Appointments.html`, `Tasks.html`, `Transactions.html`, `Documents.html` | Frozen. |
| `Agent profile.html`, `Office.dc.html`, `index.html` | Frozen. |
| `assets/`, `support.js`, `image-slot.js` | Shared. A change here reaches every screen. |
| `redesign/` | A separate track. Never cross-reference it from a root file. |

Other root files (`Commission side.html`, `Commission caps.html`, `Transaction detail.html`, …) are
out of scope for this handoff even though they are commission-related.

**Do not re-derive anything below.** The change log is review context, not a build list. Every item
is already in the file. Re-applying it will damage the design.

---

## What changed on this screen

### Header
- The property banner is gone — no hero photo, no blurred page wash, no thumbnail, no address.
  The screen no longer names the property.
- In its place: a standard nav bar — back, the title `Commission breakdown`, overflow — and below
  it a full-bleed 40px metadata strip, `● Awaiting agent confirmation` on the left, `Closes May 13`
  on the right. No divider between the two, no card, no rounded container.
- `.pg-head` uses `align-items:stretch`. It previously inherited `center`, which made both rows
  shrink to their content and sit 23px in from each edge.
- The title rule is scoped `.pg-head .pg-title`. A bare `.pg-title` loses to the sheet's own `h1`
  rule, which rendered it at 700 22px and truncated it.

### Breakdown card
- Near-opaque fill `rgba(18,18,20,.94)`, `1px rgba(255,255,255,.08)` border, `blur(10px)`.
  Only a trace of the background reads through.
- **Net commission leads the card** — green, 17px/700, hairline under it. It is the same chain row
  hoisted, not a second copy. The old net row at the bottom of the chain is gone.
- Sale price, commission %, gross commission and the brokerage share moved into the detail that
  `Your split · 80%` opens. They still render in the lower per-agent breakdown, which reads the
  same chain.
- The `Full breakdown` row keeps its chevron and edit button. It is **not sticky**.
- The edit pencil is pinned to the card's top-right corner, `position:absolute`, 11px in on both
  edges.

### Fees
- One fee per row, one line each. Amounts share an 84px right-aligned tabular column.
- Every qualifier that used to sit on the row as a permanent second line — `$250 flat`,
  `5% of gross + $495 flat`, `This side after credits` — is now inside a tap-to-open detail block
  carrying the rule, the basis, the arithmetic, who pays it, who it is paid to and whether it wires.
  One open at a time.
- The three scope icons per row are gone. A single amber warning glyph renders only when a fee
  carries `post.flag`. Nothing in the fixture sets one, so none shows today.
- Rows are 40px of ink with a 44px hit target (centred pseudo-element, same trick as `.fb-edit`).
- Add-fee controls appear in edit mode only. The dotted "editable" underline is scoped to real edit
  targets, not to every row that happens to be a button.

### Grouping
- A read-only `Deductions · 13 fees  −$6,559` summary, then three collapsible groups with their own
  counts and subtotals: `Plan fees · 3 fees −$3,715`, `Post-split deductions · 8 fees −$2,349`,
  `Payable to Radius · 2 fees −$495`. Plan fees is open by default.
- Subtotals are summed from raw numbers and rounded once. They are never parsed back out of the
  formatted strings.
- The maths reconciles: `3,715 + 2,349 + 495 = 6,559`, and `39,544 − 6,559 = 32,985`.
- An issue strip renders above the groups for any flagged fee, whether or not its group is open, so
  a collapsed group can never hide a problem. Empty today.
- `Plan & assumptions` is renamed `Plan & commission basis` and has a visible rule above it. That
  rule existed before but used `--glass-border`, which is declared as `--glass-border: var(--glass-border)`
  in the dark block and resolves to nothing.

### Colour
- **Deductions are no longer red.** Every negative amount is standard foreground text carrying a
  U+2212 minus, right-aligned. Five rules were removed: `.ybd-det .d.neg b`, `.kv .v.neg`,
  `.srow .svv.neg`, `.prow .pv.neg`, `.poprow .pv.neg`.
- Net commission is green. Amber and red are reserved for a fee that needs attention, so nothing on
  the screen is coloured today.

### Additional detail
- `Where this came from` is renamed `Additional detail` and is now a 44px disclosure row with a
  chevron, collapsed by default.
- The two source rows lost their boxes — no background, border, radius or shadow. A single hairline
  separates Listing side from Buying side.
- Tapping the signed-in agent in `Agents on this side` now opens **cap progress only**. Their full
  chain was a second copy of the card above it. Co-agents, the group lead and the co-op side keep
  their full panels.

### Action bar
- Floating glass capsule: inset 12px each side, 35px clear of the bottom plus safe area, 32px
  radius, `rgba(28,28,30,.72)` with `blur(30px) saturate(180%)`, hairline ring and a drop shadow.
  The old edge-attached gradient and its top hairline are gone.
- The comment composer lives in the bar. Tapping the chat icon swaps the bar's contents for
  `✕ | Add a comment | ↑`; ✕ hands the bar back. There is no comment card in the page flow.

---

## Open, not done

Recorded so nobody assumes these were finished.

1. **Agent split block for co-agents.** Removing the `Agent split` head and its two rows from the
   per-agent panel was planned and not applied. It would leave a **$9,886 hole** between the gross
   and the net in a co-agent's panel — the brokerage share is the missing step. Needs a decision
   before it ships.
2. **Confirmation sheet binds the wrong figure.** The sheet uses the combined agent total while the
   card shows the signed-in agent's own amount. With more than one agent on a side those differ.
3. **Post-split fees are divided evenly across agents** regardless of each fee's scope metadata.
4. `markStuck()` still sets and clears a `data-stuck` attribute that nothing styles any more, now
   that the header is not sticky.
