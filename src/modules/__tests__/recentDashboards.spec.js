import {
    RECENT_DASHBOARDS_LIMIT,
    addRecentEntry,
    removeRecentEntry,
    getIdsFromEntries,
    getStoredRecentEntries,
    storeRecentEntries,
    hasPendingFlush,
    markFlushed,
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
        // Deliberately diverge position order from lastOpened order: the
        // last positional entry gets the HIGHEST lastOpened value. If
        // addRecentEntry were changed to sort by lastOpened before
        // capping, it would keep this entry instead of dropping it — so
        // this pins the drop to array position, not recency.
        const full = Array.from(
            { length: RECENT_DASHBOARDS_LIMIT },
            (_, i) => ({
                id: `id${i}`,
                lastOpened: i + 1,
            })
        )

        const entries = addRecentEntry(full, 'newest', 1000)

        expect(entries).toHaveLength(RECENT_DASHBOARDS_LIMIT)
        expect(entries[0].id).toBe('newest')
        expect(getIdsFromEntries(entries)).not.toContain(
            `id${RECENT_DASHBOARDS_LIMIT - 1}`
        )
    })

    it('caps the list at 20', () => {
        expect(RECENT_DASHBOARDS_LIMIT).toBe(20)
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

    it('returns an empty list when the stored value is valid JSON but the wrong shape', () => {
        localStorage.setItem(
            'dhis2.dashboard.recent.rainbowdash',
            JSON.stringify({ entries: 'nope' })
        )

        expect(getStoredRecentEntries('rainbowdash')).toEqual([])
    })

    it('drops malformed elements from an otherwise valid entries array', () => {
        localStorage.setItem(
            'dhis2.dashboard.recent.rainbowdash',
            JSON.stringify({
                entries: [null, { id: 'a', lastOpened: 1 }],
            })
        )

        expect(getStoredRecentEntries('rainbowdash')).toEqual([
            { id: 'a', lastOpened: 1 },
        ])
    })

    it('does not throw when localStorage.setItem fails', () => {
        const setItem = jest
            .spyOn(Storage.prototype, 'setItem')
            .mockImplementation(() => {
                throw new Error('quota exceeded')
            })

        expect(() =>
            storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        ).not.toThrow()

        setItem.mockRestore()
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

    it('preserves lastFlushed across a later write, even though the write itself is pending again', () => {
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])
        markFlushed('rainbowdash', 100)
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 5 }])

        const stored = JSON.parse(
            localStorage.getItem('dhis2.dashboard.recent.rainbowdash')
        )

        expect(stored.lastFlushed).toBe(100)
        // Dirtiness is explicit, so writing again — even the same data —
        // makes the list pending again; lastFlushed is only informational.
        expect(hasPendingFlush('rainbowdash')).toBe(true)
    })

    it('reports a pending flush after a removal', () => {
        // A removal only shrinks the entries array, so no entry ends up
        // with a newer lastOpened than lastFlushed. This is what the old
        // inferred-dirtiness implementation missed: it would report no
        // pending flush here, so the removal would never sync and would
        // reappear on the next reconcile.
        storeRecentEntries('rainbowdash', [
            { id: 'a', lastOpened: 100 },
            { id: 'b', lastOpened: 90 },
        ])
        markFlushed('rainbowdash', 200)
        storeRecentEntries('rainbowdash', [{ id: 'a', lastOpened: 100 }])

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
