const initialState = []

export const SET_OFFLINE_DASHBOARDS = 'SET_OFFLINE_DASHBOARDS'
export const STAR_OFFLINE_DASHBOARD = 'STAR_OFFLINE_DASHBOARD'

const offlineDashboards = (state = initialState, action) => {
    switch (action.type) {
        case SET_OFFLINE_DASHBOARDS:
            return action.dashboards

        case STAR_OFFLINE_DASHBOARD:
            return state.map((dashboard) =>
                dashboard.id === action.value.id
                    ? { ...dashboard, starred: action.value.starred }
                    : dashboard
            )

        default:
            return state
    }
}

export default offlineDashboards
