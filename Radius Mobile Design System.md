# Radius Mobile — design system contract

Drop this file at the root of a new project (as `CLAUDE.md`, or alongside it and reference it) to reproduce the exact look, feel and rules of the Radius Office app mobile screens (Home, Appointments, Tasks, Transactions, Documents, Agent profile).

It is written as a **contract, not inspiration**. Everything below is a hard rule taken from the shipped screens. If a value isn't in here, it isn't in the design.

---

## 0. Read this first — the five rules that stop drift

1. **Tokens only.** No raw hex in component CSS. Every color is `var(--…)` from §2. The only literal hex allowed is inside a token definition, a status tint, or the Mel gradient.
2. **One icon family: Phosphor.** `@phosphor-icons/web` webfont — `<i class="ph ph-house-simple"></i>`. Never mix Lucide, never hand-draw SVG icon paths, never emoji. (The web design system defaults to Lucide; **mobile overrides that** so every glyph shares one optical size.)
3. **Four radii, never a fifth.** badge 6 · input 8 · button 10 · card 14. Pills are `999px`. Bottom sheet is `22px 22px 0 0`.
4. **44×44pt minimum hit area, always.** Pad the button or add a `::before` hit slop — never shrink the glyph and call it done.
5. **13px is the floor for any label that carries meaning.** Body is 15px. 10–11px is reserved for numeric badges only.

---

## 1. Frame, shell, safe areas

```css
.phone  { width:390px; max-width:100%; border-radius:44px; padding:6px;
          background:var(--neutral-900); box-shadow:0 20px 60px rgba(0,0,0,.55); }
.screen { position:relative; border-radius:38px; overflow:hidden; height:820px;
          background:var(--background); color:var(--foreground);
          display:flex; flex-direction:column; }
.scroll { flex:1; overflow-y:auto; padding:0 16px calc(132px + env(safe-area-inset-bottom));
          scrollbar-width:none; }
.scroll::-webkit-scrollbar { display:none; }
.statusbar { display:flex; justify-content:space-between; align-items:center;
             padding:calc(16px + env(safe-area-inset-top)) 22px 4px;
             font:600 15px/1 var(--font); }
```

- Screen gutter is **16px**. Sheet gutter is **18px**.
- Bottom scroll padding reserves the dock: `132px + safe-area-inset-bottom`.
- Never hardcode status-bar or dock offsets — always `env(safe-area-inset-top/bottom)`.
- **Dark mode is a subtree class**, not a media query: put `.dark` (or `data-theme="dark"`) on `.screen` so light and dark can sit side by side on one page.

---

## 2. Tokens — paste this block verbatim

If the Radius UI design system folder is available, link its `tokens/*.css` first and then this override block. If it isn't, this block alone is enough — it is self-contained.

