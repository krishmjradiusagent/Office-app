# Design review: index.html

## Summary

Needs work. The design is visually strong and follows Radius UI 3.0 faithfully, but as a native-feeling iOS app it drifts from HIG on touch targets, focus/accessibility, text size, safe areas, and a couple of platform-conflicting patterns (FAB, hidden Mel gestures). No critical blockers, but ~6 items that a HIG-strict reviewer would flag.

---

## Critical — accessibility

### 1. Focus indicators are globally suppressed

```css
button:focus, button:focus-visible { outline: none; }
```

This kills keyboard focus rings for the entire screen. HIG — Accessibility: keyboard focus must be visible. Remove `:focus-visible { outline: none }` and use the DS `--ring` token for a 2px offset ring.

### 2. Touch targets below 44×44pt on 6 controls

HIG minimum on iOS is 44×44pt. Currently:

| Selector | Current size |
|---|---|
| `.icon-btn` (notifications, top-right) | 38×38 |
| `.sheet-x` (bottom-sheet close) | 32×32 |
| `.theme-btn` | ~28–30 tall |
| `.view-all` | `padding: 4px 0` — effectively ~16px tall |
| `.ask-ic` (arrows-out / mic / x in Ask bar) | `padding: 4px` — well under 44 |
| `.tk-check` | 18×18 (checkbox on a task row that isn't itself tappable) |

**Fix:** bring all icon buttons to a 44×44 hit slop even if the visual bullet stays smaller — pad the button, not the icon.

### 3. Body text sizes are below iOS defaults

iOS body is 17pt; captions 13pt min. This design defaults body to 13–14px and drops to 9–11px in many secondary labels (`.blk-lb` 9px, `.doc-due` 9px, `.s-by` 10px, `.stage` 10px, `.tx-specs` 11px, `.meta-name` 12px). Legibility and Dynamic Type scaling both suffer.

**Fix:** bump body to 15–17px on primary text and a 13px floor on any label that carries information — reserve 10–11px for numeric badges only.

---

## High — platform conventions

### 4. Mel FAB is an Android pattern

Bottom-right floating action button is Material, not HIG. iOS typically pins primary actions to the tab bar center or nav bar. Since Mel is central here, the more iOS-native move is to promote it to the tab bar's center slot (as an emphasized round button) or a nav-bar leading action, and drop the free-floating orb.

### 5. Mel's primary interactions are hidden gestures

Long-press to speak, tap → toast, double-tap to open Ask bar. HIG — "Make interactive elements obvious": gestures are fine as accelerators but must not be the only path. Add a visible affordance (a small "Ask" chevron or long-press hint under the orb the first time it's touched).

### 6. No safe-area-insets

Status bar padding is hardcoded (`padding: 16px 22px 4px`) and the dock sits at `bottom: 0` with `padding: 132px` reserved manually on the scroll region. On real iPhones with a home indicator, the dock will collide. Wrap layout in `env(safe-area-inset-top/bottom)` and let the phone's chrome do the work.

---

## Medium — visual system

### 7. Icon libraries are mixed

Nav + Ask bar use Phosphor (`ph ph-house-simple`, etc.); everything else is hand-inlined Lucide-ish SVG. The DS explicitly names Lucide as the sanctioned default (`components/icons/`). Pick one — Lucide per DS — and drop the Phosphor CSS import.

### 8. Casing on "Free Trial"

DS + HIG both say sentence case for UI labels. "Free Trial" → "Free trial".

### 9. Numeric-only badges without a label

The trial pill shows `7` inside a green circle — no unit, no aria-label. Screen readers say "7". Add `aria-label="7 days remaining"`.

### 10. Shortcut copy is off-brand

"Shoot a text", "Jump on a call", "Bring in a new client" — Radius voice is "calm, confident, utility-first — not playful". Retitle to noun/verb pairs consistent with the rest of the page:

- "Add a new client" / "Someone you just met"
- "New transaction" / "From offer to close"
- "Call a client"
- "Send a text"

### 11. Hardcoded colors leak past tokens in dark mode

`.doc-due.today` / `.over` / `.ok` use raw `#33270f`, `#361616`, `#26262b` instead of `var(--warning)` / `--destructive` / `--muted` with alpha. Same class-family works fine in light via tokens — parity it in dark.

---

## Low — polish

- Status bar signal SVG has a `.4` opacity bar — below the 3:1 minimum against neutral-950 for a graphical UI element. Either bump alpha or drop the bar.
- Section headers are 15px semibold — HIG's "Title 3" equivalent is 20pt bold. If you want the density, keep 15px but raise weight to 700 for stronger scan hierarchy.
- Priority clients renders 10 rows in one card — iOS convention is 3–5 preview rows with a "View all" tap-out; you already have the "View all" button, use it.
- Documents-to-sign horizontal scroll has no scroll indicator or edge fade — add a subtle right-edge mask so users know there's more.

---

## Positive notes

- Sheet has a grabber, drag-to-dismiss, scrim tap, and X — full HIG-quality bottom sheet.
- `prefers-reduced-motion` is respected on stagger animation and sheet transition.
- Press-shrink (scale .98/.92) matches iOS haptic-visual feel.
- Sentence case is consistent across section headers, statuses, and CTAs.
- Dark palette is a real second theme, not opacity-hacked.
- Aria-labels present on most icon-only buttons.

---

## Suggested priority order

1. Restore focus rings (1 line).
2. Pad icon buttons to 44×44 (5 selectors).
3. Bump body to 15px, lift every 9–11px label to 12px minimum where it carries meaning.
4. Add `env(safe-area-inset-*)` on statusbar + dock.
5. Consolidate icons on Lucide.
6. Rewrite shortcut copy + "Free Trial" casing.
7. Decide FAB vs tab-bar-center for Mel.
