# Tabbed Dashboards Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four tabs — All, Starred, Mine, Recent — to the dashboards navigation dropdown, so users who can see hundreds of dashboards can reach their own working set.

**Architecture:** The nav menu (`src/components/DashboardsBar/NavigationMenu/`) gains a `TabBar` above its existing search input. Tab membership is computed client-side by one pure function from data already in Redux, plus a `createdBy` field added to the dashboards list query. The Recent tab is backed by a list of `{ id, lastOpened }` entries written to `localStorage` on every dashboard open and synced to `userDataStore` on a debounce; the server copy is the source of truth and `localStorage` is a cache of it. The active tab is remembered per user in `localStorage`.

**Tech Stack:** React 16 + hooks, Redux (`react-redux` `connect` and `useSelector`), `@dhis2/ui` (`TabBar`, `Tab`, `Menu`, `MenuItem`, `Input`), `@dhis2/app-runtime` (`useDataEngine`), `@dhis2/d2-i18n` for strings, Jest + `@testing-library/react`. Existing conventions: CSS modules under `styles/`, localStorage keys namespaced `dhis2.dashboard.*`, selectors prefixed `sGet`, action creators `ac*`, thunks `t*`.

---

## Background an engineer needs before starting

**How the nav menu works today.** `NavigationMenuDropdownButton.jsx` renders a `@dhis2/ui` `DropdownButton` whose panel is `NavigationMenu.jsx`. That panel holds a search `Input` bound to the `dashboardsFilter` Redux slice, and a scrolling `Menu` of `NavigationMenuItem`s built from `sGetDashboardsSortedByStarred` (starred alphabetical, then unstarred alphabetical).

**How a dashboard gets opened.** All view routes render `CacheableViewDashboard.jsx`, which resolves the id (from `match.params.dashboardId`, or falls back to a stored preferred id / the first dashboard when the route is `/`) and renders `ViewDashboard.jsx`. `ViewDashboard` dispatches either `tSetSelectedDashboardById` (online) or `tSetSelectedDashboardByIdOffline` (offline). Both thunks live in `src/actions/selected.js` and both already call `storePreferredDashboardId(username, id)`. This is the single choke point every way-in passes through: nav click, bookmark, pasted URL, back button, post-save redirect. Edit is a separate page (`src/pages/edit/EditDashboard.jsx`) that does not go through these thunks.

**Why the route id matters.** On `/` the app auto-selects a dashboard for the user. That must NOT count as an open, or one dashboard pins itself to the top of Recent forever. `CacheableViewDashboard` is the only place that knows whether the id came from the route, so it must pass that fact down.

**Panel width.** `NavigationMenu.module.css` sets `min-inline-size: 480px` on desktop and `320px` under a 480px media query. The app ships in ~30 languages, so tabs scroll horizontally on narrow screens rather than wrapping.

## Test baseline on this branch

This work branches off `prototype/creator`, not `master`, and that branch has a **red test baseline before any of this plan is implemented**. Record it, do not try to fix it, and do not let it mask your own regressions.

```
Test Suites: 9 failed, 34 passed, 43 total
Tests:       23 failed, 256 passed, 279 total
Snapshots:   9 failed, 25 passed, 34 total
```

Pre-existing failures, all unrelated to tabbed navigation:

| Suite                                                           | Why it fails                                                                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/pages/edit/__tests__/TitleBar.spec.jsx`                    | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/pages/edit/__tests__/ActionsBar.spec.jsx`                  | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/pages/edit/__tests__/EditDashboard.spec.jsx`               | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/pages/edit/__tests__/NewDashboard.spec.jsx`                | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/components/Item/AppItem/__tests__/Item.spec.jsx`           | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/components/Item/VisualizationItem/__tests__/Item.spec.jsx` | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/reducers/__tests__/editDashboard.spec.js`                  | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/modules/__tests__/gridUtil.spec.js`                        | Snapshot mismatch from the edit redesign prototype                                                               |
| `src/components/__tests__/App.spec.jsx`                         | Fails to load: jest cannot parse `@fontsource-variable/roboto-flex`'s CSS (config gap, would fail on master too) |

### Lint baseline

`yarn lint` also fails at baseline, again from the edit redesign prototype. It exits 2 with:

-   `js > eslint` — 16 problems (5 errors, 11 warnings) in edit-page files
-   `js > prettier` — 9 unformatted files, all under `src/pages/edit/`, `src/actions/editDashboard.js` and `src/components/Item/ItemHeader/`
-   `css > stylelint` — 18 logical-property errors in `src/pages/edit/styles/`
-   `css > prettier` — `src/components/styles/ItemGrid.css`
-   `structured-text > prettier` — `docs/dashboard-edit-redesign-spec.md`

Run `yarn lint` and check that **none of the reported files are ones you touched**. Do not run `yarn format` — it would reformat the whole prototype and bury your change in noise. Format only your own files, e.g. `npx prettier --write <your file>`.

Note `src/pages/edit/EditDashboard.jsx` is already in the prettier warn list, and Task 9 modifies it. Leave its pre-existing formatting alone.

**Rules for every task in this plan:**

-   Any test _you_ add must pass outright. "It fails like the others" is never acceptable for new tests.
-   Never run `jest -u` to update snapshots. That would bless the prototype's current rendering as correct, which is not this plan's call to make.
-   Before claiming a task done, the failed counts must be unchanged from the table above.

**`CI=true yarn test` with no path argument HANGS** after the run completes — the jest workers go idle and the process never exits. Always pass a path, e.g. `CI=true yarn test src`.

**`@testing-library/user-event` is NOT installed.** It is absent from `package.json`, the lockfile and `node_modules`, and no existing spec uses it. Use `fireEvent` from `@testing-library/react` instead — `fireEvent.click(el)` for clicks and `fireEvent.change(el, { target: { value: 'x' } })` for typing. Do not add the dependency.

**`NavigationMenu.spec.jsx` already exists** on this branch (from the prototype work, commit `c8222d66`) with three tests covering the full list, the no-dashboards empty state, and the no-search-results placeholder. Tasks that say "create" this file mean MERGE — keep the existing tests and add to them. Those three tests need an `AppDataProvider` mock added once `NavigationMenu` starts calling `useCurrentUser`.

**Only ONE path argument works.** `d2-app-scripts test` honours only the FIRST positional path, so `yarn test src/pages src/actions` silently tests `src/pages` alone and reports success for a path it never ran. Run each path in its own command.

**Running a single spec:** pass the path as a bare argument, e.g. `CI=true yarn test src/modules/__tests__/recentDashboards.spec.js`. `--testPathPattern` is NOT forwarded by `d2-app-scripts` and will silently run the entire suite instead.

**Commits are unsigned on this branch.** GPG signing is enabled globally but the agent cannot prompt for a passphrase here, so every commit must use `git -c commit.gpgsign=false commit ...`. A plain `git commit` will fail with "gpg failed to sign the data".

---

**Decisions already made (do not relitigate):**

-   Mine is `createdBy.id === currentUser.id`. NOT `access.manage` — super users can manage everything, which would make Mine return the whole list.
-   Recent is capped at 20, most-recent-first, removable with an X. Removal is not a permanent blocklist: reopening the dashboard puts it back.
-   Startup auto-select and print do not count as opens. Edit does.
-   On app start: if there are unflushed local writes, push them and skip the pull. Otherwise pull and overwrite the local cache. Two machines open at once means the last flush wins; that loss is accepted and self-heals on the next open.

---

### Task 1: Preserve extra dashboard fields when a single dashboard is appended

Adding `createdBy` to the list query is not enough on its own. When a user views a dashboard, `tSetSelectedDashboardById` dispatches `acAppendDashboards([{ id, displayName, starred }])`, and the `ADD_DASHBOARDS` reducer does `{ ...state, ...action.value }` — a whole-entry replace. That would silently drop `createdBy` for whichever dashboard you just looked at, so it would vanish from the Mine tab. Fix the reducer to merge per dashboard.

**Files:**

-   Modify: `src/reducers/dashboards.js` (the `ADD_DASHBOARDS` case, around lines 27-32)
-   Test: `src/reducers/__tests__/dashboards.spec.js` (create if absent)

-   [ ] **Step 1: Write the failing test**