```css
:root {
  /* neutral primitives */
  --neutral-50:#fafafa; --neutral-100:#f5f5f5; --neutral-200:#e5e5e5; --neutral-300:#d4d4d4;
  --neutral-400:#a3a3a3; --neutral-500:#737373; --neutral-600:#525252; --neutral-700:#404040;
  --neutral-800:#262626; --neutral-900:#171717; --neutral-950:#0a0a0a; --white:#fff;

  /* brand */
  --brand-indigo:#5a5ff2; --brand-periwinkle:#7b7ff5; --brand-coral:#f08068; --brand-apricot:#f0a468;
  --mel-gradient: linear-gradient(135deg,#7b7ff5 0%,#5a5ff2 38%,#f08068 78%,#f0a468 100%);

  /* type */
  --font-sans: "Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mona: "Mona Sans", var(--font-sans);
  --font-hubot: "Hubot Sans", var(--font-sans);
  --font: var(--font-mona);            /* everything */
  --font-display: var(--font-hubot);   /* ≥20px display + pull-out only */
  --tracking-tight:-0.02em; --tracking-display:-0.025em;

  /* geometry */
  --radius-xs:2px; --radius-sm:6px; --radius-md:8px; --radius-lg:10px; --radius-xl:14px;
  --radius-2xl:18px; --radius-3xl:22px; --radius-full:9999px;
  --radius-badge:var(--radius-sm); --radius-input:var(--radius-md);
  --radius-button:var(--radius-lg); --radius-card:var(--radius-xl);

  /* spacing (4px grid) */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px;

  /* elevation — subtle, never heavy */
  --shadow-xs:0 1px 2px 0 rgba(0,0,0,.05);
  --shadow-sm:0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
  --shadow-lg:0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);

  /* LIGHT semantic set */
  --background:#fff; --foreground:#0a0a0a;
  --card:#fff; --card-foreground:#0a0a0a;
  --popover:#fff; --popover-foreground:#0a0a0a;
  --secondary:#f5f5f5; --secondary-foreground:#171717;
  --muted:#f5f5f5; --muted-foreground:#737373;
  --border:#e5e5e5; --input:#e5e5e5; --ring:#a3a3a3;
  --primary:var(--brand-indigo); --primary-foreground:#fff;
  --destructive:#dc2626;
  --success:#059669; --warning:#d97706; --activity:#5c619e;

  /* status tints (light) */
  --tint-green-bg:rgba(109,165,68,.14);  --tint-green-fg:#4d7a2b;
  --tint-blue-bg:rgba(37,99,235,.10);    --tint-blue-fg:#1e50c8;
  --tint-amber-bg:rgba(234,88,12,.10);   --tint-amber-fg:#c2410c;
  --tint-red-bg:rgba(220,38,38,.10);     --tint-red-fg:#b42323;
  --tint-indigo-bg:rgba(90,95,242,.10);  --tint-indigo-fg:#4a4fd0;
}

/* DARK semantic set — scoped to a class so subtrees can flip */
:root[data-theme="dark"], .dark {
  --background:var(--neutral-950); --foreground:var(--neutral-50);
  --card:var(--neutral-900); --card-foreground:var(--neutral-50);
  --popover:var(--neutral-800); --popover-foreground:var(--neutral-50);
  --secondary:var(--neutral-800); --secondary-foreground:var(--neutral-50);
  --muted:var(--neutral-800); --muted-foreground:var(--neutral-400);
  --accent:var(--neutral-700); --accent-foreground:var(--neutral-50);
  --border:rgba(255,255,255,.10); --input:rgba(255,255,255,.15); --ring:var(--neutral-500);
  --primary:var(--brand-indigo); --primary-foreground:#fff;   /* indigo in BOTH modes */
  --destructive:#f87171; --destructive-foreground:#fef2f2;
  --success:#10b981; --warning:#f59e0b; --activity:#9298d6;

  --tint-green-bg:rgba(109,165,68,.16);  --tint-green-fg:#a9cf80;
  --tint-blue-bg:rgba(37,99,235,.18);    --tint-blue-fg:#9db9f8;
  --tint-amber-bg:rgba(234,88,12,.16);   --tint-amber-fg:#f2a678;
  --tint-red-bg:rgba(220,38,38,.18);     --tint-red-fg:#f0a0a0;
  --tint-indigo-bg:rgba(90,95,242,.18);  --tint-indigo-fg:#aab0ff;
}

/* glass — dock and Mel orb ONLY. Cards are never glass. */
.dark {
  --glass-border:rgba(255,255,255,.12); --glass-highlight:rgba(255,255,255,.18);
  --dock-fill:rgba(32,32,36,.92);
}
.screen:not(.dark) {
  --glass-border:rgba(10,10,10,.08); --glass-highlight:rgba(255,255,255,.9);
  --dock-fill:rgba(255,255,255,.92);
}
```

**Color law:** near-monochrome neutrals do the work. Color = state, never decoration. Every primary CTA is indigo `#5A5FF2` in both modes — `--foreground` neutral-950 is body text only, never a button fill. Max 1–2 background colors per screen. **No gradients on UI surfaces** — the single sanctioned gradient is `--mel-gradient`, and only on Mel's own identity.

---

## 3. Type scale (mobile — this supersedes the web scale)

| Role | Spec |
|---|---|
| Greeting / screen h1 | `700 28px/1.15 var(--font)`, `letter-spacing:var(--tracking-tight)` |
| Sheet title | `700 17px/1.2`, `-0.01em` |
| Section header (h2) | `600 15px/1.2`, `-0.01em` |
| Row title / name | `600 15px/1.2–1.3` |
| Row title (long, wrapping) | `500 15px/1.3`, `-webkit-line-clamp:2` |
| Body / subtitle | `400–500 15px/1.35` |
| Meta, secondary label | `500 13px/1.25`, `var(--muted-foreground)` |
| Caption / chip / role | `500–600 12px/1` |
| Numeric badge only | `600–700 10–11px/1`, `font-variant-numeric:tabular-nums` |
| Eyebrow (uppercase block label) | `700 12px/1`, `letter-spacing:.08em`, `text-transform:uppercase`, muted |
| Property address (pull-out) | `500 16px/1.25 var(--font-hubot)`, `var(--tracking-tight)` |

