# Radius Campaigns — Web build spec

**What this file is.** A complete, literal record of the Campaigns feature as built on web (`index.html`, Radius CRM shell). It exists so another project can build the **mobile** version of *everything* below — same product model, same states, same copy, same data — with nothing invented and nothing dropped.

**How to use it.**
1. Read §1–§3 (model, rules, screen inventory) before designing anything.
2. Copy the data in §9 verbatim — same names, same numbers. The numbers are internally consistent (funnels add up); changing one breaks others.
3. Use the copy in §10 verbatim. All product copy is sentence case, no emoji, no exclamation marks.
4. Mobile visual/interaction rules come from **`Radius Mobile — design system contract`** (the mobile md). This file says *what* the screens do; that file says *how* mobile looks. Where they conflict, the mobile contract wins on form, this file wins on content and behaviour.
5. Every web screen and every state in §4–§8 must exist on mobile. §11 gives the required mobile screen list and the adaptation notes for the four hard cases (rail, funnel, board, 3-pane filter builder).

---

## 1. Product model — read this first

Campaigns has exactly **two kinds of outbound**, and the whole design turns on keeping them separate:

| | **Send once** | **Campaign rules** |
|---|---|---|
| What it is | One message, one time | An ongoing conversation Mel runs |
| Who gets it | A snapshot of who matches *now* | Anyone who matches, now or later — they join automatically |
| After it goes | Nothing follows | Mel keeps following up, adapts, hands back when someone is ready |
| Object created | A sent message with results | A running campaign with stages, pace, playbook |
| Verb in UI | "New message" (secondary button) | "New campaign" (primary indigo button) |

**The one rule that governs everything:** *A client only ever hears from one campaign at a time.* Every overlap surface in the product exists to serve that rule:
- Send once: matched clients who are mid-conversation in a campaign are shown and can be **excluded** (41 of 318 in the reference data).
- Campaign rules: matched clients **held** by another campaign are shown and can be **moved** (312 of 1,844) — moving stops the other campaign for that person; leaving them means they join when it finishes.
- Board/table: overlaps surface as a "Waiting on you" state and a Mel suggestion.

**Other model facts:**
- Total client book = **4,109**.
- Reply-rate **target = 6.0%**. Pips/bars fill against it. On the board's info popover the bar scale is described as running to 20% reply rate ("a full bar is one in five replying").
- Campaign lifecycle states: **Running · Waiting on you · Paused** (+ **Draft** for an unstarted campaign).
- "Doing now" = what Mel is doing at this moment for that campaign (e.g. "Offering a valuation"). It is a *stage*, and a campaign moves itself between stages as clients progress. The four board stages are: **Introducing Mel · Following up · Offering value · Handed back to you**.
- Campaign categories (alternate board grouping): **Nurture · Farm · Post-close · Re-engage**.
- Mel stops the moment a client replies, and pauses the agent's other campaigns for that person. One-off messages sit outside that rule.
- Mel writes the first message per client **when the campaign starts** — nothing goes out before the agent presses start.
- A campaign's playbook is optional. With one, Mel leads with it; without one, Mel works from the agent's past messages to similar clients. **The agent's typed instructions beat the document wherever they disagree.**

---

## 2. Design rules actually used on web

These are the project rules (`CLAUDE.md`) the web build follows. Mobile keeps all of them except where the mobile contract overrides geometry.

- **Tokens:** neutral 50→900 (`#fafafa #f5f5f5 #e5e5e5 #d4d4d4 #a3a3a3 #737373 #525252 #404040 #171717`), white; primary indigo **`#5a5ff2`**; destructive `#dc2626`; status green `#6da544`, blue `#2563eb`, yellow `#d9a514`, orange `#ea580c`.
- **Mel gradient (identity only):** `linear-gradient(135deg,#7b7ff5 0%,#5a5ff2 38%,#f08068 78%,#f0a468 100%)`. Never on filters, tabs or generic CTAs.
- **Radii:** badge 6 · input 8 · button 10 · card 14.
- **Type:** **Mona Sans only** (400/500/600/700). No Hubot, no mono — tabular numbers via `font-variant-numeric: tabular-nums`. Body 14/20 on web.
- **Icons:** **Phosphor webfont only** — `<i class="ph ph-…">`, sized with `font-size`, coloured with `color`. No Lucide, no hand-drawn SVG paths. (Exceptions in the web file: the legacy sidebar SVGs, the 4-point Mel sparkle path, and the Google `g` mark asset.)
- **Tabs:** one canonical segmented pill — track `background:var(--neutral-100); radius 12px; padding 4px; gap 2px`, hugging content. Unselected 28px tall, `0 14px`, radius 9px, 600/13px, neutral-600. Selected: white fill, 700 weight, neutral-900, 1px neutral-200 border, `0 1px 2px rgba(10,10,10,.06)`. Overflow is a text item `More ⌄`, never an icon-only button.
- **Mel suggestion chip** (`.melsugchip`) — the only way a Mel action is offered: 34px min-height, `border:1px solid #E4E4FB`, radius 12px, `background:linear-gradient(100deg,#F7F7FE,#FCFAFD 48%,#FFFBF8)`, 500/13px; leads with a **static 4-point sparkle** at `#6D6EF3` (`M12 2c.6 5 4 8.4 9 9-5 .6-8.4 4-9 9-.6-5-4-8.4-9-9 5-.6 8.4-4 9-9z`), label in a span with the Mel gradient clipped to text. No animation on the sparkle, ever. Labels wrap rather than clip.
- **No accent rails.** Never a coloured left-edge stripe for selected/active/highlight. Selection = background + weight/colour (e.g. `#f5f5ff` row tint + an indigo "Previewing" label).
- **Notification dot:** 8px, `--destructive`, `box-shadow:0 0 0 2px var(--white)`, at the control's outer top-right corner. Always red.
- **Containment:** `repeat(N,minmax(0,1fr))`, every child `min-width:0; overflow:hidden`, ellipsis on any `nowrap` label. Vertical scroll only inside panels.
- **Elevation:** `xs` on inputs/outline buttons, `sm` on cards, `md` on menus/popovers. Never heavy.
- **Motion:** 120–180ms ease; press-shrink `scale(.98)`; overlays fade+rise 10px in 160ms; a changed number flashes once.
- **Silent-failure rule:** no empty `catch{}` — log `console.warn('[fn] reason')`.

---

## 3. Screen inventory (web) → what mobile owes