Append to `src/reducers/__tests__/dashboards.spec.js` (create the file with this content if it does not exist):

```js
import reducer, { ADD_DASHBOARDS } from '../dashboards.js'

describe('dashboards reducer: ADD_DASHBOARDS', () => {
    it('preserves fields on an existing dashboard that the new value omits', () => {
        const state = {
            abc: {
                id: 'abc',
                displayName: 'Antenatal Care',
                starred: false,
                createdBy: { id: 'user1' },
            },
        }

        const actualState = reducer(state, {
            type: ADD_DASHBOARDS,
            value: {
                abc: {
                    id: 'abc',
                    displayName: 'Antenatal Care',
                    starred: true,
                },
            },
        })

        expect(actualState.abc.createdBy).toEqual({ id: 'user1' })
        expect(actualState.abc.starred).toBe(true)
    })

    it('adds a dashboard that was not in state', () => {
        const actualState = reducer(
            {},
            {
                type: ADD_DASHBOARDS,
                value: { xyz: { id: 'xyz', displayName: 'Malaria' } },
            }
        )

        expect(actualState.xyz).toEqual({ id: 'xyz', displayName: 'Malaria' })
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/reducers/__tests__/dashboards.spec.js`
Expected: FAIL — "preserves fields..." fails because `actualState.abc.createdBy` is `undefined`.

-   [ ] **Step 3: Write the implementation**

In `src/reducers/dashboards.js`, replace the `ADD_DASHBOARDS` case:

```js
        case ADD_DASHBOARDS: {
            const merged = { ...state }

            Object.entries(action.value).forEach(([id, dashboard]) => {
                merged[id] = { ...merged[id], ...dashboard }
            })

            return merged
        }
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/reducers/__tests__/dashboards.spec.js`
Expected: PASS, 2 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/reducers/dashboards.js src/reducers/__tests__/dashboards.spec.js
git -c commit.gpgsign=false commit -m "fix: merge dashboard fields instead of replacing on append"
```

---

### Task 2: Fetch `createdBy` with the dashboards list

**Files:**

-   Modify: `src/api/fetchAllDashboards.js:6-11`

-   [ ] **Step 1: Add the field**

In `src/api/fetchAllDashboards.js`, change the `fields` array to:

```js
        fields: [
            'id',
            'displayName',
            'favorite~rename(starred)',
            'createdBy[id]',
            'embedded[*]',
        ],
```

-   [ ] **Step 2: Verify nothing broke**

Run: `yarn test src/components/__tests__/App.spec.jsx`
Expected: PASS. This query is not asserted on in unit tests; the check is that existing suites are unaffected.

-   [ ] **Step 3: Commit**

```bash
git add src/api/fetchAllDashboards.js
git -c commit.gpgsign=false commit -m "feat: fetch createdBy with the dashboards list"
```

---

### Task 3: Tab id constants and sticky tab persistence

The active tab is remembered per user so a super user who lives in Mine does not land on All every time. It goes in `localStorage`, not `userDataStore` — the existing `userDataStore` helper costs up to three round-trips per read, which is far too much for recovering which tab someone last clicked. Follow the existing key convention in `src/modules/localStorage.js`, which is keyed by `username`.

**Files:**

-   Create: `src/modules/navigationTabs.js`
-   Modify: `src/modules/localStorage.js`
-   Test: `src/modules/__tests__/localStorage.spec.js` (create)

-   [ ] **Step 1: Write the failing test**

Create `src/modules/__tests__/localStorage.spec.js`:

```js
import { NAV_TABS } from '../navigationTabs.js'
import { getNavigationTab, storeNavigationTab } from '../localStorage.js'