- **Mona Sans for everything.** Hubot Sans only ≥16px pull-out text (addresses, display) — never on buttons, labels, inputs, or anything under 16px.
- All money, counts, times, dates: `font-variant-numeric:tabular-nums`, `letter-spacing:0`.
- Long copy gets `text-wrap:pretty`.
- No mono family. No serif.

---

## 4. Iconography

```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
```

- Regular weight by default; **fill** only for an active tab-bar glyph.
- Sizes: **16px** in rows and controls · **20px** in headers · **24px** in empty states · **28px** in the tab bar.
- Icon color is `currentColor`, inherited from a tint class — never set per-icon hex.
- Brand marks (Radius logo, Mel mark) are **assets**, not icons. Never redraw or recolor them.

---

## 5. Components — exact recipes

### 5.1 Card (the base of every surface)

```css
.gcard { border-radius:var(--radius-card); border:1px solid var(--border);
         background:var(--card); box-shadow:var(--shadow-sm); padding:14px;
         transition:transform 160ms cubic-bezier(.23,1,.32,1); }
.gcard:active { transform:scale(.985); }
```

- Card padding is **14px** on mobile (24px is the web value — do not use it here).
- A card that holds separated rows switches to `padding:4px 14px` and lets the rows own their vertical rhythm.
- Cards are **solid**. No `backdrop-filter`, no translucency, no tinted card backgrounds.

### 5.2 Section

```css
section { margin-top:22px; }
.sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.sec-head h2 { font:600 15px/1.2 var(--font); letter-spacing:-.01em; }
.view-all { border:0; background:transparent; color:var(--primary);
            font:600 13px/1 var(--font); padding:4px 0; }
```

`.view-all` needs a 44px hit slop via `::after { position:absolute; inset:…; height:44px }`.

### 5.3 List row (one card, hairline-separated rows)

This is the workhorse pattern for appointments, tasks, and transactions.

```css
.row      { display:flex; gap:10px; padding:14px 0; align-items:flex-start; }
.row + .row { border-top:1px solid var(--border); }
.row-bar  { width:3px; border-radius:var(--radius-sm); align-self:stretch;
            background:var(--border); flex:none; }        /* appointment accent rail */
.row-title{ font:500 15px/1.3 var(--font); -webkit-line-clamp:2; }
.row-meta { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:7px; }
```

Meta line grammar, in order: `initials chip · name · dot separator · location · [Mel wordmark] · [due] · [category icon, margin-left:auto]`.
The dot separator is a literal `·` in a `.mdot` span at `500 13px`, `opacity:.5`.

### 5.4 Initials chip & avatar

```css
.ini    { width:22px; height:22px; border-radius:999px; background:var(--muted);
          color:var(--foreground); font:600 9px/1 var(--font);
          display:inline-flex; align-items:center; justify-content:center; }
.avatar { width:38px; height:38px; border-radius:999px; background:var(--muted);
          border:1px solid var(--border); font:600 15px/1 var(--font);
          display:flex; align-items:center; justify-content:center; }
```

Sizes in use: 16 (doc meta) · 20 (thread) · 22 (row meta) · 24 (inline client) · 32 (compact row) · 36 (card) · 38 (header) · 44 (sheet). Fallback is always initials on a neutral chip — never a generated illustration.

### 5.5 Badges, categories, roles

All pills, `border-radius:999px`, `font:600 11–12px/1`, `padding:4px 8px`.

```css
.cat.warn { color:var(--warning); background:rgba(234,88,12,.14); border:1px solid rgba(234,88,12,.28); }
.cat.pri  { color:var(--primary); background:rgba(90,95,242,.12); border:1px solid rgba(90,95,242,.28); }
.cat.suc  { color:var(--success); background:rgba(109,165,68,.14); border:1px solid rgba(109,165,68,.28); }
.cat.ic-only { padding:0; width:22px; height:22px; border:0; background:none; }  /* glyph only */
```

**Client role colors** (both modes — dark first, light in the `:not(.dark)` override):