| # | Web surface | Type | Mobile owes |
|---|---|---|---|
| 1 | **Campaigns — tables layout** (`#camp-page`) | Full page: lead paragraph + two sectioned tables | A screen with the same two sections as lists |
| 2 | **Campaigns — board layout** (`#camp-page-2`) | Full page: tabs, toolbar, summary strip, Mel row, kanban board **or** rules table, + Send once table | Campaigns home: segmented tabs, stat strip (h-scroll), Mel chips, stage sections/carousel, campaign cards |
| 3 | **Send once composer** (`#soov`) | Full-screen overlay, 3 states: **empty / filled / sent report** | 3 mobile states — audience step, compose step, results screen |
| 4 | **Campaign rule editor** (`#cmov`) | Full-screen overlay, 2 modes: **new / edit**; 3 sections + right rail | Multi-step / sectioned mobile screen with the same 3 sections and the rail content relocated |
| 5 | **Overlap sheet** (`#cm-sheet`) | Right sheet over the editor | Bottom sheet |
| 6 | **Filter builder** (`#cm-fb`) | 3-pane modal: field → condition → preview | Stacked/step sheet, same three steps |
| 7 | **Playbook review — "What Mel took"** (`#cm-pr`) | Full-screen overlay over the editor | Full-screen sheet |
| 8 | **Row actions menu** (`#rt-rowmenu`) | Anchored popover | Bottom action sheet |
| 9 | **Toasts** (`#so-toast`, `#cm-toast`) | Bottom-centre toast, optional 60s countdown + Undo | Toast above the dock, same countdown |
| 10 | Filter menu, info popover, view switch, sort menu, "from" account menu, gap/cap menus, add-filter menu | Popovers | Sheets or inline pickers |

---

## 4. Screen 1 — Campaigns, tables layout

Shell: sidebar (Campaigns active, `ph-megaphone`) + `.content`.

**Page head** (single line, never wraps): sidebar toggle · divider · title **Campaigns** · count pill **5** · spacer · `Activity` button (`ph-clock-counter-clockwise`) · overflow `⋮` menu → **Export results** (`ph-download-simple`), **Mel defaults** (`ph-sliders-horizontal`).

**Lead:** "Reach a set of clients once, or set Mel to work on them over time."

### Section A — Send once
Header: icon `ph-envelope-simple` (neutral tint) · **Send once** · "One message, one time. Pick who gets it, write it, send it. Nothing follows." · secondary button **+ New message**.

Table columns: **Message** (name + filter summary beneath) · **Type** (sent date) · **Sent** (recipients) · **Recipients** (pips + `replies · rate`) · action link **Duplicate**. Three rows (see §9.2, first three).

### Section B — Campaign rules
Header: icon `ph-repeat` (indigo tint) · **Campaign rules** · "An ongoing conversation. Mel keeps following up, adapts to what each client is actually doing, and hands back when someone is ready for you." · primary button **+ New campaign**.

Table columns: **Campaign** (status dot + name, filter summary beneath) · **Audience** (`1,378 in` + shared line, e.g. "287 shared with Spring sellers" / "312 of 1,844 held elsewhere") · **Doing now** (Mel sparkle + stage) · **Reply rate** (pips + `64 · 4.6%`) · link **Open**. Three rows: Follow up to initial contact, Spring sellers — Inland Empire, Post-close 12-month check-in (paused → dot `off`).

Footnote (`ph-info`): "Pips fill against the 6.0% reply-rate target. A client only ever hears from one campaign at a time. Where two overlap, you choose which one keeps them."

Clicking a campaign name or **Open** → campaign editor in *edit* mode. Clicking a Send once name → composer prefilled with that message (editable, re-sendable).

---

## 5. Screen 2 — Campaigns, board layout (the main screen)

**Page head:** toggle · **Campaigns** · count **16** · spacer · `Activity` · secondary **+ New message** · primary **+ New campaign**.

**Tab row:** segmented tabs **Campaign rules | Send once**. Right cluster, in order:
1. **Overview** pill (`ph-chart-line` + caret) — collapses/expands the summary strip; caret flips up/down.
2. **Search campaigns** input (magnifier, clear ✕).
3. **Info** `ph-info` → popover "How this board works" as a definition list:
   - *Columns* — "What Mel is doing right now. A campaign moves itself as clients progress."
   - *Reply bars* — "Bars run to a 20% reply rate, so a full bar is one in five replying."
   - *Overlap* — "A client only ever hears from one campaign at a time."
4. **Filter** `ph-funnel` with count badge → menu, heading **Status**, three checkbox rows with live counts: **Running · Waiting on you · Paused**; footer **Clear all** (disabled when empty) + "*16 shown*".
5. **View switch** (table / board icons, `aria-pressed`) — only visible when the board view is enabled and the Rules tab is active.

### 5.1 Summary strip — 6 stat cards
`repeat(6,minmax(0,1fr))`, gap 8. Each card: uppercase 10.5px label with a 22px tinted icon square, 23px/700 tabular value, and a footer line separated by a 1px rule with a trend arrow.

| Label | Icon / tint | Value | Footer |
|---|---|---|---|
| In campaigns | `ph-users-three` indigo `#eef0fe/#4649cf` | 14,337 | 1,102 shared ↑ |
| Reply rate | `ph-chats-circle` green `#eaf3e6/#4f7a31` | 5.8% | 6.0% target ↓ *(bad, red arrow)* |
| Messages sent | `ph-paper-plane-tilt` violet `#f3eefc/#6b4bab` | 4,180 | Past 7 days ↑ |
| Appointments | `ph-calendar-check` amber `#fdf3e3/#946512` | 68 | 12 this week ↑ |
| Opt-outs | `ph-user-minus` neutral | 0.4% | 31 in 30 days ↓ |
| **To resolve** *(button)* | `ph-warning` red `#fdecec/#b02525` | 2 | 1 new this week ↑ *(bad)* |

### 5.2 Mel suggestion row
Two `.melsugchip`s:
- "312 clients sit in two campaigns — pick who keeps them"
- "12 replies waiting since Friday — draft answers"

### 5.3 Board
Four columns, each with a header: state dot · bold stage name · count pill. Empty column shows "Nothing here".
Columns (stage grouping): **Introducing Mel (4) · Following up (5) · Offering value (4) · Handed back to you (3)**. Alternate grouping by category re-labels the same four columns to **Nurture · Farm · Post-close · Re-engage** and re-sorts the cards.

