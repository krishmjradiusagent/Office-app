# Transcripts

## 2026-09-17 — Commission Breakdown UI Design

- Source: https://notes.wisprflow.ai/shared/YLDyTuQuNm_dzjYvcX4urtPZd6qu6-Ve8lkvldUvOe4
- Participants identified in transcript: Biju, Krish J, Shaily, Speaker 3
- Access: full transcript reviewed through Wispr Flow MCP

### Decisions

- Order approvals by nearest closing date.
- Replace small `View all` links with tap-through cards matching Upcoming Tasks.
- Use property address as page title; keep Commission Breakdown secondary.
- Agent opens own split. Team lead opens overall breakdown.
- For dual-side agents, show one side first; no swipe carousel.
- Default to quick breakdown. Expand into detailed web-equivalent breakdown.
- Show editable sales price and gross commission above net commission.
- Detailed waterfall covers commission basis, pre-split deductions, post-split deductions, plan-related fees, and payable-to-Radius amounts.
- Show team, group, and Radius totals while respecting team-hidden and Radius-hidden rules.
- In edit mode, gray out locked rows. Remove edit underlines and irrelevant chevrons.
- Replace Return with Comment. Primary actions become Confirm and Comment.
- Comment opens activity bottom sheet with text entry and full-page expansion.
- Put per-fee wire recipient selection in deal Wire Payment flow, not general settings.
- Deal-entered wire instructions apply only to that transaction.
- Mobile branding uses primary color only; inherit web color by default with optional mobile override.

### Product constraints

- Visible math must reconcile. Fees may be paid by agent, team, group, or Radius.
- Team-lead view needs stronger editing: plans, fees, agents, and split details.
- Credits and referrals occur before agent allocation in multi-agent deals; placement must not imply otherwise.
- Missing wire instructions block confirmation and need a visible warning.
- Per-fee recipient options: Radius, team, or external.

### Assigned work

- Krish J: redesign quick and detailed breakdown; add price and gross commission; revise edit mode; implement transaction-specific wire flow.
- Krish J: replace `View all` pattern app-wide.
- Speaker 3: improve vendor-item selected state, connect selected item to detail panel, reduce wasted space.
- Yogesh priority: AI split backend fix, Sandra work, then cap tracker.
- Shaily and Speaker 3: review revised design after changes.

### Unresolved design work

- Final copy and positioning for plan fees, split percentage, and group-plan context.
- Exact compact presentation of full calculation waterfall.
- Final selected-state treatment for vendor items.