| Role | Dark fg / bg | Light fg / bg |
|---|---|---|
| Buyer | `#aab0ff` / `rgba(90,95,242,.16)` | `#4a4fd0` / `rgba(90,95,242,.10)` |
| Seller | `#cdd97e` / `rgba(163,181,52,.14)` | `#6b7a1e` / `rgba(163,181,52,.14)` |
| Both | `#cfaaff` / `rgba(168,85,247,.16)` | `#7c3aed` / `rgba(168,85,247,.10)` |
| Referral | `#7fd9c5` / `rgba(20,184,166,.14)` | `#0f766e` / `rgba(20,184,166,.12)` |
| Tenant | `#f0c778` / `rgba(245,158,11,.14)` | `#b45309` / `rgba(245,158,11,.14)` |

Status pill: `.tx-status` with a 6px `currentColor` dot, `ok` → success tint, `warn` → warning tint. Overdue is always `--destructive` + the word "Overdue", never a bare red dot.

Rule: badge tints are **pale bg + dark fg of the same hue**. Both modes must be token-driven — never leave a raw dark hex behind in the dark theme.

### 5.6 Checkbox (task row)

```css
.tk-check { appearance:none; width:16px; height:16px; border-radius:var(--radius-xs);
            border:1.5px solid var(--muted-foreground); background:transparent; }
.tk-check[aria-checked="true"] { background:var(--primary); border-color:var(--primary); }
/* checkmark via ::before clip-path polygon, scale .4 → 1 over 160ms */
```

Completed task: `text-decoration:line-through; text-decoration-thickness:1.5px; color:var(--muted-foreground)`. The whole row is the target — give the 16px box a 44px hit slop.

### 5.7 Segmented tabs

```css
.tabs { display:flex; gap:var(--space-1); padding:var(--space-1);
        background:var(--muted); border-radius:var(--radius-lg); }
.tab  { flex:1; height:28px; border-radius:var(--radius-md); border:0; background:transparent;
        color:var(--muted-foreground); font:500 13px/1 var(--font); }
.tab[aria-selected="true"] { background:var(--card); color:var(--foreground);
                             box-shadow:var(--shadow-xs); }
```

A selected state must be **obvious** — filled surface + shadow. Gray-on-gray with no selection treatment is a fail. Add a 44px `::before` hit slop.

### 5.8 Bottom sheet

```css
.sheet-scrim { position:absolute; inset:0; background:rgba(0,0,0,.5); opacity:0;
               transition:opacity 240ms ease; }
.sheet { position:absolute; left:0; right:0; bottom:0; max-height:93%;
         display:flex; flex-direction:column;
         background:var(--card); border:1px solid var(--border); border-bottom:0;
         border-radius:22px 22px 0 0; transform:translateY(103%);
         transition:transform 300ms cubic-bezier(.23,1,.32,1);
         box-shadow:0 -12px 40px rgba(0,0,0,.45); }
.sheet.open { transform:translateY(0); }
.sheet-grab i { width:38px; height:4px; border-radius:999px;
                background:var(--muted-foreground); opacity:.4; }
```

A sheet needs **all four** dismissals: grabber + drag-to-dismiss, scrim tap, close button, and Esc. Structure: grabber → head (avatar, name, role pills, close) → optional Mel insight card → tabs → scrolling body → pinned CTA footer with `padding-bottom: calc(14px + env(safe-area-inset-bottom))`. Body panels are grid-stacked and cross-fade in 180ms.

Pinned CTA: full width, `height:46px`, `border-radius:999px`, `background:var(--primary)`, `600 15px` white text, `:active { transform:scale(.98) }`.

### 5.9 Tab bar (dock)

```css
.nav-scoop { position:absolute; left:0; right:0; bottom:0;
             padding:0 14px calc(16px + env(safe-area-inset-bottom)); }
.dock-pill { display:flex; justify-content:space-around; height:64px; padding:0 4px;
             border-radius:999px; background:var(--dock-fill);
             border:1px solid var(--glass-border);
             backdrop-filter:blur(24px) saturate(1.6);
             box-shadow:inset 0 1px 0 var(--glass-highlight), 0 10px 28px rgba(0,0,0,.32); }
.dock-pill .nav-item { width:56px; height:56px; border-radius:999px;
                       color:var(--muted-foreground); font-size:0; }  /* icon-only */
.dock-pill .nav-item.active { color:var(--primary); }
.dock-pill .nav-item.active::before { background:rgba(122,124,255,.14);
                       border:1px solid rgba(255,255,255,.14); }       /* filled pill */
```