**Card anatomy** (`role="button"`, keyboard focusable, `data-state=ok|warn|paused`, `data-stage`, `data-cat`):
1. Top row: 
 category icon square — Nurture `ph-user-plus`, Farm `ph-map-trifold`, Re-engage `ph-arrow-u-up-left`, Post-close `ph-house-line` — plus the campaign name.
2. Metric block (one of four variants, see below).
3. `Next send Thu 09:00 · 34 joining` (or "Sends within 4 min of enquiry · 12 today", "Holding until rates move · 0 queued", "Sends daily 07:00 · 1,860 active", "No sends while paused").
4. Performance line: **64 replies** / "of 1,378 · 4.6%".
5. Optional shared line: "287 shared with Spring sellers".
6. Optional alert line (`ph-warning`): "312 clients overlap Rate-drop watchers" / "12 replies waiting since Friday"; quiet variant with `ph-pause`: "Paused 12 Aug by you".
7. Actions: pause button, open button (caret). Paused cards get a `Paused` chip and a dimmed card.

**Metric variants** (a design choice that must exist on mobile too — pick one, keep it consistent):
- **Text** — 5 pips + `4.6%` + delta chip "↓ −1.4 vs target".
- **Bar** — deviation track with a centre tick; fill left/right of target, `--l/--w` percentages; % label.
- **Pips** — 5 pips + %.
- **Ring** — 28px SVG ring, `stroke-dasharray` against 69.115 circumference, tick mark when at/over target, `4.6%` + "of 6.0%".

**Board style variants:** *Wells* (columns in tinted wells — default), *Plain* (no wells), *State* (state-coloured treatment).

### 5.4 Rules table (table view of the same 16 campaigns)
Columns: **Campaign** (name + one-line filter summary, `title` = same text) · **Doing now** (sparkle + stage) · **Audience** (right-aligned number, sortable via `data-v`) · **Reply rate** (10 pips + `64 · 4.6%`) · **Status** (pill button with caret: `Running` / `Waiting on you` / `Paused`) · row `⋮`.
Empty state: "No campaigns match these filters."

**Row menu** (`⋮`): **Edit** (`ph-pencil-simple`) · **View playbook** (`ph-book-open-text`) — becomes **Upload playbook** (`ph-upload-simple`) when the campaign has none · **Pause** (`ph-pause`) — becomes **Resume** (`ph-play`) when paused · **Duplicate** (`ph-copy`) · separator · **Delete** (`ph-trash`, destructive).

### 5.5 Send once tab
Mel line above the table: sparkle + "Mel says: One message, one time. Pick who gets it, write it, send it. Nothing follows."
Table columns: **Message** (name + filter summary) · **Type** (`Email` with Google mark / `Text` with `ph-chat-circle`) · **Sent** · **Recipients** · **Replies** · **Reply rate** (pips + %) · `⋮`. Six rows (§9.2).

---

## 6. Screen 3 — Send once composer

Full-screen overlay (`z 400`), fades in and rises 10px. Esc closes. Three states, driven by `data-state`:
- **`empty`** — nothing picked yet (first-run)
- **`filled`** — audience + draft ready (default)
- **`report`** — an already-sent message, read-only + results

### 6.1 Head (64px)
Back caret (tooltip "Back · esc") · title **Send once** (in report: the message name) · badge **Draft** / **Sent** (green) · subtitle line, per state:
- filled: "**318** recipients · ⚠ *41 mid-conversation*" (button; after excluding → "✓ 41 excluded", muted)
- empty: "Pick who gets it to see the count here"
- report: "Sent to 277 · today, 4:12 PM"

Right actions: **Send to me first** (disabled in empty) · primary **Send to 318 clients** (`ph-paper-plane-tilt`, label tracks the count, disabled at 0). If no sending account is connected, the primary becomes **Connect Google to send** and the subtitle shows "⚠ No email connected". In report: **Duplicate** + **Close**.

### 6.2 Card 1 — "Who gets it" (report: "Who got it")
Header icon `ph-users-three`; link **Start from a smart list** → becomes **Save as a smart list** once filters exist.

**Filter well:** label "Filters" then chips. Chip = family icon + key + operator + value + `⋮` menu (**Change value** `ph-pencil-simple` / **Keep only this one** `ph-crosshair-simple` / sep / **Delete filter** `ph-trash`, destructive). Then **+ Add filter** → menu of fields. Empty state: "No filters yet" + Add filter. Report state: static chips + a muted chip "Excluded — 41 mid-conversation".

**Funnel** — the only place audience maths is narrated. Steps chained with `ph-caret-right`, each step = big number + caption:
`4,109 everyone → 532 luxury tag → 318 cold 30d+` and, if excluded, `→ 277 41 excluded`.
Empty state: single step `4,109 / everyone — narrow it down`. Zero results get a `zero` treatment.
Hovering a step highlights the chip that caused it (mobile: tap-to-highlight, or drop the interaction and keep the chain).

### 6.3 Card 2 — "What it says"
Header icon `ph-pen-nib`; channel badge (Email / Text).

**Mel row:** label "Mel read the 318 — three ways in" (with no filters: "Add a filter and Mel will draft from who's in it") + three `.melsugchip` subject suggestions.

**Not-connected bar** (when applicable): ⚠ "No sending account connected. Connect the inbox you send from — nothing goes out until you do." + primary **Connect Google**.

**Headers block** (key/value rows):
- **From** — "Ashutosh iOSacc `<ashutosh@radiusagent.com>`" + caret → account menu (`ashutosh@radiusagent.com` picked, `team@caliberrealty.com`, sep, **Connect another account**) + `Gmail` brand badge. Not connected: "No account connected" + "⚠ Not connected".
- **To** — chip `ph-users-three` **318** clients. Empty: "Nobody yet — add a filter above".
- **Subject** — the subject text. Empty placeholder: "What is this about?". (Hidden when channel = Text.)
- Report adds "delivered 12 Aug 2026, 4:12 PM" next to **To** and is fully read-only.

**Body:** "Hi *first name*," where the merge token live-updates to the selected recipient's first name; two paragraphs; signature block "Ashutosh iOSacc · Radius Agent Realty" + **Unsubscribe** (email) / "Reply STOP to opt out" (text).
Empty placeholder body: "Write your message. Type `{{` for a merge field — your signature and an opt-out are added for you."

**Footer:** tool row — Bold, Italic, Link, sep, Attach, Image, Insert field (`ph-brackets-curly`, tooltip "Insert a field — or type {{"); text channel replaces attach/image with "142 of 160 characters · 1 message". Right: segmented **Email | Text**. Report: "Sent from your Gmail · today, 4:12 PM".