describe('navigation tab preference', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('returns the All tab when nothing is stored', () => {
        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.ALL)
    })

    it('round-trips a stored tab', () => {
        storeNavigationTab('rainbowdash', NAV_TABS.MINE)

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.MINE)
    })

    it('keeps tab preferences separate per user on a shared computer', () => {
        storeNavigationTab('rainbowdash', NAV_TABS.MINE)
        storeNavigationTab('applejack', NAV_TABS.STARRED)

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.MINE)
        expect(getNavigationTab('applejack')).toBe(NAV_TABS.STARRED)
    })

    it('falls back to All when the stored value is not a known tab', () => {
        localStorage.setItem('dhis2.dashboard.navTab.rainbowdash', 'bogus')

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.ALL)
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/modules/__tests__/localStorage.spec.js`
Expected: FAIL — "Cannot find module '../navigationTabs.js'".

-   [ ] **Step 3: Write the implementation**

Create `src/modules/navigationTabs.js`:

```js
export const NAV_TABS = {
    ALL: 'all',
    STARRED: 'starred',
    MINE: 'mine',
    RECENT: 'recent',
}

export const NAV_TAB_IDS = Object.values(NAV_TABS)
```

Add to the bottom of `src/modules/localStorage.js`:

```js
import { NAV_TABS, NAV_TAB_IDS } from './navigationTabs.js'

const navTabKey = (username) => `dhis2.dashboard.navTab.${username}`

export const getNavigationTab = (username) => {
    const stored = localStorage.getItem(navTabKey(username))

    return NAV_TAB_IDS.includes(stored) ? stored : NAV_TABS.ALL
}

export const storeNavigationTab = (username, tab) => {
    localStorage.setItem(navTabKey(username), tab)
}
```

Note: the `import` must go at the top of `src/modules/localStorage.js` with any other imports, not inline — `d2-style` enforces import ordering.

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/modules/__tests__/localStorage.spec.js`
Expected: PASS, 4 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/modules/navigationTabs.js src/modules/localStorage.js src/modules/__tests__/localStorage.spec.js
git -c commit.gpgsign=false commit -m "feat: persist the active dashboards navigation tab per user"
```

---

### Task 4: The pure tab-filtering function

All membership logic lives in one pure function so it can be tested without rendering anything. Note the Recent case returns dashboards in `recentIds` order (most recent first), while every other tab keeps the starred-then-alphabetical order it was given.

**Files:**

-   Create: `src/modules/getDashboardsForTab.js`
-   Test: `src/modules/__tests__/getDashboardsForTab.spec.js`

-   [ ] **Step 1: Write the failing test**

Create `src/modules/__tests__/getDashboardsForTab.spec.js`:

```js
import { getDashboardsForTab } from '../getDashboardsForTab.js'
import { NAV_TABS } from '../navigationTabs.js'

const dashboards = [
    {
        id: 'a',
        displayName: 'Antenatal',
        starred: true,
        createdBy: { id: 'u1' },
    },
    {
        id: 'b',
        displayName: 'Blood bank',
        starred: false,
        createdBy: { id: 'u2' },
    },
    {
        id: 'c',
        displayName: 'Cholera',
        starred: false,
        createdBy: { id: 'u1' },
    },
]

describe('getDashboardsForTab', () => {
    it('returns everything, in the order given, for the All tab', () => {
        const result = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.ALL,
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(result.map((d) => d.id)).toEqual(['a', 'b', 'c'])
    })

    it('returns only starred dashboards for the Starred tab', () => {
        const result = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.STARRED,
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(result.map((d) => d.id)).toEqual(['a'])
    })

    it('returns only dashboards created by the current user for the Mine tab', () => {
        const result = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.MINE,
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(result.map((d) => d.id)).toEqual(['a', 'c'])
    })

    it('does not throw for the Mine tab when createdBy is missing', () => {
        const result = getDashboardsForTab({
            dashboards: [{ id: 'd', displayName: 'Dengue', starred: false }],
            tab: NAV_TABS.MINE,
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(result).toEqual([])
    })

    it('returns Recent dashboards in recentIds order, not alphabetical', () => {
        const result = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.RECENT,
            currentUserId: 'u1',
            recentIds: ['c', 'a'],
        })

        expect(result.map((d) => d.id)).toEqual(['c', 'a'])
    })

    it('drops recent ids for dashboards that no longer exist', () => {
        const result = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.RECENT,
            currentUserId: 'u1',
            recentIds: ['deleted-id', 'b'],
        })

        expect(result.map((d) => d.id)).toEqual(['b'])
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/modules/__tests__/getDashboardsForTab.spec.js`
Expected: FAIL — "Cannot find module '../getDashboardsForTab.js'".

-   [ ] **Step 3: Write the implementation**

Create `src/modules/getDashboardsForTab.js`:

```js
import { NAV_TABS } from './navigationTabs.js'

export const getDashboardsForTab = ({
    dashboards,
    tab,
    currentUserId,
    recentIds,
}) => {
    switch (tab) {
        case NAV_TABS.STARRED:
            return dashboards.filter((dashboard) => dashboard.starred === true)
        case NAV_TABS.MINE:
            return dashboards.filter(
                (dashboard) => dashboard.createdBy?.id === currentUserId
            )
        case NAV_TABS.RECENT: {
            const dashboardsById = new Map(
                dashboards.map((dashboard) => [dashboard.id, dashboard])
            )

            return recentIds.map((id) => dashboardsById.get(id)).filter(Boolean)
        }
        case NAV_TABS.ALL:
        default:
            return dashboards
    }
}
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/modules/__tests__/getDashboardsForTab.spec.js`
Expected: PASS, 6 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/modules/getDashboardsForTab.js src/modules/__tests__/getDashboardsForTab.spec.js
git -c commit.gpgsign=false commit -m "feat: add tab membership logic for the dashboards navigation menu"
```

---

### Task 5: Recent list operations (pure)

Pure array operations with no I/O, so the ordering and cap rules are pinned down before any storage exists. An entry is `{ id, lastOpened }` where `lastOpened` is epoch milliseconds.

**Files:**

-   Create: `src/modules/recentDashboards.js`
-   Test: `src/modules/__tests__/recentDashboards.spec.js`

-   [ ] **Step 1: Write the failing test**

Create `src/modules/__tests__/recentDashboards.spec.js`:

```js
import {
    RECENT_DASHBOARDS_LIMIT,
    addRecentEntry,
    removeRecentEntry,
    getIdsFromEntries,
} from '../recentDashboards.js'

describe('addRecentEntry', () => {
    it('puts a new dashboard at the front', () => {
        const entries = addRecentEntry([{ id: 'a', lastOpened: 1 }], 'b', 2)

        expect(getIdsFromEntries(entries)).toEqual(['b', 'a'])
    })

    it('moves an already-present dashboard to the front without duplicating it', () => {
        const entries = addRecentEntry(
            [
                { id: 'a', lastOpened: 1 },
                { id: 'b', lastOpened: 2 },
            ],
            'a',
            3
        )

        expect(getIdsFromEntries(entries)).toEqual(['a', 'b'])
        expect(entries).toHaveLength(2)
    })

    it('updates lastOpened when a dashboard is reopened', () => {
        const entries = addRecentEntry([{ id: 'a', lastOpened: 1 }], 'a', 99)

        expect(entries[0].lastOpened).toBe(99)
    })

    it('caps the list and drops the oldest entry', () => {
        const full = Array.from(
            { length: RECENT_DASHBOARDS_LIMIT },
            (_, i) => ({
                id: `id${i}`,
                lastOpened: RECENT_DASHBOARDS_LIMIT - i,
            })
        )

        const entries = addRecentEntry(full, 'newest', 1000)

        expect(entries).toHaveLength(RECENT_DASHBOARDS_LIMIT)
        expect(entries[0].id).toBe('newest')
        expect(getIdsFromEntries(entries)).not.toContain(
            `id${RECENT_DASHBOARDS_LIMIT - 1}`
        )
    })

    it('does not mutate the array it was given', () => {
        const original = [{ id: 'a', lastOpened: 1 }]

        addRecentEntry(original, 'b', 2)

        expect(original).toEqual([{ id: 'a', lastOpened: 1 }])
    })
})

describe('removeRecentEntry', () => {
    it('removes the matching entry', () => {
        const entries = removeRecentEntry(
            [
                { id: 'a', lastOpened: 1 },
                { id: 'b', lastOpened: 2 },
            ],
            'a'
        )

        expect(getIdsFromEntries(entries)).toEqual(['b'])
    })

    it('is a no-op for an id that is not present', () => {
        const entries = removeRecentEntry([{ id: 'a', lastOpened: 1 }], 'zzz')

        expect(getIdsFromEntries(entries)).toEqual(['a'])
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/modules/__tests__/recentDashboards.spec.js`
Expected: FAIL — "Cannot find module '../recentDashboards.js'".

-   [ ] **Step 3: Write the implementation**

Create `src/modules/recentDashboards.js`:

```js
export const RECENT_DASHBOARDS_LIMIT = 20

export const getIdsFromEntries = (entries) => entries.map(({ id }) => id)

export const addRecentEntry = (entries, id, now) =>
    [
        { id, lastOpened: now },
        ...entries.filter((entry) => entry.id !== id),
    ].slice(0, RECENT_DASHBOARDS_LIMIT)

export const removeRecentEntry = (entries, id) =>
    entries.filter((entry) => entry.id !== id)
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/modules/__tests__/recentDashboards.spec.js`
Expected: PASS, 7 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/modules/recentDashboards.js src/modules/__tests__/recentDashboards.spec.js
git -c commit.gpgsign=false commit -m "feat: add recent dashboards list operations"
```

---

### Task 6: Recent list localStorage persistence

The stored shape is `{ entries, lastFlushed }`. Rather than a separate dirty flag, "there are unflushed writes" is derived: it is true when any entry's `lastOpened` is newer than `lastFlushed`. That is self-correcting and cannot drift out of sync.

Keyed by `username` to match the existing `dhis2.dashboard.current.<username>` convention, which also keeps users on a shared computer from seeing each other's dashboard names.

**Files:**

-   Modify: `src/modules/recentDashboards.js`
-   Modify: `src/modules/__tests__/recentDashboards.spec.js`

-   [ ] **Step 1: Write the failing test**

Append to `src/modules/__tests__/recentDashboards.spec.js`:

```js
import {
    getStoredRecentEntries,
    storeRecentEntries,
    hasPendingFlush,
    markFlushed,
} from '../recentDashboards.js'

describe('recent dashboards storage', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('returns an empty list when nothing is stored', () => {
        expect(getStoredRecentEntries('rainbowdash')).toEqual([])
    })

    it('round-trips entries', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])

        expect(getStoredRecentEntries('rainbowdash')).toEqual([
            { id: 'a', lastOpened: 5 },
        ])
    })

    it('keeps lists separate per user on a shared computer', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        storeRecentEntries('applejack', [{ id: 'b', lastOpened: 6 }])

        expect(getStoredRecentEntries('rainbowdash')).toEqual([
            { id: 'a', lastOpened: 5 },
        ])
        expect(getStoredRecentEntries('applejack')).toEqual([
            { id: 'b', lastOpened: 6 },
        ])
    })

    it('returns an empty list when the stored value is corrupt', () => {
        localStorage.setItem('dhis2.dashboard.recent.rainbowdash', 'not json')

        expect(getStoredRecentEntries('rainbowdash')).toEqual([])
    })

    it('reports a pending flush after a write', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])

        expect(hasPendingFlush('rainbowdash')).toBe(true)
    })

    it('reports no pending flush once marked flushed', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        markFlushed('rainbowdash', 10)

        expect(hasPendingFlush('rainbowdash')).toBe(false)
    })

    it('reports a pending flush again after a later write', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        markFlushed('rainbowdash', 10)
        storeRecentEntries('rainbowdash', [{ id: 'b', lastOpened: 500 }])

        expect(hasPendingFlush('rainbowdash')).toBe(true)
    })

    it('uses the real clock when no timestamp is passed to markFlushed', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        markFlushed('rainbowdash')

        expect(hasPendingFlush('rainbowdash')).toBe(false)
    })

    it('reports no pending flush when nothing is stored', () => {
        expect(hasPendingFlush('rainbowdash')).toBe(false)
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/modules/__tests__/recentDashboards.spec.js`
Expected: FAIL — the new imports are undefined, so "getStoredRecentEntries is not a function".

-   [ ] **Step 3: Write the implementation**

Append to `src/modules/recentDashboards.js`:

```js
const recentKey = (username) => `dhis2.dashboard.recent.${username}`

const readStored = (username) => {
    try {
        const stored = JSON.parse(localStorage.getItem(recentKey(username)))

        return Array.isArray(stored?.entries)
            ? { entries: stored.entries, lastFlushed: stored.lastFlushed || 0 }
            : { entries: [], lastFlushed: 0 }
    } catch (error) {
        return { entries: [], lastFlushed: 0 }
    }
}

export const getStoredRecentEntries = (username) => readStored(username).entries

export const storeRecentEntries = (username, entries) => {
    const { lastFlushed } = readStored(username)

    localStorage.setItem(
        recentKey(username),
        JSON.stringify({ entries, lastFlushed })
    )
}

export const hasPendingFlush = (username) => {
    const { entries, lastFlushed } = readStored(username)

    return entries.some((entry) => entry.lastOpened > lastFlushed)
}

export const markFlushed = (username, now = Date.now()) => {
    const { entries } = readStored(username)

    localStorage.setItem(
        recentKey(username),
        JSON.stringify({ entries, lastFlushed: now })
    )
}
```

**A note on the clock.** `hasPendingFlush` compares `entry.lastOpened > lastFlushed`, so it assumes those two numbers come from roughly the same, roughly monotonic clock. A backwards system-clock jump between a write and the next `markFlushed` could produce a false "nothing to flush" and silently lose that write on the sync path in Task 10. That is a real but low-probability edge case, accepted rather than defended against. `markFlushed` takes `now` as an injectable argument for the same reason `addRecentEntry` does — so tests can pin the clock rather than race it.

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/modules/__tests__/recentDashboards.spec.js`
Expected: PASS, 17 tests (8 from Task 5 plus 9 storage tests).

-   [ ] **Step 5: Commit**

```bash
git add src/modules/recentDashboards.js src/modules/__tests__/recentDashboards.spec.js
git -c commit.gpgsign=false commit -m "feat: persist recent dashboards to localStorage per user"
```

---

### Task 7: Redux slice for recent dashboard ids

The nav menu needs to re-render when a dashboard is opened or removed, so the list lives in Redux alongside the other slices. `localStorage` stays the durable copy; Redux is the reactive view of it.

**Files:**

-   Create: `src/reducers/recentDashboards.js`
-   Create: `src/actions/recentDashboards.js`
-   Modify: `src/reducers/index.js`
-   Test: `src/reducers/__tests__/recentDashboards.spec.js`

-   [ ] **Step 1: Write the failing test**

Create `src/reducers/__tests__/recentDashboards.spec.js`:

```js
import reducer, {
    SET_RECENT_DASHBOARDS,
    DEFAULT_STATE_RECENT_DASHBOARDS,
    sGetRecentDashboardIds,
} from '../recentDashboards.js'

describe('recent dashboards reducer', () => {
    it('returns the default state for an unrecognized action', () => {
        expect(reducer(undefined, {})).toEqual(DEFAULT_STATE_RECENT_DASHBOARDS)
    })

    it('stores a list of ids', () => {
        const actualState = reducer(DEFAULT_STATE_RECENT_DASHBOARDS, {
            type: SET_RECENT_DASHBOARDS,
            value: ['a', 'b'],
        })

        expect(actualState).toEqual(['a', 'b'])
    })

    it('falls back to the default state when the value is not an array', () => {
        const actualState = reducer(DEFAULT_STATE_RECENT_DASHBOARDS, {
            type: SET_RECENT_DASHBOARDS,
            value: null,
        })

        expect(actualState).toEqual(DEFAULT_STATE_RECENT_DASHBOARDS)
    })

    it('selects the ids from state', () => {
        expect(sGetRecentDashboardIds({ recentDashboards: ['a'] })).toEqual([
            'a',
        ])
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/reducers/__tests__/recentDashboards.spec.js`
Expected: FAIL — "Cannot find module '../recentDashboards.js'".

-   [ ] **Step 3: Write the implementation**

Create `src/reducers/recentDashboards.js`:

```js
export const SET_RECENT_DASHBOARDS = 'SET_RECENT_DASHBOARDS'

export const DEFAULT_STATE_RECENT_DASHBOARDS = []

export default (state = DEFAULT_STATE_RECENT_DASHBOARDS, action) => {
    switch (action.type) {
        case SET_RECENT_DASHBOARDS: {
            return Array.isArray(action.value)
                ? action.value
                : DEFAULT_STATE_RECENT_DASHBOARDS
        }
        default:
            return state
    }
}

// selectors

export const sGetRecentDashboardIds = (state) => state.recentDashboards
```

Create `src/actions/recentDashboards.js`:

```js
import {
    addRecentEntry,
    getIdsFromEntries,
    getStoredRecentEntries,
    removeRecentEntry,
    storeRecentEntries,
} from '../modules/recentDashboards.js'
import { SET_RECENT_DASHBOARDS } from '../reducers/recentDashboards.js'

export const acSetRecentDashboards = (ids) => ({
    type: SET_RECENT_DASHBOARDS,
    value: ids,
})

export const tRecordDashboardOpened = (username, id) => (dispatch) => {
    const entries = addRecentEntry(
        getStoredRecentEntries(username),
        id,
        Date.now()
    )

    storeRecentEntries(username, entries)

    return dispatch(acSetRecentDashboards(getIdsFromEntries(entries)))
}

export const tRemoveRecentDashboard = (username, id) => (dispatch) => {
    const entries = removeRecentEntry(getStoredRecentEntries(username), id)

    storeRecentEntries(username, entries)

    return dispatch(acSetRecentDashboards(getIdsFromEntries(entries)))
}
```

In `src/reducers/index.js`, add the import (alphabetically, after `printDashboard`):

```js
import recentDashboards from './recentDashboards.js'
```

and add `recentDashboards,` to the `combineReducers` object.

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/reducers/__tests__/recentDashboards.spec.js`
Expected: PASS, 4 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/reducers/recentDashboards.js src/reducers/index.js src/actions/recentDashboards.js src/reducers/__tests__/recentDashboards.spec.js
git -c commit.gpgsign=false commit -m "feat: add redux slice for recent dashboards"
```

---

### Task 8: userDataStore API for the recent list

Also replace the three-round-trip read in `apiGetUserDataStoreValue` for this key with a single GET that treats a missing key as empty. The existing helper checks the namespace, then the keys, then fetches — far too chatty for something read on every app start.

**Files:**

-   Create: `src/api/recentDashboards.js`
-   Test: `src/api/__tests__/recentDashboards.spec.js`

-   [ ] **Step 1: Write the failing test**

Create `src/api/__tests__/recentDashboards.spec.js`:

```js
import {
    apiGetRecentDashboards,
    apiPostRecentDashboards,
} from '../recentDashboards.js'

describe('apiGetRecentDashboards', () => {
    it('returns the stored entries', async () => {
        const engine = {
            query: jest.fn().mockResolvedValue({
                recentDashboards: { entries: [{ id: 'a', lastOpened: 1 }] },
            }),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toEqual([
            { id: 'a', lastOpened: 1 },
        ])
    })

    it('returns an empty list when the key does not exist yet', async () => {
        const engine = {
            query: jest
                .fn()
                .mockRejectedValue({ details: { httpStatusCode: 404 } }),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toEqual([])
    })

    it('returns an empty list when the request fails for any other reason', async () => {
        const engine = {
            query: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toEqual([])
    })
})

describe('apiPostRecentDashboards', () => {
    it('updates the key', async () => {
        const engine = { mutate: jest.fn().mockResolvedValue({}) }

        await apiPostRecentDashboards(engine, [{ id: 'a', lastOpened: 1 }])

        expect(engine.mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                resource: 'userDataStore/dashboard/recentDashboards',
                type: 'update',
                data: { entries: [{ id: 'a', lastOpened: 1 }] },
            })
        )
    })

    it('creates the key when update fails with a 404', async () => {
        const engine = {
            mutate: jest
                .fn()
                .mockRejectedValueOnce({ details: { httpStatusCode: 404 } })
                .mockResolvedValueOnce({}),
        }

        await apiPostRecentDashboards(engine, [])

        expect(engine.mutate).toHaveBeenLastCalledWith(
            expect.objectContaining({ type: 'create' })
        )
    })

    it('swallows errors so a failed flush never breaks the app', async () => {
        const engine = {
            mutate: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await expect(
            apiPostRecentDashboards(engine, [])
        ).resolves.toBeUndefined()
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/api/__tests__/recentDashboards.spec.js`
Expected: FAIL — "Cannot find module '../recentDashboards.js'".

-   [ ] **Step 3: Write the implementation**

Create `src/api/recentDashboards.js`:

```js
const RESOURCE = 'userDataStore/dashboard/recentDashboards'

const isNotFound = (error) => error?.details?.httpStatusCode === 404

export const apiGetRecentDashboards = async (dataEngine) => {
    try {
        const result = await dataEngine.query({
            recentDashboards: { resource: RESOURCE },
        })

        return Array.isArray(result?.recentDashboards?.entries)
            ? result.recentDashboards.entries
            : []
    } catch (error) {
        if (!isNotFound(error)) {
            console.info('Could not read recent dashboards:', error)
        }

        return []
    }
}

export const apiPostRecentDashboards = async (dataEngine, entries) => {
    const data = { entries }

    try {
        await dataEngine.mutate({ resource: RESOURCE, type: 'update', data })
    } catch (error) {
        if (!isNotFound(error)) {
            console.info('Could not save recent dashboards:', error)
            return
        }

        try {
            await dataEngine.mutate({
                resource: RESOURCE,
                type: 'create',
                data,
            })
        } catch (createError) {
            console.info('Could not create recent dashboards:', createError)
        }
    }
}
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/api/__tests__/recentDashboards.spec.js`
Expected: PASS, 6 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/api/recentDashboards.js src/api/__tests__/recentDashboards.spec.js
git -c commit.gpgsign=false commit -m "feat: add userDataStore api for recent dashboards"
```

---

### Task 9: Record dashboard opens

Hook into `src/actions/selected.js`, which every view path already funnels through. A new `recordRecent` argument defaults to `false` so the startup auto-select does not record; `CacheableViewDashboard` passes `true` only when the id came from the route.

**Files:**

-   Modify: `src/actions/selected.js`
-   Modify: `src/pages/view/ViewDashboard.jsx`
-   Modify: `src/pages/view/CacheableViewDashboard.jsx`
-   Modify: `src/pages/edit/EditDashboard.jsx`

-   [ ] **Step 1: Record from the selected thunks**

In `src/actions/selected.js`, add the import alongside the others:

```js
import { tRecordDashboardOpened } from './recentDashboards.js'
```

In `tSetSelectedDashboardById`, change the signature and the `storePreferredDashboardId` block:

```js
export const tSetSelectedDashboardById =
    (id, username, recordRecent = false) =>
    async (dispatch, getState, dataEngine) => {
```

```js
if (username) {
    storePreferredDashboardId(username, id)

    if (recordRecent) {
        dispatch(tRecordDashboardOpened(username, id))
    }
}
```

Make the identical change in `tSetSelectedDashboardByIdOffline`:

```js
export const tSetSelectedDashboardByIdOffline =
    (id, username, recordRecent = false) =>
    (dispatch, getState) => {
        if (username) {
            storePreferredDashboardId(username, id)

            if (recordRecent) {
                dispatch(tRecordDashboardOpened(username, id))
            }
        }
```

-   [ ] **Step 2: Pass the route flag down**

In `src/pages/view/CacheableViewDashboard.jsx`, add `isRouteRequested` to `mapStateToProps` (the `routeId` local already exists there):

```js
return {
    dashboardsIsEmpty: isEmpty(dashboards),
    dashboardsLoaded: !sDashboardsIsFetching(state),
    id: dashboardToSelect?.id || null,
    isRouteRequested: Boolean(routeId),
    selectedId: sGetSelectedId(state) || null,
}
```

Destructure it in the component signature alongside `id` and `selectedId`, add `isRouteRequested: PropTypes.bool,` to `CacheableViewDashboard.propTypes`, and pass it on:

```js
<ViewDashboard
    key={cacheSectionId}
    requestedId={id}
    isRouteRequested={isRouteRequested}
    username={currentUser.username}
/>
```

In `src/pages/view/ViewDashboard.jsx`, add `isRouteRequested` to the destructured props and to `ViewDashboard.propTypes` (`isRouteRequested: PropTypes.bool,`), then pass it through both call sites inside `loadDashboard`:

```js
await fetchDashboard(requestedId, username, isRouteRequested)
```

```js
setSelectedAsOffline(requestedId, username, isRouteRequested)
```

and the third call site in the mount effect:

```js
setSelectedAsOffline(requestedId, username, isRouteRequested)
```

Add `isRouteRequested` to the dependency arrays of `loadDashboard`'s `useCallback` and of the mount `useEffect`.

-   [ ] **Step 3: Record from the edit page**

In `src/pages/edit/EditDashboard.jsx`, add the imports:

```js
import { useCurrentUser } from '../../components/AppDataProvider/AppDataProvider.jsx'
import { tRecordDashboardOpened } from '../../actions/recentDashboards.js'
```

Add `useDispatch` to the `react-redux` import, then inside the component, above the existing `useEffect`:

```js
const dispatch = useDispatch()
const currentUser = useCurrentUser()
```

and inside `loadDashboard`, right after `props.setEditDashboard(dashboard)`:

```js
if (currentUser.username && props.id) {
    dispatch(tRecordDashboardOpened(currentUser.username, props.id))
}
```

Print is untouched: `PrintDashboard.jsx` and `PrintLayoutDashboard.jsx` do not use these thunks, so exports do not record.

-   [ ] **Step 4: Verify you added no new failures**

This branch has a red baseline (see "Test baseline" above). `src/pages/edit/__tests__/EditDashboard.spec.jsx` already fails on snapshots before your change.

Run: `CI=true yarn test src/pages` and then, as a SEPARATE command, `CI=true yarn test src/actions`
Expected: the same failures as the recorded baseline for those paths and no others. Specifically, `EditDashboard.spec.jsx`, `ActionsBar.spec.jsx`, `NewDashboard.spec.jsx` and `TitleBar.spec.jsx` fail on snapshot mismatches; nothing in `src/actions` fails. If any suite that was passing starts failing, that is yours — fix it before committing.

No new assertions here — the behaviour is covered end to end by the Cypress check in Task 14.

-   [ ] **Step 5: Commit**

```bash
git add src/actions/selected.js src/pages/view/ViewDashboard.jsx src/pages/view/CacheableViewDashboard.jsx src/pages/edit/EditDashboard.jsx
git -c commit.gpgsign=false commit -m "feat: record dashboard opens for the recent list"
```

---

### Task 10: Sync the recent list with userDataStore

On mount: load the local cache into Redux, then either push (if there are unflushed writes) or pull. Then flush on a 30-second interval and whenever the tab is hidden. That is roughly one network write per session rather than one per navigation, which matters because this app is used offline.

**Files:**

-   Create: `src/modules/useRecentDashboardsSync.js`
-   Modify: `src/components/App.jsx`

-   [ ] **Step 1: Write the hook**

Create `src/modules/useRecentDashboardsSync.js`:

```js
import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    apiGetRecentDashboards,
    apiPostRecentDashboards,
} from '../api/recentDashboards.js'
import { acSetRecentDashboards } from '../actions/recentDashboards.js'
import {
    getIdsFromEntries,
    getStoredRecentEntries,
    hasPendingFlush,
    markFlushed,
    storeRecentEntries,
} from './recentDashboards.js'

const FLUSH_INTERVAL_MS = 30000

export const useRecentDashboardsSync = (username) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const flushIfPending = useCallback(async () => {
        if (!username || !hasPendingFlush(username)) {
            return
        }

        const saved = await apiPostRecentDashboards(
            engine,
            getStoredRecentEntries(username)
        )

        // Only clear the pending-write signal if the write actually landed.
        // Marking a failed flush as flushed would let the next reconcile
        // overwrite local storage with server data that never received it.
        if (saved) {
            markFlushed(username)
        }
    }, [engine, username])

    // Show the local cache immediately, then reconcile with the server.
    useEffect(() => {
        if (!username) {
            return
        }

        dispatch(
            acSetRecentDashboards(
                getIdsFromEntries(getStoredRecentEntries(username))
            )
        )

        const reconcile = async () => {
            // Unflushed local writes win: push them and keep the local list.
            // This is what protects a session spent offline from being
            // overwritten by a stale server copy on the next app start.
            if (hasPendingFlush(username)) {
                await flushIfPending()
                return
            }

            const entries = await apiGetRecentDashboards(engine)

            // null means the request failed, as distinct from [] meaning the
            // server genuinely has nothing. Overwriting on a failed read would
            // wipe a good local list every time the app starts offline.
            if (entries === null) {
                return
            }

            storeRecentEntries(username, entries)
            markFlushed(username)
            dispatch(acSetRecentDashboards(getIdsFromEntries(entries)))
        }

        reconcile()
    }, [dispatch, engine, flushIfPending, username])

    useEffect(() => {
        const interval = setInterval(flushIfPending, FLUSH_INTERVAL_MS)
        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushIfPending()
            }
        }

        document.addEventListener('visibilitychange', onVisibilityChange)

        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [flushIfPending])
}
```

**The API contract this hook depends on** (fixed in Task 8 after review found two data-loss paths):

| Call                      | Returns       | Meaning                                                   |
| ------------------------- | ------------- | --------------------------------------------------------- |
| `apiGetRecentDashboards`  | entries array | read succeeded                                            |
|                           | `[]`          | 404 — key not created yet, genuinely empty                |
|                           | `null`        | request failed; the caller must NOT overwrite local state |
| `apiPostRecentDashboards` | `true`        | the write landed                                          |
|                           | `false`       | the write failed; the caller must NOT call `markFlushed`  |

Both of these are load-bearing. Treating `null` as empty wipes a user's Recent list whenever the app starts offline, and marking a failed flush as flushed loses every dashboard they opened while offline. Do not "simplify" either check away.

-   [ ] **Step 2: Call it from App**

In `src/components/App.jsx`, add the import:

```js
import { useRecentDashboardsSync } from '../modules/useRecentDashboardsSync.js'
```

and call it inside the `App` component, right after `const currentUser = useCurrentUser()`:

```js
useRecentDashboardsSync(currentUser.username)
```

-   [ ] **Step 3: Verify you added no new failures**

`src/components/__tests__/App.spec.jsx` **cannot run at all on this branch** and this is not your doing: jest's `moduleNameMapper` only matches `^.+\.(css|sass|scss)$`, but `App.jsx` does `import '@fontsource-variable/roboto-flex'` with no extension in the specifier, so jest tries to parse that package's `index.css` as JavaScript and the suite dies with "Test suite failed to run". Do not try to fix that here, and do not treat it as a signal about your change.

Run: `CI=true yarn test src/modules`
Expected: PASS. Every spec under `src/modules` except `gridUtil.spec.js` passes at baseline; `gridUtil.spec.js` fails and is pre-existing.

Then run the full suite: `CI=true yarn test`
Expected: exactly the baseline totals — `Test Suites: 9 failed, 34 passed`, `Tests: 23 failed, 256 passed` — plus whatever new passing tests earlier tasks added. The failed counts must not go up.

-   [ ] **Step 4: Commit**

```bash
git add src/modules/useRecentDashboardsSync.js src/components/App.jsx
git -c commit.gpgsign=false commit -m "feat: sync recent dashboards with userDataStore"
```

---

### Task 11: The tab bar, tab filtering and empty states

This is the visible change. `NavigationMenu` gains a `TabBar` above the search input, filters the list through `getDashboardsForTab`, remembers the active tab, and shows a real message for each empty tab rather than a blank panel.

Note the ordering rule: tabs other than Recent keep `sGetDashboardsSortedByStarred` order, so All still floats starred to the top exactly as it does today.

**Files:**

-   Modify: `src/components/DashboardsBar/NavigationMenu/NavigationMenu.jsx`
-   Modify: `src/components/DashboardsBar/NavigationMenu/styles/NavigationMenu.module.css`
-   Test: `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`

-   [ ] **Step 1: Write the failing test**

Create `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`:

```jsx
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { NavigationMenu } from '../NavigationMenu.jsx'

jest.mock('../../../AppDataProvider/AppDataProvider.jsx', () => ({
    useCurrentUser: () => ({ id: 'u1', username: 'rainbowdash' }),
}))

jest.mock('../NavigationMenuItem.jsx', () => ({
    NavigationMenuItem: ({ displayName }) => <li>{displayName}</li>,
}))

const state = {
    dashboards: {
        a: {
            id: 'a',
            displayName: 'Antenatal',
            starred: true,
            createdBy: { id: 'u1' },
        },
        b: {
            id: 'b',
            displayName: 'Blood bank',
            starred: false,
            createdBy: { id: 'u2' },
        },
    },
    dashboardsFilter: '',
    recentDashboards: [],
}

const renderMenu = () =>
    render(
        <Provider store={createStore((s = state) => s)}>
            <NavigationMenu close={jest.fn()} />
        </Provider>
    )

describe('NavigationMenu tabs', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('shows all dashboards on the default tab', () => {
        renderMenu()

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.getByText('Blood bank')).toBeInTheDocument()
    })

    it('shows only starred dashboards on the Starred tab', async () => {
        renderMenu()

        fireEvent.click(screen.getByText('Starred'))

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })

    it('shows only dashboards created by the current user on the Mine tab', async () => {
        renderMenu()

        fireEvent.click(screen.getByText('Mine'))

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })

    it('explains an empty Recent tab instead of showing a blank panel', async () => {
        renderMenu()

        fireEvent.click(screen.getByText('Recent'))

        expect(
            screen.getByText('Dashboards you open will appear here.')
        ).toBeInTheDocument()
    })

    it('restores the tab the user last used', async () => {
        const { unmount } = renderMenu()
        fireEvent.click(screen.getByText('Mine'))
        unmount()

        renderMenu()

        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })
})
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`
Expected: FAIL — `screen.getByText('Starred')` finds nothing; there is no tab bar yet.

-   [ ] **Step 3: Write the implementation**

Replace the contents of `src/components/DashboardsBar/NavigationMenu/NavigationMenu.jsx`:

```jsx
import i18n from '@dhis2/d2-i18n'
import { Input, Menu, Tab, TabBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetDashboardsFilter } from '../../../actions/dashboardsFilter.js'
import { getDashboardsForTab } from '../../../modules/getDashboardsForTab.js'
import {
    getNavigationTab,
    storeNavigationTab,
} from '../../../modules/localStorage.js'
import { NAV_TABS } from '../../../modules/navigationTabs.js'
import { sGetDashboardsSortedByStarred } from '../../../reducers/dashboards.js'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter.js'
import { sGetRecentDashboardIds } from '../../../reducers/recentDashboards.js'
import { useCurrentUser } from '../../AppDataProvider/AppDataProvider.jsx'
import { NavigationMenuItem } from './NavigationMenuItem.jsx'
import styles from './styles/NavigationMenu.module.css'
import itemStyles from './styles/NavigationMenuItem.module.css'