- Floating frosted pill, **icon-only**, 28px glyphs, filled pill on selection, `role="tablist"` / `aria-selected`.
- Tabs: **Home · Clients · Transactions · Inbox** (+ Mel). `aria-label` on every icon-only tab.
- The dock is the only frosted-glass chrome in the product. Nothing else blurs.

### 5.10 Mel

Mel is the AI assistant and the **only** place brand gradient appears.

- **Orb / FAB:** 56–58px circle, `background:var(--mel-gradient)` with a 2px padding ring and an opaque inner face (`rgba(10,10,10,.72)` dark / `#fff` + indigo glyph light). Positioned `right:16px; bottom:calc(104px + env(safe-area-inset-bottom))`.
- **States:** idle (mic) → arming (350ms linear ring fill on hold) → listening (conic gradient ring spinning 1.4s) → thinking (3 pulsing dots, ring 2.6s) → speaking (3-bar equalizer + breathing glow) → muted (`--muted` fill, mic-off glyph).
- **Gestures need a visible affordance.** Long-press-to-speak is an accelerator only; always ship a visible entry point (the gradient "Mel suggests" cue, the orb tap, the ask bar).
- **Attribution wordmark** — anything Mel created gets this, never a tinted row background:

```css
.mel-badge .txt { font:600 13px/1.25 var(--font);
  background:linear-gradient(90deg,#F08068 0%,#F0A468 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; }
```

- **Mel accent** in rows/cards is coral, not indigo: `color:#F0A468` on `rgba(240,128,104,.13)`.
- Lift the FAB with a composited transform when the ask bar opens (`--lift:-62px`) — **never animate `bottom`**.

### 5.11 Empty states

Two shapes, both real content — never a shrug illustration.

```css
/* in-card: centered */
.tk-empty { display:flex; flex-direction:column; align-items:center; text-align:center;
            gap:3px; padding:26px 12px 20px; }
.tk-empty .e-ic { width:40px; height:40px; border-radius:999px; background:var(--muted); }
.tk-empty .e-t  { font:600 15px/1.3 var(--font); }
.tk-empty .e-d  { font:400 13px/1.4 var(--font); color:var(--muted-foreground);
                  max-width:32ch; text-wrap:pretty; }

/* section-level: dashed, left-aligned, with an inline CTA */
.sec-empty { display:flex; flex-direction:column; align-items:flex-start; gap:6px;
             padding:18px 16px; border:1px dashed var(--border);
             border-radius:var(--radius-card);
             background:color-mix(in oklab, var(--card) 55%, transparent); }
.sec-empty .e-cta { color:var(--primary); font:500 15px/1.4 var(--font); }
```

Empty is fine. Never invent badges, stats, or filler rows to fill space.

---

## 6. Motion

| Use | Value |
|---|---|
| Standard ease | `cubic-bezier(.23,1,.32,1)` |
| iOS-native ease (sheets, lifts) | `cubic-bezier(.32,.72,0,1)` |
| State change (color, bg) | 120–180ms ease |
| Press shrink | `scale(.985)` rows · `.94–.92` icon buttons · `.98` CTAs |
| Sheet in/out | 300ms |
| Panel cross-fade | 180ms |
| Chevron rotate | 180–220ms |
| Staggered tile entrance | 300ms, 50ms steps, max 4 items |

- Only `transform` and `opacity` animate. Never `bottom`, `height`, `width`, or `top`.
- Expand/collapse uses `grid-template-rows:0fr → 1fr` or a `max-height` cap — not `display`.
- Every animation has a `@media (prefers-reduced-motion:reduce)` off-switch. Non-negotiable.

---

## 7. Accessibility gates (a screen doesn't ship without these)

1. **Focus rings exist.** `outline:2px solid var(--ring); outline-offset:-2px` on `:focus-visible`. Never `outline:none` without a replacement.
2. **44×44pt** on every interactive element. The pattern for small visuals:
   ```css
   .small-target { position:relative; }
   .small-target::before { content:''; position:absolute; left:-8px; right:-8px;
                           top:50%; height:44px; transform:translateY(-50%); }
   ```
