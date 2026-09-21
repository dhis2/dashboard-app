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
