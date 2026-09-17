# Design review: Transaction detail.html

Platform: mobile (iOS-framed web mockup, 390×844). Framework: static HTML/CSS + vanilla JS, Radius UI 3.0 tokens, Phosphor icon font.
Reviewed: Sep 15, 2026.

## Summary

**Needs work.** Craft is high — every control has a focus ring, press-shrink, `env(safe-area-inset-*)` and `prefers-reduced-motion` are all handled, and the icon set is correctly Phosphor-only per project rules. But the screen has **no way back**, the checkbox focus ring is effectively invisible (1.22:1), the idle CTA fails contrast at 2.05:1, the tab ARIA is incomplete, and the same "New client" status is green here and indigo on the Transactions list. Roughly 4 critical, 5 high.

---

## Critical

### 1. No back path — the screen is a dead end
There is no nav bar and no back affordance. Every other screen in this app uses `.pg-head` + `.back-btn` from `assets/list-page.css`; this one starts at `.deal` with a 38px top pad. A user who taps a `.tx-row` on Transactions.html cannot return.

> **HIG — Navigation**: users must always have a clear path back to where they came from.

**Fix:** add the shared `.pg-head` with a 44×44 `.back-btn` linking to `Transactions.html`, and move the address into it (or keep the large-title `.deal` block below a compact back row, iOS large-title style).

### 2. Checkbox focus indicator is 1.22:1 — invisible
```css
.cbx:focus-visible { outline:none; box-shadow:0 0 0 3px color-mix(in srgb, var(--ring) 22%, transparent); }
```
22% indigo over `#0A0A0A` computes to `rgb(28,29,61)` — **1.22:1** against the surrounding background. It also breaks the pattern every other control on the page uses.

> **HIG — Accessibility**: focus indicators must be clearly visible; non-text UI indicators need ≥3:1.

**Fix:** delete the override and use the page's own convention — `outline:2px solid var(--ring); outline-offset:2px;`.

### 3. Idle primary CTA is 2.05:1
`.cta[data-idle]` drops the whole button to `opacity:.55` *and* the label to `rgba(255,255,255,.62)`. Composited, that's `rgb(110,111,142)` on `rgb(54,57,138)` = **2.05:1** on 19px text (needs 4.5:1).

Worse, it reads as disabled but is not disabled — it still fires and toasts "Select the documents to include first". That's a false affordance in both directions.

> **HIG — Buttons**: don't make an enabled control look disabled; disabled controls shouldn't be the only place feedback lives.

**Fix:** keep the button fully enabled-looking and state the requirement instead — label it `Create envelope` when nothing is selected and `Create envelope (2)` when things are. If you want a quieter idle state, use `var(--muted)` fill with `var(--foreground)` text (13.5:1), never alpha-muted white on alpha-muted indigo.

### 4. Tab ARIA is incomplete and unreachable by keyboard convention
`.srcs` is `role="tablist"` with three `role="tab"` buttons, but there is no `role="tabpanel"`, no `aria-controls`, and no arrow-key handling — each tab is its own tab stop, and the swapped list (`#docs`) is announced to nobody.

**Fix:** either (a) add `id`/`aria-controls` + wrap `#count` + `#docs` in a `role="tabpanel"` with `tabindex="0"`, and implement Left/Right arrow roving `tabindex`; or (b) drop the tab roles and make it a `role="radiogroup"` filter, which is closer to what it actually is (three source filters, not three panels). (b) is less code and honest.

---

## High

### 5. "New client" is green here, indigo on the Transactions list
`.status` uses `rgba(109,165,68,.16)` / `#cfe6a8` (the success family). The same status on `Transactions.html` renders as `.tx-status.new` — `rgba(90,95,242,.14)` / `#c3c6ff`. One status, two hues, two screens.

> **Design Guideline — Color > Best practices**: "Avoid using the same color to mean different things." Conversely, don't give one meaning two colors.

**Fix:** reuse `.tx-status.new` styling for the pill (it is already in the shared stylesheet) and keep the status→colour map in one place.

### 6. Selection checkboxes are visually identical to task-completion checkboxes
`.cbx` is the `.tk-check` treatment (indigo fill + white check) at 24px. On Tasks.html that control means *done*; here it means *included in this envelope*. Same control, different meaning, same app.

**Fix:** differentiate — either a trailing checkmark/`Add` toggle per row, or keep the checkbox but add a selection header ("2 selected · Clear") so the mode is explicit while active.

### 7. Three touch targets under 44×44pt
| Selector | Current |
|---|---|
| `.status` (status dropdown) | 36px tall |
| `.prev` / `.fill` (Preview, View & fill) | 40px tall |
| `.sign` (send for signature) | 40×40 |

The checkbox correctly uses a `::before` 44×44 hit slop — apply the same trick here rather than growing the visuals.

> **HIG — Layout**: maintain a minimum tappable area of 44×44pt.

### 8. Selection mode persists into Envelopes and Sent
Switching to **Sent** keeps per-row checkboxes and a `Create Envelope` CTA — you cannot create an envelope out of already-sent documents. The mode doesn't belong to those sources.

**Fix:** checkboxes + CTA only on **Documents**. On **Envelopes**, the CTA becomes `New envelope`; on **Sent**, hide the footer CTA (or `Resend`), and make rows plain navigations.