const matchesFilter = (dashboard, filterText) =>
    !filterText ||
    dashboard.displayName.toLowerCase().includes(filterText.toLowerCase())

const getEmptyTabMessage = (tab) => {
    switch (tab) {
        case NAV_TABS.STARRED:
            return i18n.t(
                'You have not starred any dashboards yet. Star one from its header, or browse All.'
            )
        case NAV_TABS.MINE:
            return i18n.t('You have not created any dashboards.')
        case NAV_TABS.RECENT:
            return i18n.t('Dashboards you open will appear here.')
        default:
            return i18n.t('No dashboards available.')
    }
}

export const NavigationMenu = ({ close }) => {
    const dispatch = useDispatch()
    const scrollBoxRef = useRef(null)
    const currentUser = useCurrentUser()
    const dashboards = useSelector(sGetDashboardsSortedByStarred)
    const filterText = useSelector(sGetDashboardsFilter)
    const recentIds = useSelector(sGetRecentDashboardIds)
    const [tab, setTab] = useState(() => getNavigationTab(currentUser.username))

    const onTabClick = useCallback(
        (nextTab) => {
            setTab(nextTab)
            storeNavigationTab(currentUser.username, nextTab)
        },
        [currentUser.username]
    )

    const onFilterChange = useCallback(
        ({ value }) => {
            dispatch(acSetDashboardsFilter(value))
        },
        [dispatch]
    )

    const tabDashboards = useMemo(
        () =>
            getDashboardsForTab({
                dashboards,
                tab,
                currentUserId: currentUser.id,
                recentIds,
            }),
        [dashboards, tab, currentUser.id, recentIds]
    )

    const filteredDashboards = useMemo(
        () =>
            tabDashboards.filter((dashboard) =>
                matchesFilter(dashboard, filterText)
            ),
        [filterText, tabDashboards]
    )

    useEffect(() => {
        scrollBoxRef.current
            ?.getElementsByClassName(itemStyles.selectedItem)
            ?.item(0)
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
    }, [])

    if (dashboards.length === 0) {
        return (
            <div className={cx(styles.container, styles.noDashboardsAvailable)}>
                <p>{i18n.t('No dashboards available.')}</p>
                <p>{i18n.t('Create a new dashboard using the + button.')}</p>
            </div>
        )
    }

    const renderList = () => {
        if (tabDashboards.length === 0) {
            return <li className={styles.noItems}>{getEmptyTabMessage(tab)}</li>
        }

        if (filteredDashboards.length === 0) {
            return (
                <li className={styles.noItems}>
                    {i18n.t('No dashboards found for "{{- filterText}}"', {
                        filterText,
                    })}
                </li>
            )
        }

        return filteredDashboards.map(({ displayName, id, starred }) => (
            <NavigationMenuItem
                displayName={displayName}
                id={id}
                starred={starred}
                key={id}
                close={close}
            />
        ))
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabWrap}>
                <TabBar scrollable>
                    <Tab
                        selected={tab === NAV_TABS.ALL}
                        onClick={() => onTabClick(NAV_TABS.ALL)}
                    >
                        {i18n.t('All')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.STARRED}
                        onClick={() => onTabClick(NAV_TABS.STARRED)}
                    >
                        {i18n.t('Starred')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.MINE}
                        onClick={() => onTabClick(NAV_TABS.MINE)}
                    >
                        {i18n.t('Mine')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.RECENT}
                        onClick={() => onTabClick(NAV_TABS.RECENT)}
                    >
                        {i18n.t('Recent')}
                    </Tab>
                </TabBar>
            </div>
            <div className={styles.filterWrap}>
                <Input
                    dense
                    type="search"
                    placeholder={i18n.t('Search for a dashboard')}
                    value={filterText}
                    onChange={onFilterChange}
                    initialFocus={true}
                />
            </div>
            <div ref={scrollBoxRef} className={styles.scrollbox}>
                <Menu dense>{renderList()}</Menu>
            </div>
        </div>
    )
}

