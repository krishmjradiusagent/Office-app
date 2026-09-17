# Design review: Commission breakdown.html

Platform: mobile (iOS-framed web mockup, 390×844). Framework: static HTML/CSS + vanilla JS, Radius UI 3.0 tokens, Phosphor icon font.
Reviewed: Sep 15, 2026 · role = Agent, status = Draft.

## Summary

**Good, with real gaps.** This is the strongest screen in the set: contrast passes everywhere I measured (10:1 on the wire alert, 8.2:1 on the plan pill, 6.4:1 on captions), negatives use a true minus sign *and* red rather than colour alone, the confirm flow is properly gated behind a sheet, focus rings and `prefers-reduced-motion` are consistent, and the role→visibility rules are genuinely thought through. The gaps are in **modality** (six sheets, none of them trap focus or lock the page behind, none have a close button), **a fragile fixed header offset**, and **two content bugs where the numbers and labels disagree**.

3 critical, 6 high.

---

## Critical

### 1. Sheets declare `aria-modal="true"` but don't behave modally
Six `role="dialog" aria-modal="true"` sheets, and:
- **No focus trap.** Tab from the last control in the sheet walks straight into the page behind it.
- **No background scroll lock.** `.scroll` keeps scrolling under the open sheet.
- **Background isn't hidden from assistive tech**, so a screen reader can swipe into content the sheet is covering.

> **Design Guideline — Modality**: a modal view must keep the person inside it until they dismiss it; everything behind it is unavailable.

**Fix, in `open()` / `close()`:**
```js
// open
screenEl.querySelector('.scroll').style.overflow = 'hidden';
document.getElementById('scroll').setAttribute('aria-hidden','true');
document.querySelector('.pg-head').setAttribute('aria-hidden','true');
document.querySelector('.abar').setAttribute('aria-hidden','true');
// + keydown Tab handler cycling el.querySelectorAll('button,textarea,[href]')
```
Reverse all three in `close()`. The Tab cycle is ~10 lines and you already track `lastFocus` correctly.

### 2. Sheets have no close button, and the grabber is a false affordance
Every sheet renders a `.grab` pill — the universal "drag me down" affordance — but **no drag gesture is wired**. Dismissal is scrim-tap or Escape only, neither of which is discoverable on a phone. `Implemented Home.html` ships a grabber *plus* drag-to-dismiss *plus* an X; this screen kept the visual and dropped both mechanics.

> **Design Guideline — Make interactive elements obvious**: gestures are accelerators, never the only path.

**Fix:** add a 44×44 close button to `.sh-name` (top-right, `ph-x`, `aria-label="Close"`) on all six sheets. Wire drag-to-dismiss on `.grab` if you want to keep the handle; otherwise remove the handle so it stops promising a gesture.

### 3. The header's height is hardcoded into the scroll offset
```css
.pg-head { position:absolute; /* content-height */ }
.scroll  { padding-top:calc(44px + env(safe-area-inset-top) + 82px); }
```
`82px` is a measured constant for a one-line property string and a short role label. Any of these overlaps the first card: a wrapping address, a longer role name ("Team lead view" is already the widest), or larger system text.

**Fix:** measure it — `ResizeObserver` on `.pg-head` writing `--head-h`, then `padding-top:var(--head-h)`. Or make the head a flex child in normal flow instead of `position:absolute` and let the layout do it.

---

## High

### 4. "8 items · 5 need a wire" — the number is wrong
The Post-split deductions fold contains 8 rows ✓, but only **2** carry the `Wire` tag (SBTC, E&O), and per the auditor-role alert copy only **2 payees are missing instructions**. Nothing in the data supports 5.

**Fix:** `<em>8 items · 2 need wire instructions</em>`, and derive it from the row data rather than hardcoding the string.

### 5. The `.tag` slot carries two different taxonomies at once
Within one fold: `Radius`, `Team`, `External` describe **who the payee is**; `Wire` describes **how it's paid**. Same chip, same position, same size — two unrelated axes. SBTC is therefore tagged `Wire` while TC fee (also a Radius payee needing a wire) is tagged `Radius`.

> **Design Guideline — Color > Best practices**: "Avoid using the same color to mean different things."