### 6.4 Right rail
- **filled:** "Going to" / **318** / "of your 4,109 clients"; then the recipient list — 5 rows (avatar initials, name, one-line context, "Previewing" label on the selected row), footer "Showing **5** of 318" + **Show 3 more** / **Show fewer** (8 max), hint "↑ ↓ or click a row to preview". Selecting a row is what drives the merge token in the body.
- Then the **conflict callout**: ⚠ "41 of these are mid-conversation in **Follow up to initial contact**." + action **Exclude these 41**. After excluding: ✓ "41 excluded — they stay with **Follow up to initial contact**." + **Undo**. The head badge, funnel, counts and send label all update together.
- **empty:** "Going to / No one yet / Add a filter to pick who gets it" + empty block `ph-user-list` "Nobody picked yet — Add a filter and the people who'd get this show up here."
- **report:** "Results / 11 / replies from 277 sent"; stat rows **Delivered 277 · Opened 164 (59%) · Replied 11 (4.0%) · Opted out 2 (0.7%)**; reply list (Priya Raman "Is it still available?", Lena Osei "Send me the address", Marcus Tan "Can we see it Saturday?") with "Showing 3 of 11"; full-width Mel chip "Draft follow-ups to the 11 who replied".

### 6.5 Behaviours
- **Autosaving draft row:** ~900ms after the composer opens in `filled`, a **Draft** row is inserted at the top of the Send once table behind the overlay — subject as name, current filter summary as the meta line, live recipient count, `—` for replies, link **Resume**. The head badge shows **Draft**.
- **Send + undo:** pressing send shows a bottom toast "Sending to 318 clients" with a **60s** countdown and **Undo**. On expiry the draft row commits to a sent row (flash highlight) with today's date and empty pips ("Collecting"). Undo cancels. With the undo window off, it sends immediately with a 2.6s confirmation toast.
- **Reopen = edit and send again:** clicking a past message name prefills the composer from a library of six messages (filters, subject, body, three Mel suggestions) — see §9.3. Row name tooltip: "Edit and send again".
- Keyboard: Esc closes; ↑/↓ move the recipient preview (filled only).

---

## 7. Screen 4 — Campaign rule editor

Full-screen overlay. Two modes: **new** (blank, gated) and **edit** (existing campaign).

### 7.1 Head
Back caret · title: campaign name (edit) **or** a name input "Name this campaign" (new) · **Unsaved** badge when dirty.
Subtitle — edit: `● Running · started 14 Aug · **1,532** in`. New: "No one yet — add a filter to see who joins", which becomes "**1,532** would join · email and text · one message every 4 days" as choices are made.
Actions — edit: **Pause** (`ph-pause`, toggles to Resume) + primary **Save changes** (disabled until dirty). New: ghost **Save draft** + primary **Start campaign** (disabled until *named* **and** *at least one filter*).

### 7.2 Section nav (sticky left)
Three items with dots, scroll-spied: **Who joins · Your playbook · How often, and where**.

### 7.3 Section — Who joins
Card icon `ph-users-three`, info tooltip: "Anyone who matches later joins automatically."
Filter well identical to Send once (chips + `⋮` per-chip menu + **Add filter**), with the add menu offering **Tags · Owns property · Owned for · Area · Consent**, separator, **Browse all fields** (`ph-sliders-horizontal`) → opens the filter builder.
Funnel: `4,109 everyone → 3,020 farm-2026 tag → 1,844 owns property → 1,532 in — 312 held elsewhere`. Last step caption is "in this campaign" when nothing is held.
**Overlap callout:** ⚠ "**312** of these **1,844** are already in another campaign. They stay where they are unless you move them — a client only ever hears from one." + **Review the 312** + "Held by **Follow up to initial contact** (287) and **Post-close, 12-month check-in** (25)".

### 7.4 Section — Your playbook
Card icon `ph-book-open-text`, info tooltip: "What Mel read, and what it took from it. Yours beats the document wherever they disagree."
Header actions: **Add instructions** (`ph-note-pencil`) · **Add a file** (`ph-upload-simple`).

*Has content:*
- File row: PDF icon, **Inland Empire seller script.pdf**, "6 pages · read 14 Aug", link **See what Mel took ›**, remove ✕.
- Four take tiles: **3 openers** (`ph-chats-circle`) · **5 questions** (`ph-question`) · **4 tone rules** (`ph-crosshair`) · **4 handoffs** (`ph-sign-in`). Each opens the review at that section.
- Legend: "3 from your notes" (`ph-note-pencil`) · "13 from the document" (`ph-file-text`).
- Instructions editor (inline, toggled): label "Type what Mel should do", textarea placeholder "Lead with the March market shift. Keep it under 80 words. Never quote a price.", hint "Your instructions beat the document wherever they disagree.", **Cancel** / primary **Save instructions** (disabled while empty). Saved notes become rows in the playbook list.
- File input accepts `.pdf,.doc,.docx,.txt,.rtf,.md`, multiple.

*Empty:* drop zone `ph-file-arrow-up`, **"Add a script, listing sheet, or your notes"**, "Mel reads it and leads with it. Without one, Mel works from your past messages to clients like these.", buttons primary **Add a file** + **Add instructions**.

### 7.5 Section — How often, and where
Card icon `ph-paper-plane-tilt`, info tooltip: "Mel stops the moment they reply, and pauses your other **campaigns** for that person. One-off messages sit outside this."
- **Channels** — three checkbox rows: **Email** (Gmail mark), **Text** (`ph-chat-teardrop-text` 1,341), **In the app** (`ph-device-mobile` 203). Email + Text on by default.
- **Pace** — one sentence with two inline dropdowns: "At most one every **[4 days ⌄]**, up to **[6 ⌄]** in total." Gap options 2/4/7/14 days; cap options 3/6/9 messages / No cap.

### 7.6 Right rail
- **In this campaign**: **1,532** (flashes when it changes) / "1,844 match · 312 held elsewhere". Empty: "No one yet — Add a filter and the people who would join show up here."
- Mel chip: "Draft replies for the two waiting on you".
- **Where they are** (`ph-flow-arrow`): Not contacted yet **388** (25%) · Mel has written **1,004** (66%, indigo) · Replied **96** (6%, green) · Opted out **44** (3%, red).
- **Clients** (`ph-users-three`) with a sort/filter button ("Newest first"): menu — *Sort*: Newest first / Oldest first; *Channel*: Email and text / Email only / Text only. List rows: avatar, name, channel icon + "Joined 2h ago", open caret, and the last message beneath (see §9.5). Footer "Showing **20** of 1,532" + **View all**. With no filters: "Nobody has joined yet. They show up here the moment they do."
- **new mode only — Before it starts:** checklist rows **Who joins** (`—` → "1,532 in" / "Not set") · **Playbook** ("Optional") · **Channels** ("2"), then "Mel writes the first message per client when the campaign starts — nothing goes out before you press start."