NavigationMenu.propTypes = {
    close: PropTypes.func.isRequired,
}
```

Add to `src/components/DashboardsBar/NavigationMenu/styles/NavigationMenu.module.css`:

```css
.tabWrap {
    padding-inline: 8px;
    border-block-end: 1px solid var(--colors-grey200);
}
```

The `scrollbox` `max-block-size` calculations in that file subtract the height of everything above the menu. The tab bar adds roughly 40px, so change `calc(100vh - 152px)` to `calc(100vh - 192px)` and `calc(100vh - 176px)` to `calc(100vh - 216px)`, and update the explanatory comment above them to mention the tab bar.

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`
Expected: PASS, 5 tests.

-   [ ] **Step 5: Run the whole suite and lint**

Run: `yarn test && yarn lint`
Expected: PASS. Fix any import-ordering complaints `d2-style` reports.

-   [ ] **Step 6: Commit**

```bash
git add src/components/DashboardsBar/NavigationMenu/
git -c commit.gpgsign=false commit -m "feat: add tabs to the dashboards navigation menu"
```

---

### Task 12: Cross-tab search hint

Searching inside a tab must never hide matches silently. When the active tab is not All and there are matches outside it, show a clickable line under the results that switches to All with the search still applied. It appears whenever there are extra matches — not only when the tab returns nothing — because the dangerous case is a tab returning one plausible result while a dozen better ones sit in All.