3. **Type floors:** 15px body · 13px informational labels · 10–11px numeric badges only.
4. **Safe areas** via `env(safe-area-inset-*)` — top and bottom.
5. **Contrast** 4.5:1 body, 3:1 headline-scale. Full-opacity ink on tints, never alpha-muted text.
6. **`aria-label` on every icon-only control**, and a unit on every numeric badge (`aria-label="7 days remaining"`, not just "7").
7. **`role="tablist"` / `aria-selected`** on tab bars and segmented controls; `aria-expanded` on disclosures.
8. Dark mode uses tokens end-to-end. A raw hex surviving into dark is a bug.

---

## 8. Copy voice

- **Sentence case everywhere** — buttons, headings, nav, labels, statuses. "Free trial", not "Free Trial". Uppercase only for the tracked eyebrow label.
- Calm, confident, utility-first. Not playful, not corporate, never hype. No "Supercharge", "Effortless", "Unleash".
- Address the agent as **you**. Mel speaks in first person, sparingly and specifically ("I can draft the follow-up").
- Labels are plain noun/verb pairs: "Log activity", "New transaction", "Close date", "Send a text". Not "Shoot a text" / "Jump on a call".
- Real-estate accurate: "closing" over "escrow"; appointments ≠ tasks; buyer / seller / lease sides stay separate; "Confirm calculated commission", not "Approve".
- Numbers carry units. Relative time is explicit ("in 48m", "Overdue", "in 2 days").
- **No emoji.** Ever.

---

## 9. Public-facing surface (agent profile / client portal)

The agent profile is a **different surface** from the CRM: warmer, photo-forward, its own scoped token set. It is the only place full-bleed imagery is allowed. The CRM stays dense and photo-light.

```css
.profWrap {
  --p-bg:#FAFAFA; --p-card:#FFF; --p-cardBd:#E5E5E5; --p-line:#E5E5E5;
  --p-title:#0A0A0A; --p-name:#0A0A0A; --p-body:#404040; --p-mut:#737373;
  --p-chip:#F5F5F5; --p-chipBd:#E5E5E5; --p-chipTx:#171717; --p-btnBd:#E5E5E5;
  --p-ind:#5A5FF2;
}
body.dark .profWrap {
  --p-bg:#0A0A0A; --p-card:#171717; --p-cardBd:#262626; --p-line:#262626;
  --p-title:#FAFAFA; --p-name:#FAFAFA; --p-body:#D4D4D4; --p-mut:#A3A3A3;
  --p-chip:#262626; --p-chipBd:#404040; --p-chipTx:#E5E5E5; --p-btnBd:#404040;
}
```

Patterns: `.pCard` (14px radius, 16px padding, `shadow-xs`) · floating frosted back/action buttons (38px, `blur(24px) saturate(180%)`) · horizontal snap rails for listings (`flex:0 0 232px`, `scroll-snap-align:start`, 132px image) · secondary button `height:44px; border-radius:10px` · slide-in via `transform:translateX(100%) → 0` at 280ms `cubic-bezier(.32,.72,0,1)`. Star ratings are `#EA580C`.

---

## 10. Anti-patterns — instant rejection

- Raw hex in a component rule.
- A fifth radius value, or one radius applied to everything.
- Lucide, Feather, hand-drawn SVG icon paths, or emoji as icons.
- Glass/blur on a card. Glass is dock + Mel orb only.
- A gradient on any surface that isn't Mel's identity.
- `outline:none` without a focus replacement.
- 9–12px text on a label that carries information.
- Hardcoded status-bar or dock offsets.
- Animating `bottom` / `height` / `width`.
- Filler: invented stats, decorative icons, placeholder rows, a stat card nobody asked for.
- Title Case anywhere.
- A selected tab with no visible selected state.
- Android patterns on an iOS surface: bottom-right FAB as the only primary action, Material ripples, hamburger navigation.

---

## 11. Pre-ship checklist

- [ ] Every color resolves to a token; light **and** dark verified side by side.
- [ ] Radii are only 6 / 8 / 10 / 14 / 999.
- [ ] All icons are Phosphor at 16 / 20 / 24 / 28.
- [ ] No text under 13px except numeric badges.
- [ ] Every tappable thing measures ≥44×44.
- [ ] Focus rings visible on keyboard tab-through.
- [ ] `env(safe-area-inset-*)` on the status bar and the dock; content clears the dock.
- [ ] `prefers-reduced-motion` respected.
- [ ] Sentence case everywhere; no emoji; copy passes the "calm and specific" read.
- [ ] Empty state exists and is real content.
- [ ] Mel's gradient appears only on Mel; Mel-created rows carry the wordmark.