### 7.7 Overlap sheet (`Review the 312`)
Right sheet + scrim. Head: "**312 held by another campaign**" / "Move them here and their other campaign stops for them. Leave them and they join when it finishes." ✕.
Two groups, each with a header (campaign name, "287 clients · mid-conversation" / "25 clients · check-in due") and two buttons **Leave** / primary **Move 287 here**, plus sample client rows (Priya Raman "Mel wrote 2 days ago · no reply", Marcus Tan "Replied last week", Sofia Nunes "Joined 3 days ago"; Tom Brar "Closed 13 months ago", Ines Marchetti "Closed 12 months ago").
Footer: "**1,532 will join · 312 stay put**" (recomputes as groups are moved) + **Done**. Moving a group updates the held count, the rail, the funnel and the callout.

### 7.8 Filter builder (`Browse all fields`)
Modal + scrim. Head: `ph-users-three` badge · "**Who joins**" / "The same filters you use in the CRM" · **Cancel** / primary **Use these 1,844 clients**.
Three panes, each with a step label:
1. **Pick a field** — search input "Search fields" + grouped scroll list (§9.4): *Who they are · What they own · Where they are with you · Dates worth a note*. Fields already used are marked.
2. **Set the condition** — operator + value options for the picked field (e.g. Tags → include; Owned for → more than 5 years / 10 years; Area → is Inland Empire).
3. **See who joins** — "counted just now"; chip preview of the assembled filter; big count **1,844** / "of 4,109 clients"; "Showing 6 of 1,844" + Preview label; 6 sample rows with status chips (Active / Leads / On hold) and block chips ("In another campaign", "Opted out of email"); footer "Anyone who matches later joins automatically."

### 7.9 Playbook review — "What Mel took"
Full-screen overlay, ✕ to close.
- **Hero:** sparkle badge "What Mel took", badges `PDF` + `Read`, headline "Mel kept **16 moves** from your playbook", "Inland Empire seller script.pdf · 6 pages · read 14 Aug", 4-segment progress (3 filled).
- **Playbook coverage card:** **78** / 100, "↑ 4 of 6 pages used", bar chart — Openers 76% · Questions 66% · Objections 22% (low/red) · Handoffs 96% (hi/green).
- **How a conversation runs** (in order): chips "3 openers · 5 questions · 4 rules · 4 triggers", then four rows:
 - *Opens with* — "I pulled what your place would go for this spring — want the number?" (3)
 - *Asks about* — "Timeline first, then whether they need to buy next" (5)
 - *Adapts to* — "Never quote a price before a walkthrough" (4)
 - *Hands back when* — "They ask about commission, or name another agent" (4)
- **Left out** (2 of 6 pages): *Pages 3–4* "Brokerage disclaimers — legal boilerplate, not something to say to a client"; *Commission table* "Your notes say hand back when commission comes up, so Mel will not quote it". Same legend as §7.4.
- Footer: **Replace file** (`ph-arrow-clockwise`) · primary **Looks right**.

### 7.10 Editor behaviours
- Any change in edit mode → **Unsaved** badge + Save enabled. In new mode → re-runs the start gate.
- **Start campaign** inserts a new row at the top of the rules table: name, filter summary, "*n* in / just started", doing-now "Introducing Mel", empty pips + "Collecting", **Open** link; flashes once. Toast: "*Name* is running — Mel writes the first message per client".
- **Save draft** → toast "Draft saved", closes. **Pause** → toast "Paused — nothing sends until you resume" / "Campaign resumed".
- Esc unwinds one layer at a time: filter builder → playbook review → overlap sheet → editor.
- Entry points: **New campaign** button (new mode); campaign name / **Open** in either rules table; a board card (except its pause button) → edit mode.

---

## 8. Variants that exist as switches on web

These were built as toggles so the team could compare. Mobile should ship the marked default but keep the alternatives buildable.

| Switch | Options | Default |
|---|---|---|
| Campaigns layout | Tables · **Board** | Board |
| Rules views | **Table only** · Table + board | Table only |
| Board style | **Wells** · Plain · State | Wells |
| Card metric | Text · Bar · Pips · **Ring** | Ring |
| Summary strip | on/off | **on** |
| Mel suggestions | on/off | off |
| Send once opens | **Filled** · Empty | Filled |
| Undo window | on/off | **on** |
| Mel drafts | on/off | **on** |
| Email connected | on/off | **on** (off → connect-Google states) |

---

## 9. Data — copy verbatim

### 9.1 The 16 campaign rules
`name | category | filter summary | doing now | audience | replies · rate | status | next send | extra line`

**Introducing Mel**
1. Follow up to initial contact | Nurture | Status is New Client · No contact 14d+ | Introducing Mel | 1,378 | 64 · 4.6% | Running | Next send Thu 09:00 · 34 joining | 287 shared with Spring sellers
2. Website enquiries, same day | Nurture | Source is web_form · Created today | Answering the enquiry | 246 | 18 · 7.3% | Running | Sends within 4 min of enquiry · 12 today | —
3. Zillow leads, first touch | Nurture | Source is zillow · Unworked | Qualifying the lead | 892 | 31 · 3.5% | Running | Next send Wed 08:00 · 61 joining | *no playbook*
4. Open house sign-ins | Nurture | Source is open_house · Last 30 days | Thanking the visitor | 318 | 22 · 6.9% | Running | Next send Thu 17:00 · 22 joining | —

**Following up**
5. Spring sellers — Inland Empire | Farm | Tags is "farm-2026" · Owns property | Offering a valuation | 1,532 | 96 · 6.3% | **Waiting on you** | Next send Tue 09:00 · 88 joining | ⚠ 312 clients overlap Rate-drop watchers
6. Buyers with no tour in 21 days | Nurture | Client type is buyer · Status is Active | Suggesting a tour | 634 | 39 · 6.2% | Running | Next send Mon 10:00 · 47 joining | —
7. Rate-drop watchers | Re-engage | Tags is "rate-watch" · Not closed | Flagging a rate drop | 1,204 | 38 · 3.2% | Running | Holding until rates move · 0 queued | *no playbook*
8. Renters turning buyer | Re-engage | Lease ends within 90 days | Asking about renewal | 421 | 15 · 3.6% | Running | Next send Fri 09:00 · 18 joining | —
9. Cold list, last attempt | Re-engage | No contact 12m+ · Never replied | One last check-in | 1,044 | 21 · 2.0% | **Paused** | No sends while paused | Paused 12 Aug by you · *no playbook*

