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
