# Team branding — what was built (for mobile parity)

## Page
- Title: **Team branding**. Header has no page-level CTA.
- Full content width (no 920px cap) — card, strip, and table all run edge to edge.
- Order top→bottom: **My branding** card → **Branding groups** heading row → team branding strip → rules table.

## My branding card
One card, two sections stacked, divider between them:

**Logo**
- Row: title "Set your logo" + subtext "This will be displayed on your CDAs, signature and shared links." on the left; controls on the right, single line.
- Controls: square tile (56px, 14px radius) showing an image glyph placeholder or the uploaded logo; "Upload" button; "Remove" appears only once a logo is set. Drag-and-drop onto the tile also works.

**Two brand colors** (this is the key change — not one color, two):
- **Primary brand color** — "Choose your primary brand color" / "Used on your CDAs, signature and shared links."
- **Sidebar color** — "Choose your sidebar color" / "Used on the CRM sidebar rail."
- Each is its own row: title+subtext left-aligned, then a row of round preset swatch dots, a "Custom" label, a small color circle + hex chip that open a **Colors popover** (light mode only):
  - Popover has a header ("Colors" + close X) and a segmented tab row: **Grid / Spectrum / Sliders**.
  - Grid: a 12-col swatch matrix (grayscale row + hue×lightness rows).
  - Spectrum: 2D color field + a hue slider underneath.
  - Sliders: hex text input + R/G/B number inputs.
  - Footer: live color chip + hex value + a contrast badge ("Passes on white" / "Low contrast on white").
- No footer save/reset buttons on this card — changes apply live (matches in-place editing pattern).

## Branding groups section
- Heading row: "Branding groups" title + subtext ("Rules that override the team logo and color for a set of agents.") stacked on the left; "New branding rule" button pinned right, same row.
- **Team branding strip** below (locked, non-editable): a muted row with a palette icon, "Team branding — Coastal Trust Realty" title, a real Radius logo tile, two color chips (primary hex + sidebar hex, each with swatch + hex text), and a "Locked" badge. No admin-only caveat text.
- **Rules table** below the strip, styled as a carbon copy of the CRM transactions table:
  - 34px header row, 12px/500 weight, `#737373` text, `#E5E5E5` bottom border.
  - Each header cell: 6-dot grip icon + label (ellipsis-safe) + optional sort icon, all in one flex row (not absolutely positioned — avoid that trap, it clips at narrow widths).
  - Columns: Rule name (26%, sortable) · Agents (16%) · Brand (16%) · Members can edit (26%, labelled "Can edit" if space is tight) · Actions (16%, right-aligned).
  - Rows: 36px height, 13px text, `#F5F5F5` dividers between columns and rows, `#FAFAFA` row hover.
  - **Agents column** = shadcn-style avatar stack: overlapping 24px avatars (white ring), capped at 2 faces + a muted "+N" overflow chip — never show every avatar, it will overflow a narrow column.
  - **Brand column** = two small round swatches side by side (primary, then sidebar), not one.
  - No search bar, no row-count line above the table.

## Branding rule sheet (New/Edit rule)
- Fields: rule name, agent multiselect (chips with an **X** to remove each, unticks the option live), **Primary brand color** field, **Sidebar color** field (same swatch-dots + Custom + popover control as the card), logo upload, and a single-select **member-who-can-edit** dropdown (plain text value, no chip, no Confirm button — picking closes the menu immediately).
- Removing a chip re-validates the form (disables Create/Save when no agents remain) and prunes the edit-permission picker if that member was removed.

## Role-based visibility ("View as" switcher)
A floating tab on the right edge of the screen, mid-height, expandable panel, persisted via localStorage. Three scenarios:

1. **TL / admin / ops / assistant** — full page as described above.
2. **Agent** — page retitles to "My branding"; only the locked team strip is shown (relabelled "My branding — Coastal Trust Realty"); no Branding groups heading, no rules table; Team nav trimmed to Members, Branding, Collaborators, Billing (Team settings/Groups/Pods/Automations hidden).
3. **Agent who can edit branding** — same trimmed shell as Agent, but the **editable** My branding card (logo + two color pickers) shows instead of the locked strip.

## Key gotchas to avoid on mobile
- Don't give table header icons fixed pixel padding/absolute position at narrow column widths — that's what caused clipping. Use an in-flow flex row (grip · label(ellipsis) · sort) so labels always get the true remaining width.
- Cap avatar stacks and truncate long cells — a `%`-width table column at mobile sizes has very little room.
- The two brand colors are genuinely separate settings everywhere they appear (card, rule sheet, strip, table row) — don't collapse back to one.