**Offering value**
10. Pre-approval nudge | Nurture | Buyer · No lender on file | Nudging pre-approval | 512 | 44 · 8.6% | Running | Next send Wed 09:00 · 26 joining | —
11. Valuation offer — 92 zip | Farm | Owns property · Owned 5y+ | Sending an estimate | 786 | 61 · 7.8% | Running | Next send Mon 08:00 · 54 joining | —
12. Neighbourhood report, monthly | Farm | Owns property · Opted in | Sharing the report | 2,140 | 118 · 5.5% | Running | Next send 1 Sep · 2,140 joining | —
13. Listing alerts, saved search | Nurture | Has saved search · Active buyer | Sending new listings | 1,860 | 71 · 3.8% | Running | Sends daily 07:00 · 1,860 active | —

**Handed back to you**
14. Referral ask after closing | Post-close | Status is Closed · Closed after 1 Apr | Asking for a referral | 268 | 41 · 15.3% | **Waiting on you** | Next send Thu 11:00 · 9 joining | ⚠ 12 replies waiting since Friday
15. Post-close, 12-month check-in | Post-close | Status is Closed · Closed 12m+ ago | Post-close check-in | 412 | 54 · 13.1% | Running | Next send Fri 09:00 · 14 joining | *no playbook*
16. Anniversary of purchase | Post-close | Closed · Anniversary this month | Anniversary note | 690 | 58 · 8.4% | Running | Next send 5 Sep · 31 joining | —

### 9.2 The 6 sent messages (Send once)
| Message | Channel | Sent | Recipients | Replies | Rate | Filter summary |
|---|---|---|---|---|---|---|
| Bel Air Crest — off-market listing | Email | 12 Aug 2026 | 318 | 11 | 3.5% | Tags is "luxury" · Last contact more than 30 days ago |
| Open house, 2140 Filbert St | Email | 4 Aug 2026 | 96 | 9 | 9.4% | Source is "open_house" · Created after 1 Jul |
| Rate drop — worth a look? | Text | 28 Jul 2026 | 1,204 | 38 | 3.2% | Client type is buyer · Status is Active |
| Price change, 88 Marina Blvd | Email | 21 Jul 2026 | 642 | 37 | 5.8% | Saved search matches · Active buyer |
| Mid-year market note | Email | 2 Jul 2026 | 3,410 | 82 | 2.4% | All clients · Opted in |
| Referral thank-you — Q2 closings | Text | 18 Jun 2026 | 124 | 18 | 14.5% | Status is Closed · Closed after 1 Apr |

### 9.3 Message library (what a reopened message prefills)
- **Bel Air Crest — off-market listing** — filters `luxury + cold30`; subject "An off-market listing in Bel Air Crest"; body: "Something came up in Bel Air Crest that hasn't hit the market yet — four bedrooms, canyon side, and the sellers are open to a quiet sale." / "Worth a look before it's listed?"; Mel: "An off-market listing in Bel Air Crest" · "A quiet sale, before it lists" · "Canyon side, four bedrooms".
- **Open house, 2140 Filbert St** — `openhouse + created30`; "Thanks for stopping by 2140 Filbert St"; "Good to meet you at the open house on Sunday. The listing sheet and the disclosure packet are attached." / "If you want a second walk-through before offers are reviewed, I can get you in this week."; Mel: "Thanks for stopping by 2140 Filbert St" · "The disclosure packet, as promised" · "A second look before offers close".
- **Rate drop — worth a look?** — `buyer + active`; "Rates moved — here's what it does to your budget"; "Rates came down about half a point this month. On the range you were looking at, that is roughly $180 a month." / "Want me to re-run the numbers on the homes you saved?"; Mel: "Rates moved — here's what it does to your budget" · "Half a point lower than in June" · "Worth re-running your numbers".
- **Price change, 88 Marina Blvd** — `saved + buyer`; "Price change on 88 Marina Blvd"; "88 Marina Blvd just came down to $1.24M — it matches the saved search you set up." / "It has been on the market 41 days, so there is room to negotiate. Want to see it this weekend?"; Mel: "Price change on 88 Marina Blvd" · "One of your saved searches just moved" · "$1.24M, down from $1.35M".
- **Mid-year market note** — `optedin`; "Where the market landed at mid-year"; "The half-year numbers are in: inventory is up 12%, median price is flat, and homes are taking nine days longer to sell than last year." / "If you have been waiting for a better moment to buy or list, this is the closest we have had in two years."; Mel: "Where the market landed at mid-year" · "Six months in: inventory is back" · "A flat market, and what it means for you".
- **Referral thank-you — Q2 closings** — `closed + closedapr`; "Thank you — and one small ask"; "It was a pleasure getting you to the closing table this spring. I hope the new place is starting to feel like home." / "If anyone you know is thinking about a move, I would be glad to help them the same way."; Mel: "Thank you — and one small ask" · "Hope the new place feels like home" · "Who else can I help this year?".

### 9.4 Filters

**Chip fields** (`key: icon · label · operator · value · funnel caption`)
```
luxury      ph-tag                     Tags           is         luxury          → "luxury tag"
waterfront  ph-tag                     Tags           is         waterfront      → "waterfront tag"
cold30      ph-clock-counter-clockwise Last contact   more than  30 days ago     → "cold 30d+"
cold60      ph-clock-counter-clockwise Last contact   more than  60 days ago     → "cold 60d+"
openhouse   ph-house-line              Source         is         open_house      → "open house"
created30   ph-calendar-blank          Created        after      1 Jul           → "new since 1 Jul"
buyer       ph-user                    Client type    is         buyer           → "buyers"
active      ph-circle                  Status         is         Active          → "active"
saved       ph-magnifying-glass        Saved search   matches    any             → "saved-search match"
allclients  ph-users-three             Audience       is         all clients     → "everyone"
optedin     ph-check-circle            Consent        is         opted in        → "opted in"
closed      ph-circle                  Status         is         Closed          → "closed"
closedapr   ph-calendar-blank          Closed         after      1 Apr           → "closed since 1 Apr"
farm2026    ph-tag                     Tags           is         farm-2026       → "farm-2026 tag"
farm2025    ph-tag                     Tags           is         farm-2025       → "farm-2025 tag"
owns        ph-house-line              Owns property  is         yes             → "owns property"
owned5      ph-calendar-blank          Owned for      more than  5 years         → "owned 5y+"
owned10     ph-calendar-blank          Owned for      more than  10 years        → "owned 10y+"
zip         ph-map-pin                 Area           is         Inland Empire   → "Inland Empire"
```
One filter per family — adding a second from the same family is refused (logged, not silent). "Change value" cycles to the paired field (luxury ↔ waterfront, cold30 ↔ cold60, farm2026 ↔ farm2025, owned5 ↔ owned10).