**Files:**

-   Modify: `src/components/DashboardsBar/NavigationMenu/NavigationMenu.jsx`
-   Modify: `src/components/DashboardsBar/NavigationMenu/styles/NavigationMenu.module.css`
-   Modify: `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`

-   [ ] **Step 1: Write the failing test**

Append to the `describe('NavigationMenu tabs', ...)` block in `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`:

```jsx
it('offers matches from All when searching inside another tab', async () => {
    renderMenu()
    fireEvent.click(screen.getByText('Starred'))
    fireEvent.change(screen.getByPlaceholderText('Search for a dashboard'), {
        target: { value: 'b' },
    })

    expect(
        screen.getByText('1 more match in All dashboards')
    ).toBeInTheDocument()
})

it('switches to All when the hint is clicked', async () => {
    renderMenu()
    fireEvent.click(screen.getByText('Starred'))
    fireEvent.change(screen.getByPlaceholderText('Search for a dashboard'), {
        target: { value: 'b' },
    })
    fireEvent.click(screen.getByText('1 more match in All dashboards'))

    expect(screen.getByText('Blood bank')).toBeInTheDocument()
})

it('shows no hint on the All tab', async () => {
    renderMenu()
    fireEvent.change(screen.getByPlaceholderText('Search for a dashboard'), {
        target: { value: 'b' },
    })

    expect(screen.queryByText(/more match/)).not.toBeInTheDocument()
})
```

