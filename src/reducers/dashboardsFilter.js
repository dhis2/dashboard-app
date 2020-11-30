import { validateReducer } from '../modules/util'

export const SET_DASHBOARDS_FILTER = 'SET_DASHBOARDS_FILTER'
export const CLEAR_DASHBOARDS_FILTER = 'CLEAR_DASHBOARDS_FILTER'

export const DEFAULT_STATE_DASHBOARDS_FILTER = ''

export default (state = DEFAULT_STATE_DASHBOARDS_FILTER, action) => {
    switch (action.type) {
        case SET_DASHBOARDS_FILTER: {
            return validateReducer(
                action.value,
                DEFAULT_STATE_DASHBOARDS_FILTER
            )
        }
        case CLEAR_DASHBOARDS_FILTER: {
            return DEFAULT_STATE_DASHBOARDS_FILTER
        }
        default:
            return state
    }
}

// selectors

export const sGetDashboardsFilter = state => state.dashboardsFilter