**Audience counts (Send once)** — the combination table that makes the funnel add up:
```
(none) 4,109
luxury 532 · waterfront 288 · cold30 1,204 · cold60 741
cold30+luxury 318 · cold60+luxury 196 · cold30+waterfront 174 · cold60+waterfront 109
openhouse 214 · created30 1,130 · created30+openhouse 96
buyer 1,876 · active 2,440 · active+buyer 1,204
saved 908 · buyer+saved 642
allclients 4,109 · optedin 3,410 · allclients+optedin 3,410
closed 389 · closedapr 402 · closed+closedapr 124
```
Exclusion of mid-conversation clients subtracts **41**.

**Campaign editor counts:** farm-2026 → 3,020; farm-2026 + owns → **1,844 match**; **312 held** (287 by "Follow up to initial contact", 25 by "Post-close, 12-month check-in") → **1,532 in**.

**Full field catalogue (filter builder)**
- **Who they are** — Tags (include) · Area (is Inland Empire) · Consent (is opted in) · Name (contains "LLC" / "Trust") · Email (is on file / is missing) · Phone (is on file / is missing) · Address (is on file) · Status (is Active / is Past client) · Company name (is on file)
- **What they own** — Owns property (is yes) · Owned for (more than 5 / 10 years) · Price range (above $750k / $1M) · Properties viewed (more than 5 / 20) · Properties saved (more than 1 / 5)
- **Where they are with you** — Stage (is Leads / Active) · Last contacted (more than 6 / 12 months ago) · Source (is Referral / Open house) · Last activity (within 7 days / more than 30 days ago) · Last communication (more than 30 / 90 days ago) · Created at (within 30 days / before this year) · Last email (more than 14 / 60 days ago) · Emails sent (none / more than 3) · Last call (more than 30 / 90 days ago) · Calls made (none / more than 1) · Talk time (more than 5 minutes) · Last text (more than 30 days ago) · Texts sent (none / more than 1) · Last visit (within 30 days) · Visits (more than 5 / 20) · AI feedback (is ready to talk / is going cold)
- **Dates worth a note** — Birthday (in the next 30 days) · Home anniversary (in the next 30 days)

### 9.5 People
**Send once recipients (preview list):** Priya Raman "Buyer · replied 2d ago" · Marcus Tan "Buyer · 3 saved searches" · Lena Osei "Seller · asked for a valuation" · Dev Kapoor "Buyer and seller" · Sofia Nunes "No type yet" · Ana Villanueva "Buyer · viewed 4 listings" · Tom Brar "Seller · listing expired" · Ines Marchetti "Buyer · pre-approved".

**Clients in the campaign (20, newest first)** — name · channel · joined · last message:
Lena Osei · email · 2h ago · "Comps for Ridgeline before Saturday" — Marcus Tan · text · 5h ago · "Saw you saved two homes on Ridgeline. Free for a tour Saturday?" — Sofia Nunes · text · yesterday · "Quick one — are you still looking in Redlands, or has that changed?" — Dev Kapoor · email · yesterday · "Your home valuation is ready" — Ravi Chandra · email · 2d · "What March did to prices in 92373" — Ana Villanueva · text · 3d · "Three new listings match your search. Want the addresses?" — Tom Brar · email · 4d · "About the listing that expired in March" — Ines Marchetti · email · 5d · "Now that the sale has closed" — Priya Raman · text · 6d · "Rates dipped this week — worth a look at the payment on the Elm Street place?" — Hugo Alvarez · email · 7d · "A neighbour just listed at 1.2M" — Nadia Haddad · text · 8d · "Still thinking about selling this year? No rush — just keeping you posted." — Owen Fitzgerald · email · 9d · "Your neighbourhood report for August" — Leah Bianchi · email · 10d · "Lease-end timing, start to finish" — Samir Mehta · text · 11d · "Pre-approval takes about a day. Want an intro to a lender I trust?" — Clara Jensen · email · 12d · "Two price drops near your saved search" — Emeka Okafor · email · 13d · "Following up on your valuation" — Yuki Tanaka · text · 14d · "Open house Sunday two streets over. Want the details?" — Grace Miller · email · 15d · "Three years in — what the house is worth now" — Ahmed Barakat · email · 16d · "Three sales on your street, all above list" — Fiona Doyle · text · 17d · "Any luck with the tours last weekend? I can line up three more."

**Filter-builder preview rows:** Lena Osei (Active) · Dev Kapoor (Active, *In another campaign*) · Ravi Chandra (Leads) · Marcus Tan (Active, *In another campaign*) · Sofia Nunes (Leads) · Amara Hale (On hold, *Opted out of email*).

**Agent:** Ashutosh iOSacc · Agent · `ashutosh@radiusagent.com` · brokerage "Radius Agent Realty" · second account `team@caliberrealty.com`.

---

## 10. Copy deck (verbatim)

**Positioning**
- "Reach a set of clients once, or set Mel to work on them over time."
- Send once: "One message, one time. Pick who gets it, write it, send it. Nothing follows."
- Campaign rules: "An ongoing conversation. Mel keeps following up, adapts to what each client is actually doing, and hands back when someone is ready for you."
- "Pips fill against the 6.0% reply-rate target. A client only ever hears from one campaign at a time. Where two overlap, you choose which one keeps them."

**Section titles / labels**
Who gets it · Who got it · What it says · Who joins · Your playbook · How often, and where · Going to · Results · In this campaign · Where they are · Clients · Before it starts · Filters · Add filter · Doing now · Audience · Reply rate · Message · Recipients · Replies · Type · Sent · Status

**Empty states**
- "Pick who gets it to see the count here"
- "No filters yet" / "Nobody yet — add a filter above" / "What is this about?"
- "Nobody picked yet" — "Add a filter and the people who'd get this show up here."
- "No one yet — add a filter to see who joins"
- "Add a filter and the people who would join show up here."
- "Nobody has joined yet. They show up here the moment they do."
- "Add a script, listing sheet, or your notes" — "Mel reads it and leads with it. Without one, Mel works from your past messages to clients like these."
- "No campaigns match these filters." / "Nothing here"
- "4,109 everyone — narrow it down"