The search box is uncontrolled in this test because the mock store never updates `dashboardsFilter`. Make it work by replacing the `createStore` call in `renderMenu` with a real reducer for that slice:

```jsx
import dashboardsFilter from '../../../../reducers/dashboardsFilter.js'

const rootReducer = (s = state, action) => ({
    ...s,
    dashboardsFilter: dashboardsFilter(s.dashboardsFilter, action),
})

const renderMenu = () =>
    render(
        <Provider store={createStore(rootReducer)}>
            <NavigationMenu close={jest.fn()} />
        </Provider>
    )
```

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`
Expected: FAIL — "1 more match in All dashboards" is not found.

-   [ ] **Step 3: Write the implementation**

In `NavigationMenu.jsx`, add this `useMemo` after `filteredDashboards`:

```jsx
const otherMatchCount = useMemo(() => {
    if (tab === NAV_TABS.ALL || !filterText) {
        return 0
    }

    const tabIds = new Set(tabDashboards.map(({ id }) => id))

    return dashboards.filter(
        (dashboard) =>
            !tabIds.has(dashboard.id) && matchesFilter(dashboard, filterText)
    ).length
}, [dashboards, tabDashboards, tab, filterText])
```

Add the hint below the `Menu`, inside the `scrollbox` div:

```jsx
<div ref={scrollBoxRef} className={styles.scrollbox}>
    <Menu dense>{renderList()}</Menu>
    {otherMatchCount > 0 && (
        <button
            type="button"
            className={styles.otherMatches}
            onClick={() => onTabClick(NAV_TABS.ALL)}
            data-test="other-tab-matches"
        >
            {i18n.t('{{count}} more match in All dashboards', {
                count: otherMatchCount,
                defaultValue_plural: '{{count}} more matches in All dashboards',
            })}
        </button>
    )}
</div>
```

Add to `NavigationMenu.module.css`:

```css
.otherMatches {
    display: block;
    inline-size: 100%;
    padding-block: 8px;
    padding-inline: 24px;
    border: none;
    border-block-start: 1px solid var(--colors-grey200);
    background: none;
    color: var(--colors-blue600);
    font-size: 13px;
    line-height: 16px;
    text-align: start;
    cursor: pointer;
}
.otherMatches:hover {
    background-color: var(--colors-grey050);
}
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenu.spec.jsx`
Expected: PASS, 8 tests.

-   [ ] **Step 5: Commit**

```bash
git add src/components/DashboardsBar/NavigationMenu/
git -c commit.gpgsign=false commit -m "feat: surface matches from other tabs when searching"
```

---

### Task 13: Remove a dashboard from Recent

An X on each row, shown only on the Recent tab. Removing takes the dashboard off the list; opening it again puts it back. It is deliberately not a permanent blocklist — that would be more bookkeeping, which is the thing this feature exists to avoid.

**Files:**

-   Modify: `src/components/DashboardsBar/NavigationMenu/NavigationMenuItem.jsx`
-   Modify: `src/components/DashboardsBar/NavigationMenu/NavigationMenu.jsx`
-   Modify: `src/components/DashboardsBar/NavigationMenu/styles/NavigationMenuItem.module.css`
-   Test: `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenuItem.spec.jsx`

-   [ ] **Step 1: Write the failing test**

That spec file uses flat `test(...)` calls (no `describe`), `fireEvent` rather than `userEvent`, and already defines `defaultProps`, `defaultStoreFn` and mocks for `useCacheableSection`, `useHistory` and `apiPostDataStatistics`. Match that style. Append to the end of `src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenuItem.spec.jsx`:

```jsx
test('renders no remove button when onRemove is not given', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const mockStore = createStore(defaultStoreFn)
    const { queryByTestId } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )

    expect(queryByTestId('remove-recent-dashboard')).toBeNull()
})

