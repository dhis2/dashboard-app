import reducer, {
    DEFAULT_STATE_DASHBOARDS_FILTER,
    SET_DASHBOARDS_FILTER,
    CLEAR_DASHBOARDS_FILTER,
    sGetDashboardsFilter,
} from '../dashboardsFilter'

describe('dashboards filter reducer', () => {
    it('returns the default state when action type unrecognized', () => {
        const actualState = reducer(DEFAULT_STATE_DASHBOARDS_FILTER, {})

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS_FILTER)
    })

    it('returns the default state when value is null', () => {
        const actualState = reducer(DEFAULT_STATE_DASHBOARDS_FILTER, {
            type: SET_DASHBOARDS_FILTER,
            value: null,
        })

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS_FILTER)
    })

    it('returns the default state when value is undefined', () => {
        const actualState = reducer(DEFAULT_STATE_DASHBOARDS_FILTER, {
            type: SET_DASHBOARDS_FILTER,
        })

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS_FILTER)
    })

    it('sets the filter', () => {
        const action = {
            type: SET_DASHBOARDS_FILTER,
            value: 'rainbowdash',
        }

        const actualState = reducer(undefined, action)

        expect(actualState).toEqual('rainbowdash')
    })

    it('clears the filter', () => {
        const action = {
            type: CLEAR_DASHBOARDS_FILTER,
        }

        const currentState = 'rainbow'

        const actualState = reducer(currentState, action)

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS_FILTER)
    })

    it('gets the current filter from state', () => {
        const filterText = 'rainbow'
        const action = {
            type: SET_DASHBOARDS_FILTER,
            value: filterText,
        }
        const dashboardsFilter = reducer(null, action)
        const filterInState = sGetDashboardsFilter({ dashboardsFilter })

        expect(filterInState).toEqual(filterText)
    })
})
