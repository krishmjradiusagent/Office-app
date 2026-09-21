# Project notes

## Read `change-protocol.md` first — it gates every edit
`change-protocol.md` (project root) requires a plain-text plan + ASCII wireframe in chat and an
explicit "yes / go ahead" before any file is touched. It overrides everything below it and every
other instinct. Read it at the start of every conversation in this project.

## Two versions live in this project — keep them apart
Entry point for everyone: `Office.dc.html` (version picker). `index.html` is a redirect to it — the picker is what opens by default.

**Implemented design (for developers)** — everything in the project root: `Implemented Home.html` (formerly `index.html`), `Appointments.html`, `Tasks.html`, `Transactions.html`, `Documents.html`, `Agent profile.html`, `assets/`.
- This is what engineering is building. It is **frozen**: edit only to fix a bug a developer reports, never to add or redesign anything.
- Developers should keep linking to these files directly; the picker is optional for them.

**Redesign (for stakeholders)** — everything under `redesign/`.
- For showing agents and leadership the next direction. **Not approved for development** — never move redesign screens into the root, never reference root CSS/JS from `redesign/`, and never link a redesign file from a root screen.
- New redesign screens get listed on the redesign card in `Office.dc.html`.

When a request is ambiguous about which version it targets, ask before editing.

## Never be lazy on design work
I would never be lazy. When asked for an audit or a review:
- Audit the **whole screen**, not just the crop in the shared screenshot — the crop is the entry point, never the scope.
- Work the severity ladder in order: accessibility → platform conventions → visual → interaction → content. Criticals get fixed before polish, always.
- "Do all the changes it suggests" means **all** of them, including the structural ones (focus traps, scroll locks, close buttons, dynamic measurement) — not just the CSS one-liners.
- Every finding cites the principle it violates and lands as a real code change in the file, not as advice.
- Re-check the review docs in this project for items already logged and still unfixed before claiming a screen is done.

## Design review reference
`design-review-index-html.md` (project root) holds the HIG/accessibility design review of `Implemented Home.html` (was `index.html`). Consult it before editing `Implemented Home.html` or building similar mobile screens, and follow its fixes:
- Never suppress focus rings; use the DS `--ring` 2px offset ring.
- All touch targets ≥ 44×44pt (pad the button, not the icon).
- Body text ≥ 15px; 13px floor on informational labels; 10–11px reserved for numeric badges only.
- Use `env(safe-area-inset-top/bottom)` for status bar and dock.
- **Phosphor icons only** (no Lucide mixing). Use the `@phosphor-icons/web` font (`<i class="ph ph-name">`) so every glyph shares one optical size — never hand-drawn SVG paths.
- Sentence case everywhere; calm, utility-first copy.
- Dark mode uses tokens (`--warning`, `--destructive`, `--muted`), not raw hex.
- Mel: prefer tab-bar-center placement over a floating FAB; gestures need a visible affordance.