test('calls onRemove with the dashboard id and does not navigate', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const push = jest.fn()
    useHistory.mockReturnValue({ push })
    const onRemove = jest.fn()
    const mockStore = createStore(defaultStoreFn)
    const { getByTestId } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} onRemove={onRemove} />
            </Router>
        </Provider>
    )

    fireEvent.click(getByTestId('remove-recent-dashboard'))

    expect(onRemove).toHaveBeenCalledWith('rainbowdash')
    expect(push).not.toHaveBeenCalled()
})
```

Note the first existing test in this file asserts `container.querySelector('.container').childNodes` has length 1. Rendering the remove button only when `onRemove` is passed keeps that assertion true.

-   [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/__tests__/NavigationMenuItem.spec.jsx`
Expected: FAIL — no element with `data-test="remove-recent-dashboard"`.

-   [ ] **Step 3: Write the implementation**

In `NavigationMenuItem.jsx`, add `IconCross16` to the `@dhis2/ui` import, add `onRemove` to the props, and render the button inside the existing label span after `displayName`:

```jsx
export const NavigationMenuItem = ({
    close,
    displayName,
    id,
    starred,
    onRemove,
}) => {
```

```jsx
const handleRemove = useCallback(
    (event) => {
        event.stopPropagation()
        onRemove(id)
    },
    [id, onRemove]
)
```

```jsx
;<span className={styles.displayName}>{displayName}</span>
{
    !!lastUpdated && <IconOfflineSaved />
}
{
    onRemove && (
        <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            data-test="remove-recent-dashboard"
            aria-label={i18n.t('Remove {{name}} from Recent', {
                name: displayName,
            })}
        >
            <IconCross16 color={colors.grey600} />
        </button>
    )
}
```

Add `import i18n from '@dhis2/d2-i18n'` to that file if it is not already imported, and add to the propTypes:

```jsx
    onRemove: PropTypes.func,
```

Add to `styles/NavigationMenuItem.module.css`:

```css
.removeButton {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    padding: 2px;
    border: none;
    border-radius: 3px;
    background: none;
    cursor: pointer;
}
.removeButton:hover {
    background-color: var(--colors-grey200);
}
```

In `NavigationMenu.jsx`, add the import:

```jsx
import { tRemoveRecentDashboard } from '../../../actions/recentDashboards.js'
```

add the handler:

```jsx
const onRemoveRecent = useCallback(
    (id) => {
        dispatch(tRemoveRecentDashboard(currentUser.username, id))
    },
    [dispatch, currentUser.username]
)
```

and pass it only on the Recent tab, in `renderList`:

```jsx
return filteredDashboards.map(({ displayName, id, starred }) => (
    <NavigationMenuItem
        displayName={displayName}
        id={id}
        starred={starred}
        key={id}
        close={close}
        onRemove={tab === NAV_TABS.RECENT ? onRemoveRecent : undefined}
    />
))
```

-   [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/components/DashboardsBar/NavigationMenu/`
Expected: PASS, all specs in that directory.

-   [ ] **Step 5: Run the whole suite and lint**

Run: `yarn test && yarn lint`
Expected: PASS.

-   [ ] **Step 6: Commit**

```bash
git add src/components/DashboardsBar/NavigationMenu/ src/actions/recentDashboards.js
git -c commit.gpgsign=false commit -m "feat: allow removing a dashboard from the Recent tab"
```

---

### Task 14: End-to-end check

The recording path crosses Redux, localStorage, routing and the userDataStore, so it needs one real-browser check that unit tests cannot give. Cypress specs in this repo are plain `.cy.js` files in `cypress/integration/`, with reusable selectors exported from `cypress/elements/`.

**Files:**

-   Modify: `cypress/elements/navigationMenu.js`
-   Modify: `cypress/elements/index.js`
-   Create: `cypress/integration/navigation_tabs.cy.js`

-   [ ] **Step 1: Add the selectors**

Append to `cypress/elements/navigationMenu.js`:

```js
export const getNavigationMenuTab = (label, isOpen) => {
    if (!isOpen) {
        getNavigationMenuDropdown().click()
    }
    return cy.get('[role="tab"]').contains(label)
}

export const getRemoveRecentButton = (dashboardDisplayName, isOpen) =>
    getNavigationMenu(isOpen)
        .find('li')
        .contains(dashboardDisplayName)
        .closest('li')
        .find('[data-test="remove-recent-dashboard"]')
```

Export both from `cypress/elements/index.js` alongside the existing `navigationMenu.js` exports.

-   [ ] **Step 2: Write the spec**

Create `cypress/integration/navigation_tabs.cy.js`:

```js
import {
    closeNavigationMenu,
    getNavigationMenu,
    getNavigationMenuItem,
    getNavigationMenuTab,
    getRemoveRecentButton,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const A_DASHBOARD = 'Antenatal Care'

describe('Tabbed dashboards navigation', () => {
    it('shows the four tabs', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        getNavigationMenu()
        cy.get('[role="tab"]').should('have.length', 4)
        ;['All', 'Starred', 'Mine', 'Recent'].forEach((label) => {
            cy.get('[role="tab"]').contains(label).should('be.visible')
        })
        closeNavigationMenu()
    })

    it('records an opened dashboard in Recent and lets it be removed', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        getNavigationMenuItem(A_DASHBOARD).click()
        getNavigationMenuTab('Recent')
        getNavigationMenuItem(A_DASHBOARD, true).should('be.visible')

        getRemoveRecentButton(A_DASHBOARD, true).click()
        getNavigationMenu(true).should('not.contain', A_DASHBOARD)
        closeNavigationMenu()
    })

    it('remembers the active tab across a reload', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        getNavigationMenuTab('Mine').click()
        closeNavigationMenu()

        cy.reload()

        getNavigationMenu()
        cy.get('[role="tab"][aria-selected="true"]').should('contain', 'Mine')
        closeNavigationMenu()
    })

    it('records a dashboard opened by URL, not just by menu click', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        getNavigationMenuItem(A_DASHBOARD).click()
        cy.url().then((url) => {
            const id = url.split('/').pop()

            // Clear Recent, then arrive by URL rather than by menu click
            getNavigationMenuTab('Recent')
            getRemoveRecentButton(A_DASHBOARD, true).click()
            closeNavigationMenu()

            cy.visit(`/#/${id}`, EXTENDED_TIMEOUT)

            getNavigationMenuTab('Recent')
            getNavigationMenuItem(A_DASHBOARD, true).should('be.visible')
        })
    })
})
```

Replace `A_DASHBOARD` with a dashboard title that exists on the instance the suite runs against — check what the other specs in `cypress/integration/` use.

-   [ ] **Step 3: Run it**

Run: `yarn cy:run --spec "cypress/integration/navigation_tabs.cy.js"`
Expected: PASS, 4 tests. This starts the dev server via the `cy:start` script and needs a reachable DHIS2 instance.

-   [ ] **Step 4: Commit**

```bash
git add cypress/
git -c commit.gpgsign=false commit -m "test: add e2e coverage for tabbed dashboards navigation"
```

---

## Deliberately out of scope

-   **Offline and Recently updated tabs.** Cut during design. Offline is a state already shown as a per-row icon; Recently updated is a feed concept and belongs as a sort order inside All if anyone asks for it.
-   **Seeding Recent from `dataStatistics` on first run.** Considered and rejected: a code path that runs once per user ever, untestable after the first week, and the existing view history only captured nav-menu clicks anyway. Recent starts empty for everyone, which is why its empty state has to read well.
-   **Per-entry merge with tombstones for cross-device sync.** Two sessions open at once means the last flush wins and the other's new entries are lost. It self-heals on the next open.
-   **Telemetry on which tab is active when a dashboard is opened.** There is no telemetry pipeline available; verification will be asking users.