**Warnings / overlap**
- "41 of these are mid-conversation in **Follow up to initial contact**." → "Exclude these 41" → "41 excluded — they stay with **Follow up to initial contact**."
- "**312** of these **1,844** are already in another campaign. They stay where they are unless you move them — a client only ever hears from one." → "Review the 312"
- "312 held by another campaign" — "Move them here and their other campaign stops for them. Leave them and they join when it finishes."
- "1,532 will join · 312 stay put"
- "No sending account connected. Connect the inbox you send from — nothing goes out until you do."
- "Anyone who matches later joins automatically."
- "Mel writes the first message per client when the campaign starts — nothing goes out before you press start."
- "Your instructions beat the document wherever they disagree."
- "Mel stops the moment they reply, and pauses your other campaigns for that person. One-off messages sit outside this."

**Mel lines**
- "Mel read the 318 — three ways in" / "Add a filter and Mel will draft from who's in it"
- "312 clients sit in two campaigns — pick who keeps them"
- "12 replies waiting since Friday — draft answers"
- "Draft replies for the two waiting on you"
- "Draft follow-ups to the 11 who replied"
- "Mel says: One message, one time. Pick who gets it, write it, send it. Nothing follows."
- "Mel kept 16 moves from your playbook" / "What Mel took" / "See what Mel took"

**Buttons**
New message · New campaign · Send to me first · Send to 318 clients · Connect Google to send · Connect Google · Duplicate · Close · Start from a smart list · Save as a smart list · Add filter · Add a file · Add instructions · Save instructions · Save draft · Start campaign · Save changes · Pause · Resume · Review the 312 · Exclude these 41 · Undo · Move 287 here · Leave · Done · Use these 1,844 clients · Cancel · Replace file · Looks right · Show 3 more · Show fewer · View all · Open · Resume · Export results · Mel defaults · Activity

**Toasts**
- "Sending to 318 clients" + 60s + Undo
- "Draft saved" · "Changes saved" · "Paused — nothing sends until you resume" · "Campaign resumed" · "*Name* is running — Mel writes the first message per client" · "Opening *Client name*"

---

## 11. What mobile must ship

**Required screens** (one per row; all of them):
1. Campaigns home — Campaign rules (list of the 16, grouped by stage; status, doing-now, audience, reply rate vs 6% target).
2. Campaigns home — Send once tab (the 6 sent messages).
3. Overview / stats (the 6 metrics, incl. the tappable "To resolve").
4. Filter + search + sort surfaces for the list.
5. Campaign card actions (row menu equivalents: edit, playbook, pause/resume, duplicate, delete).
6. Send once — audience step (chips + funnel + conflict/exclude).
7. Send once — compose step (Mel suggestions, from/to/subject, body with live merge token, email/text switch, character counter, tools).
8. Send once — recipient preview list (with the "Previewing" selection that drives the merge token).
9. Send once — send confirmation + 60s undo.
10. Send once — sent report (delivered/opened/replied/opted out + reply list + Mel follow-up chip).
11. Send once — empty first-run state.
12. Send once — no-account-connected state.
13. Campaign editor — Who joins.
14. Campaign editor — Your playbook (has-content and empty), instructions editor.
15. Campaign editor — How often, and where (channels + pace).
16. Campaign editor — rail content: In this campaign, Where they are, Clients list (sort + channel filter), Before it starts checklist.
17. Overlap sheet (move/leave the 312).
18. Filter builder (field → condition → preview, full catalogue).
19. Playbook review — What Mel took (coverage, conversation order, left out).
20. New-campaign flow with the start gate (named + at least one filter).
21. Paused campaign state, Waiting-on-you state, Draft state.

**Adaptation notes for the four hard cases**
- **Right rail → no rail.** The rail is context, not chrome. On mobile: put "In this campaign / Going to" as a sticky summary bar under the header (it must keep the flash-on-change), and move *Where they are*, *Clients*, *Before it starts*, *Results* into collapsible blocks below the sections or into a second tab. Never lose the conflict callout — it stays inline with the audience.
- **Funnel.** The chained `4,109 → 532 → 318` narration is the product's explanation of who is included; keep it. Vertical steps with the caret rotated, or a horizontally scrollable single row. The last step must read "in this campaign" / "got this".
- **Board.** Do not put a 4-column kanban on a phone. Use stage sections in a single vertical list (sticky stage header with dot + count) or one horizontal snap-carousel per stage. Card content stays exactly as §5.3, minus the hover-only actions; pause/open become swipe or a `⋮` sheet. Pick **one** metric variant (Ring reads best small) and use it everywhere.
- **Filter builder.** Three panes become three steps in one bottom sheet (field list w/ search → condition list → preview with count and sample rows), with a persistent footer showing "Use these 1,844 clients".

**Also carry over**
- 44×44pt minimum hit areas; 13px label floor, 15px body (mobile contract §0).
- Every visible label is literal markup so it stays click-editable; JS only toggles state.
- Tabular numbers everywhere a count or percentage appears.
- The exact same one-campaign-at-a-time language. Never invent a second explanation for overlap.
- No new colours, no gradients on surfaces, no accent rails, no emoji, Phosphor icons only.

---

## 12. Acceptance checklist

- [ ] All 21 screens/states in §11 exist.
- [ ] All 16 campaigns and 6 messages present with the exact names, filter summaries and numbers from §9.
- [ ] Funnel maths matches the count tables (4,109 / 532 / 318 / 277 and 4,109 / 3,020 / 1,844 / 1,532).
- [ ] Reply pips/rings fill against 6.0% and read correctly for 2.0% (worst) and 15.3% (best).
- [ ] Overlap appears in all three places: Send once exclude (41), campaign editor hold (312 = 287 + 25), board/table "Waiting on you".
- [ ] Start gate blocks until named + at least one filter; the "Before it starts" checklist reflects live state.
- [ ] Send has a 60s undo; the draft row autosaves and then commits.
- [ ] Playbook empty state, file state, instructions state, and the review overlay all present, with "your instructions beat the document" stated.
- [ ] Every Mel action is a `.melsugchip` with the static sparkle and gradient label — nowhere else does the Mel gradient appear.
- [ ] One tab treatment, four radii, Phosphor only, Mona Sans only, no accent rails, red 8px dots.