**Fix:** pick one axis for the chip — payee (`Radius` / `Team` / `External` / `Title co.`) — and move wire status to a small trailing state icon or a second muted chip (`Wire missing` in amber only when it's actually missing, which is the part the agent needs to act on).

### 6. Five touch targets under 44×44pt with no hit slop
The screen already uses the `::before` slop trick on `.back-btn`, `.rolechip`, `.seg button` and `.sec-head .link` — it just wasn't applied to:

| Selector | Current | What it is |
|---|---|---|
| `.alert .go` | ~16px tall | **"Add wire instructions"** — the one blocking action on the page |
| `button.srow` | 40px | the 5 tappable deduction rows |
| `.btn` | 40px | View / Download / Send to escrow / Add a comment |
| `.cfield textarea` | 44 ✓ | fine |
| `.sheet .act` | 48 ✓ | fine |

**Fix:** add the same `::before { position:absolute; left:0; right:0; top:50%; height:44px; transform:translateY(-50%) }` to `.alert .go`, `button.srow` and `.btn`. `.alert .go` matters most — it's currently the smallest target on the screen and the only thing standing between Draft and Finalized.

### 7. "Ask a change" isn't English
The agent-role secondary action reads **"Ask a change"**.

**Fix:** "Request a change" (matches the `returnSheet` title "Return for edits" better than "Ask for a change").

### 8. "Return for edits" is styled as destructive
```css
.sheet .foot .prim.danger { background:var(--destructive); }
```
Returning a breakdown for edits is a routine workflow step, not data loss. `--destructive` red should mean irreversible.

> **Design Guideline — Buttons**: reserve the destructive treatment for actions that can't be undone.

**Fix:** use the standard `.prim` indigo; if you want it to read as "not the happy path", use the outline `.btn` treatment instead.

### 9. The role switcher sits in the navigation bar
`Agent view ⌄` in the header subrow lets an agent select **Auditor view** and see Radius's own margin. Either it's a prototype demo control — in which case it doesn't belong in product chrome — or it's real, in which case role comes from the account and isn't user-selectable.

**Fix:** if it's for the stakeholder demo, move it to the overflow sheet under a "Demo" separator (or a long-press on the title). If some version is real, the only legitimate control is a *transparency* toggle the brokerage sets, not a role impersonator the agent picks.

---

## Medium

### 10. Tab ARIA in the activity sheet is incomplete
`.seg` is `role="tablist"` with three `role="tab"` buttons, no `role="tabpanel"`, no `aria-controls`, no arrow-key roving `tabindex`. `#feed` swaps silently.

**Fix:** simplest correct version — drop the tab roles, make it `role="radiogroup"` with `aria-checked`, and put `aria-live="polite"` on `#feed`.

### 11. 11px non-numeric labels
`.tag` renders `Radius` / `Wire` / `Team` / `External` at **11px**. The project's own floor reserves 10–11px for numeric badges only.

**Fix:** 12px minimum on `.tag`, height 22.

### 12. 12px captions carry the most important content on the page
`.kv .k em` is 12px — and it's holding the actual explanation of the math: "What your split is taken from", "5% of gross + $495 flat · cap met", "80% of basis · 20% to the team". The DS permits 12px captions, but these aren't captions; they're the reason the agent trusts the number.

**Fix:** 13px on `.kv .k em` and `.cap .cf`. Leave `time`, `.side .sv em` and `.agentrow .ab em` at 12 — those are genuinely secondary.

### 13. No `prefers-reduced-transparency` path
The head and action bar are `backdrop-filter: blur(28px) saturate(180%)`. There's a `@supports not (backdrop-filter)` fallback for capability, but nothing for the accessibility setting.

**Fix:**
```css
@media (prefers-reduced-transparency: reduce) {
  .pg-head, .abar { background:rgba(14,14,16,.98); backdrop-filter:none; -webkit-backdrop-filter:none; }
}
```

### 14. The primary CTA has a coloured glow
`.abar .prim { box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 8px 24px rgba(90,95,242,.34); }`
The DS is explicit: elevation is subtle, `shadow-md` on floating chrome, never heavy, no decorative glows.

**Fix:** `box-shadow:var(--shadow-sm)`. Keep the inset highlight if the glass vocabulary is deliberate (it matches Campaigns.html) — just drop the 24px indigo bloom.

### 15. No Dynamic Type support
Every size is a hard px value, so the system text-size setting does nothing. Combined with issue 3, larger text also breaks the header offset. Project-wide, recorded here.

### 16. Menu/dialog triggers don't announce that they open something
`#roleBtn`, `#moreBtn`, `[data-side]`, `[data-wire]` all open sheets with no `aria-haspopup="dialog"` and no `aria-expanded`. `[data-fold]` buttons have `aria-expanded` but no `aria-controls` pointing at the `.sub` they toggle.

---

## Low

- **Hero figure has a tracking artifact.** `font:700 34px var(--font-hubot); letter-spacing:-.035em` on tabular figures makes the trailing `0` in `$4,980` collide with the glyph before it (visible in the screenshot as an apparent strikethrough). Ease to `-.02em`.
- **`ph-dots-three-vertical`** is the Material overflow orientation; iOS uses the horizontal ellipsis. Switch to `ph-dots-three`.
- **Section headers are 17px Mona.** The DS puts h1–h3 in Hubot at ≥20px. Density is a fair trade-off here, but it's a deviation worth recording.
- **`$` icon next to `$4,980`** is redundant with the value it labels.
- **Dead CSS:** `.btn.fill` is defined and never used.
- **Duplicated inline styles:** the role pill's `height:20px; font-size:11px` is written inline twice in markup and again in `renderFeed()`. Make it `.pill.sm`.
- **`.subrow .prop` is `nowrap` + ellipsis**, so a long address silently eats the closing date — the second most useful fact in the header.
- **Dark only** — `.screen` hardcodes the dark token set with no `prefers-color-scheme` path.

---

## Positive notes

- **Contrast passes throughout.** Wire alert body 10.1:1, alert link 7.7:1, plan pill 8.2:1, captions 6.4:1, white-on-indigo CTA 4.8:1. Nothing I measured fails.
- **Negative amounts use a real U+2212 minus plus red**, so the sign survives colour blindness and greyscale printing.
- **The math is internally consistent.** $1.15M → 2% → $23,000 gross → $11,500 side → −$70 → $11,430 basis → 80% → $9,144 → −$495 −$1,070 −$250 −$2,349 = **$4,980**, and the 8 expanded deduction rows sum to exactly $2,349. That is rare and worth protecting.
- **Confirmation is properly gated** — the irreversible step goes through a sheet that restates the amount and the plan, and the note says what happens next.
- **Focus management is real**: `lastFocus` is captured and restored, Escape closes, the scrim closes, and every interactive element has a `:focus-visible` ring using `--ring`.
- **Hit-slop `::before` pattern is already established** on four selectors — the fix for issue 6 is applying something the file already knows how to do.
- **Role-scoped visibility via CSS attribute selectors** is clean and declarative, and the empty states ("No Radius agent on this side.") are honest rather than padded.
- **`prefers-reduced-motion`** disables the sheet, scrim, toast, chevron and press transitions.
- **`env(safe-area-inset-top/bottom)`** respected in the head, the scroll padding, the action bar, every sheet and the toast.
- **Copy is on-voice**: "Splits, fees and plans are edited on desktop. On mobile you can review, comment and confirm." — calm, specific, sets expectations. Sentence case throughout.

---

## Suggested order

1. Focus trap + background scroll lock + `aria-hidden` on the six sheets.
2. Close button on every sheet (and either wire the grabber or remove it).
3. `--head-h` via `ResizeObserver` instead of the `82px` constant.
4. Fix "5 need a wire" → 2, derived from the rows.
5. Hit slop on `.alert .go`, `button.srow`, `.btn`.
6. "Ask a change" → "Request a change"; de-red "Return for edits".
7. Split the `.tag` taxonomy — payee chip + separate wire-missing state.
8. Move the role switcher out of the nav bar.
9. `prefers-reduced-transparency`; drop the CTA glow.
10. Type floors: `.tag` → 12px, `.kv .k em` / `.cap .cf` → 13px.
11. Radiogroup + `aria-live` in the activity sheet; `aria-haspopup` / `aria-controls` on triggers.
12. Polish: hero tracking, horizontal ellipsis, dead CSS, `.pill.sm`.
