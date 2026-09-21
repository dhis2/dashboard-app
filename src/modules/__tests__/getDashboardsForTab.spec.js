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

    it('falls back to the All tab behaviour for an unknown tab value', () => {
        const allResult = getDashboardsForTab({
            dashboards,
            tab: NAV_TABS.ALL,
            currentUserId: 'u1',
            recentIds: [],
        })
        const bogusResult = getDashboardsForTab({
            dashboards,
            tab: 'bogus',
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(bogusResult).toEqual(allResult)
    })

    it('excludes a dashboard whose starred flag is undefined from the Starred tab', () => {
        const dashboardsWithUndefinedStarred = [
            { id: 'a', displayName: 'Antenatal', starred: true },
            { id: 'e', displayName: 'Ebola' },
        ]

        const result = getDashboardsForTab({
            dashboards: dashboardsWithUndefinedStarred,
            tab: NAV_TABS.STARRED,
            currentUserId: 'u1',
            recentIds: [],
        })

        expect(result.map((d) => d.id)).toEqual(['a'])
    })
})
