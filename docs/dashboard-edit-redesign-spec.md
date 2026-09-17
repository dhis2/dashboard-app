# Dashboard Create/Edit Page — Redesign Prototype Spec

**Status:** Prototype, intended for user testing — *not* a finalized spec. Decisions here are deliberate starting points to validate, not commitments.
**Branch:** `prototype/grid`
**Date:** 2026-06-19
**Audience:** This document is self-contained. It is written for an engineer/agent who was not part of the design discussion and needs to plan the build.

---

## 1. Goal & guiding priority

Redesign the DHIS2 dashboard creation/editing page so it is **clear and easy to use first**, ahead of power-user feature density. The primary user is a semi-frequent dashboard builder (M&E officer / data admin), often on modest hardware (1366px laptops, tablets), not a technical power user.

The redesign is a reaction to the current page, where **chrome, metadata, and the add-items control all stack vertically above the canvas**, so the user faces a wall of controls before they can see their dashboard.

---

## 2. Current state (baseline being replaced)

The current edit page (top → bottom):

- **Top bar (flat, equal weight):** `Save changes` · `Print preview` · `Filter settings` · `Exit without saving`
- **Metadata block:** Dashboard title (input), Dashboard description (textarea), Dashboard code (input)
- **Config card:** Layout (`Freeflow` + `Change layout`) · Grid columns (e.g. `60 (pixel perfect)`) · "Add new items to" (`End` / `Start` radio) · Search field ("Search for visualizations, reports and more")
- **Canvas:** grid of items; empty state shows "There are no items on this dashboard"

Adding items today is effectively **append-only** via the search field; the Start/End radio is the only placement control.

---

## 3. Design principles (the foundation)

**The page's functions split across THREE surfaces, each answering exactly one question.** This is the core organizing idea; it follows the standard editor pattern (top bar = the document, side panel = constructing the thing, middle = the canvas).

1. **Top toolbar** — "manage this dashboard as a *document*" (lifecycle + identity).
2. **Left "Build" sidebar** — "what goes *in* the dashboard / how is the canvas *shaped*" (construction).
3. **Settings drawer** — "how the dashboard *behaves*" (set-once-ish config).

**Surface-assignment rule** (use this for any control not explicitly listed below):
- Document/lifecycle action → toolbar.
- Shapes the canvas structure or its content → Build sidebar.
- Set-once behavior config → settings drawer (acceptable even at the cost of an extra click).
- A control that governs a *surface's own behavior* lives *on that surface* (e.g. the insertion-position toggle lives in the sidebar because it governs the sidebar's add action).

---

## 4. Surface ① — Top toolbar

A single bar, ranked by frequency (not a flat equal-weight row).

| Element | Placement | Behavior |
|---|---|---|
| **Title** | Left | Inline-editable (click to rename). Placeholder "Untitled dashboard". Replaces the standalone title metadata field. |
| **Save** | Right, top-level | Explicit save. **Save model is unchanged from today** — a dashboard is a published artifact; edits are not live until saved. |
| **Exit** | Right, top-level | Leaves edit mode. If there are unsaved changes, confirm (discard / keep editing). |
| **Preview** | Right | **Icon-only (eye).** v1: a single direct action → print preview (no menu). Use the eye icon now because it is designed to become a **Preview menu** later (print preview + preview-as-viewer + small-screen/tablet preview); the later change is just adding a caret + items. |
| **`⋯` overflow menu** | Right | Rare actions: **Delete dashboard**, **Translate**, **Share**. |
| **Dashboard settings** | Right | Opens the settings drawer (Surface ③). |

Notes:
- "Filter settings" is **removed from the toolbar** and moved into the drawer (see §6). A toolbar shortcut that deep-links to the drawer's Filters section is a **deferred** nice-to-have.
- Undo/redo would conventionally live top-left, but is **out of scope** (see §10).

---

## 5. Surface ② — Left "Build" sidebar

The new load-bearing element. Replaces today's inline search + config-card add controls.