### 9. Indigo full-bleed bar spends the CTA colour on an accordion
`.bar.pri` is `var(--primary)` — the DS reserves indigo for CTAs. A filled indigo bar with a `caret-right` reads as "the main action on this page", but it's a disclosure that expands in place. It also sits directly above `.bar.sec`, which looks like the same class of thing but *navigates*.

**Fix:** make both bars the `.bar.sec` treatment; distinguish by icon — `caret-down`/`caret-up` for the expander, `caret-right` for the navigation. Let the footer button be the only indigo thing on screen.

---

## Medium

### 10. Title Case throughout
"Purchase Details", "Commission Breakdown", "View & fill" (ok), "Create Envelope". Radius voice and HIG both specify sentence case.

**Fix:** "Purchase details", "Commission breakdown", "Create envelope".

### 11. `DOCUMENTS (6)` is ALL-CAPS with 0.09em tracking
`.count` uppercases a 13px label. The DS explicitly bans ALL-CAPS UI labels outside specimen chrome.

**Fix:** `Documents (6)` in sentence case, `font:600 13px` — or drop it entirely, since the active tab already says "Documents".

### 12. The add-documents button's label is just "Documents"
`+ Documents ⌄` — the verb lives in the icon. HIG wants the action in the label.

**Fix:** `Add documents`.

### 13. `ph-infinity` does not read as "signature"
The per-row signature button uses the infinity glyph with the Mel gradient. Nothing about it says "send for signature", and the gradient implies Mel authored it.

**Fix:** `ph-signature` or `ph-pen-nib` (both already sanctioned in the DS kit); keep the gradient only if Mel genuinely drafts the envelope.

### 14. The comment chip is a false affordance
`.cmt` renders as a 36px circular chip with a `3` badge inside the Commission Breakdown row — it looks like a discrete button but is `aria-hidden` decoration inside the row link.

**Fix:** either make it a real link to the comments thread (44×44), or demote it to inline text + badge so it stops looking pressable.

### 15. Tab switch is silent for assistive tech
`#count` changes text on switch but is a plain `<p>`. Selection count and list length changes aren't announced.

**Fix:** `aria-live="polite"` on the count element (you already have the pattern on `.toast`).

### 16. Two documents arrive pre-checked, unexplained
`aba` and `bia` load with `on:true`. Nothing says why, and the footer CTA doesn't reflect it.

**Fix:** either start empty, or surface it — `Create envelope (2)` plus a "2 selected · Clear" affordance.

### 17. No Dynamic Type support
All sizes are px with no `rem`/`em` or `font: -apple-system-body` path, so system text-size settings do nothing. Project-wide, but worth recording.

---

## Low

- **Raw hex past the tokens.** `.prev` `#2A2A2E` and `.toast` `#26262A` are both `var(--border)`; `.cbx` border `#737373` is the DS muted-foreground-ish value; `.status`/`.add` text `#cfe6a8`/`#aab0ff` are one-offs. Same issue as item 11 of the index.html review — parity them onto tokens.
- **Empty state is a bare sentence.** `.empty` overrides the shared rich empty (`.e-ic`/`.e-t`/`.e-d`) with "Nothing here yet." — off-voice and inconsistent. Use the shared pattern: icon + "No sent documents" + one line of guidance.
- **`.status` has no `aria-haspopup`/`aria-expanded`** despite the caret implying a menu.
- **h1 is 19px/500 Mona.** The DS puts h1–h3 in Hubot Sans at ≥20px; the Transactions list uses Hubot for `.tx-addr`. The detail-screen title should be the heavier of the two, not lighter.
- **Dark only.** `.screen` hardcodes the dark token set with no `prefers-color-scheme` path, while the DS ships both modes.

---

## Positive notes

- `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` both respected — the fix the index.html review asked for landed here.
- Every interactive element has a `:focus-visible` ring (item 2 aside) and a press-shrink; `prefers-reduced-motion` is honoured.
- Phosphor-only iconography, per the project rule — no mixed libraries.
- Checkbox 44×44 `::before` hit slop is exactly the right technique.
- `aria-label`s on the checkbox, the fill button, the signature button and the Commission Breakdown link are specific and useful ("Commission breakdown — 3 new comments").
- Body text is 15–19px throughout; the only 11px type is the numeric comment badge, which is the sanctioned exception.
- Toast is `role="status" aria-live="polite"` and clears its own timer.
- Purchase-details values use tabular figures and right alignment.

---

## Suggested order

1. Add the back row (`.pg-head` + `.back-btn` → Transactions.html).
2. Replace the `.cbx` focus `box-shadow` with the standard 2px `--ring` outline.
3. Rework the idle CTA: enabled-looking, `Create envelope (n)`.
4. Fix status colour to match the Transactions list.
5. Tab semantics → `role="radiogroup"` filters; add `aria-live` to the count.
6. Hit-slop `.status`, `.prev`, `.fill`, `.sign` to 44×44.
7. Scope selection mode to Documents only.
8. De-indigo the `Purchase details` bar; caret direction per behaviour.
9. Sentence case + "Add documents" + drop the ALL-CAPS count.
10. Signature icon, comment chip, token cleanup.