**Container behavior**
- **Width: 280px.** (Chosen above Grafana's 240px because DHIS2's user base is less technical and benefits from a roomier panel.)
- **Open by default** on entering edit mode (discoverability: a newcomer should immediately see "this is where content comes from").
- **Collapsible** via a `«` chevron in the sidebar header → collapses to a **thin icon rail** showing the mode icons (Add / Layout), which re-expands on click. The rail preserves the "you can add things here" affordance even when collapsed.
- **The canvas reflows** (shrinks/grows) when the sidebar opens/collapses — it does **not** overlay the canvas. The grid is column-span based, so reflow preserves the relative layout (items keep their column spans, render narrower).
- **Boundary rule (anti-clutter):** only things that *shape the canvas structure or its content* may live here. This guards against the panel becoming a junk drawer.

The sidebar has **structured modes**, not a flat scroll:

### 5a. "Add" mode (default)
- **Search field + type filter on one row.** A search input and an `All types ▾` **dropdown** sit side by side in a single sticky row. The dropdown scopes *both* search and browse, so "search by name" and "browse by type" remain one UI (empty query + a type = "browse all maps").
  - *Revises an earlier decision:* the spec originally proposed a row of **chips** for the type filter. For the narrow 280px panel, chips wrapped to multiple rows and dominated the header; a single dropdown keeps the header to one compact line. The tradeoff is lower at-a-glance visibility of the available types — acceptable for clarity-by-compactness here, and a candidate to re-test.
  - **Granular, grouped filtering.** The dropdown is not flat — it nests chart sub-types under selectable top-level groups (mirroring DHIS2's own `VisTypeFilter` pattern):
    - **Aggregate** (= all `visualizations`) → the full canonical chart set beneath it (column, stacked column, bar, stacked bar, line, area, stacked area, pie, radar, gauge, year-over-year line/column, single value, pivot table, scatter, outlier table).
    - **Individual data** (= all `eventVisualizations` / Line Listing) → line list, pivot table.
    - **Maps**, then the remaining top-level types (**Reports · Resources · Apps**) so nothing is lost.
    - Top-level group rows are **bold and selectable** (pick broad or narrow); sub-types are indented beneath. The `dashboards/search` API only scopes by *item type*, so chart **sub-type filtering is applied client-side** on the returned array (`item.type === visType`); single-type browse fetches a larger page (count 50) so the client filter has enough to work with.
- **Flat, compact results list.** Saved content objects render as a single dense list with **no per-type section headers** — each row's **icon carries the type** (specific vis-type icons for visualizations: bar/line/pie/…, size-native 16px). Rows are tight (icon + name); the whole row is draggable and click-to-add, with a `+` affordance revealed on hover/focus (no always-on drag handle or add button).
- **Structural items** (Text box, Spacer) in their *own small, quiet section* below the results, set off by a divider — they are created blank, not found by search, so they must not be mixed into search results. (This is the one retained section heading.)
- **Insertion-position toggle**: a subtle segmented `Top | Bottom` pill near the results. It is also a *status readout* of where the next click-to-add will land. See §7.
- **v1 default / empty state = browse-by-type** (dropdown on "All types" + items). **No recents/favorites in v1** (avoids needing usage-tracking data).

### 5b. "Layout" mode (secondary)
- Grid type (**Freeflow / Fixed**).
- **Grid columns — default `12`. ✅ IMPLEMENTED** (`DEFAULT_GRID_COLUMNS` in `src/modules/gridUtil.js`, used by the reducer default + selector fallback). Presets are `60 / 12 / 4` (`GRID_COLUMN_PRESETS`). 12 is a coarse, legible grid that suits clarity-first; 60 ("pixel perfect") stays available for power users.
  - **Important data-model context for the planner:** grid columns is an **editor-only display *resolution*, not stored dashboard config.** Items are *always* stored in the canonical **60-unit** coordinate space (`GRID_COLUMNS = 60`); the editor scales x/w to/from the chosen display resolution via `toDisplayShape` / `toStorageShape`. So defaulting the editor to 12 is **non-destructive** — it changes snapping granularity while editing, not stored data, view, or print (all of which remain 60-space).
- **New-item default width — new setting. ✅ IMPLEMENTED.** "New items span **[N] columns**", where N is shown in the *current display resolution*. **Default = half width** → shows **6** at the 12-column default. (Previously new items were hardcoded `w: 20` of 60 ≈ ⅓ width via `NEW_ITEM_SHAPE`; now a user-adjustable, per-dashboard value defaulting to ½.)
  - **Storage:** persisted in the dashboard's **`itemConfig.newItemWidth`** (alongside `insertPosition`), in canonical 60-space (default `DEFAULT_NEW_ITEM_WIDTH = 30`). Because `30/60` renders as exactly half at *any* display resolution, "default = 0.5 × columns" needed no dynamic tracking — the stored 30 *is* half everywhere. The Layout-panel control converts 60-space ↔ current display columns for display/edit.
  - **Scope:** applies to **freeflow only** — in Fixed layout the auto-layout sizes items to the column count, so the control is shown only in the freeflow branch. Width override is injected at the add chokepoints (`tSetDashboardItems`, `tDropDashboardItem`) and the drag-preview width (`ItemGrid` `dropW`) reads the same value. **Height was left unchanged** (`NEW_ITEM_SHAPE.h`).
- **Live canvas reflow** as the user adjusts — this is *why* layout lives in the sidebar rather than the drawer (the drawer would hide the canvas, and this is a see-it-to-decide control).
- **Destructive changes get a confirm** (e.g. switching layout type when items are already placed).

### 5c. Item settings (future, not in v1)
- No per-item settings exist today. When light ones arrive (e.g. custom item title), they are an **inline popover on the item** (`⋯` → Item settings), **not** a sidebar tab.
- **Graduation tripwire:** only when per-item settings exceed ~3 fields do they move to a *selection-driven contextual mode* in the Build panel (panel becomes the selected item's properties with a "back" affordance). Never a dormant peer tab. This is a rule, not to be re-litigated per feature.

---

## 6. Surface ③ — Settings drawer

A **side drawer** (canvas stays visible beside it), summoned from the toolbar's "Dashboard settings". **Sections, not tabs** (few enough to scroll). Toolbar deep-links can jump to a section.

- **Details**
  - **Description** — first-class, at the **top**, with purpose/audience microcopy, e.g. *"Shown to viewers; helps people find and understand this dashboard."* Description is viewer-facing **content**, not admin config, so it is treated as a sibling of the title. Decision: **support** good usage (placement + microcopy) but do **not** *drive* it — description is **never mandatory** and there is **no creation-time nudge**.
  - **Dashboard code** — demoted under an **Advanced** subhead. It is a machine/interop identifier almost no end user touches; **never shown at creation**.
- **Filters**
  - Filter settings (moved out of the toolbar).
- Layout/grid is **not** here — it moved to the sidebar's Layout mode (§5b).

---

## 7. Insertion mechanics

- **Both drag-to-place and click-to-append are supported** (table-stakes).
- **Click** adds the item; default lands at **bottom**.
- The old **"Add new items to: Start / End" radio is removed**, replaced by the segmented `Top | Bottom` pill in the sidebar (§5a).
- **No modifier-key prepend** (e.g. shift-click) — hidden interactions fail clarity-first and don't exist on touch/tablet.
- The insertion preference **is persisted today; keep persisting it.**
  - **RESOLVED:** it is stored as `insertPosition` on the dashboard's **`itemConfig`** (`src/reducers/editDashboard.js`), so it is **per-dashboard** — flipping "Top" on one dashboard does *not* affect others. `itemConfig` is the established home for per-dashboard authoring preferences; the new-item width (§5b) joins it there.

---

## 8. Canvas & per-item interactions

- **Reveal-on-hover model:** an unengaged item shows **zero chrome** (it reads as content, not as an editor control).
- **Hover** reveals resize handle(s) + a single **`⋯` menu** (`{ Item settings, Delete }`). No scattered per-item icons.
- **Click selects** the item (persistent handles + keyboard target).
- **Whole card is draggable** to move (no separate drag handle).
- **Empty canvas state** hosts the **first-run layout choice** ("Start by choosing a layout"), reusing today's dead "no items" space — this is the cheapest, non-destructive moment to make the layout decision. The sidebar's Layout mode is where it's revisited later.

---

## 9. Build-relevant interaction risk

The **drag-from-sidebar-onto-a-reflowing-grid** gesture is both the core interaction and the hardest thing to build (drop-target preview, autoscroll, collision with existing items). Recommend spiking this specifically before committing the full build. Click-to-append is the safe minimum if drag proves too costly for the prototype — but the `Top | Bottom` pill stays regardless.

---

## 10. Explicitly out of scope / deferred

These were considered and consciously cut from the prototype:
- **Undo/redo** (out of scope entirely; today's only "undo" remains the all-or-nothing Exit-without-saving).
- **Viewport-conditional auto-collapse** of the sidebar (a production hedge — see §11; for the prototype, manual collapse is the escape hatch).
- **Recents / favorites** in the sidebar default state.
- **Card-level prepend affordance** (drag-to-top covers the need).
- **Description creation-time nudge** / mandatory description.
- **The Preview menu's extra modes** (preview-as-viewer, device/tablet preview) — only print preview in v1.
- **Multi-select / bulk actions on the canvas** (move/delete several items at once) — **UNRESOLVED, not designed.** The reveal-on-hover/single-select model is currently silent on this. Flag for a future design pass.

---

## 11. Key risk & test plan

**Load-bearing assumption:** an open-by-default 280px sidebar that narrows a width-sensitive grid is a *net* clarity win.

**Why it's the riskiest part:**
- DHIS2 editors skew to modest hardware (1366px laptops, tablets). On 1366px, minus 280px, the grid is built in ~1086px (the width pressure is the same regardless of the 12/60 display resolution).
- The build-canvas is **narrower than the viewer-canvas** (view mode has no sidebar). Column-span grids preserve *relative* layout, so this is not fatal, but pixel-feel and "does this look cramped" judgments are made against the wrong width.
- The discoverability gain may not pay for the width if adding is bursty.

**Test plan:**
- No screen-width data exists; **the prototype is the test.**
- **Critical:** user-test at the **screen widths real users actually have** (1366px laptop, tablet) — not just a large dev monitor, which will produce a false "it's fine".
- Watch two things: (a) do users find the palette? (b) do they fight the narrowed canvas / reach for collapse?

**Recommended production hedge (deferred for the prototype):** make open-by-default **viewport-conditional** (auto-collapsed below a width breakpoint).

---

## 12. Decisions left for the build planner
- Drag-and-drop onto reflowing grid: feasibility/effort for the prototype vs click-to-append fallback (§9).
- Multi-select / bulk canvas actions (§10) — needs a design decision before it can be planned.

## Resolved / implemented
- Insertion-position persistence is **per-dashboard** via `itemConfig.insertPosition` (§7).
- **Default grid columns → `12`** — editor display resolution only; storage stays 60-space (§5b). ✅ implemented.
- **New-item default width** → `itemConfig.newItemWidth`, 60-space, default `30` (= half at any resolution), freeflow-only, surfaced as "New items span N columns" in the Layout panel (§5b). ✅ implemented. New-item *height* was deliberately left unchanged (`NEW_ITEM_SHAPE.h`).
- Files touched: `src/modules/gridUtil.js`, `src/reducers/editDashboard.js`, `src/actions/editDashboard.js`, `src/pages/edit/ItemGrid.jsx`, `src/pages/edit/BuildSidebar/LayoutPanel.jsx`.
