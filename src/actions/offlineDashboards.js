import {
    SET_OFFLINE_DASHBOARDS,
    STAR_OFFLINE_DASHBOARD,
} from '../reducers/offlineDashboards.js'

// Action creators
export const acSetOfflineDashboards = (dashboards) => ({
    type: SET_OFFLINE_DASHBOARDS,
    dashboards,
})

export const acSetOfflineDashboardStarred = (value) => ({
    type: STAR_OFFLINE_DASHBOARD,
    value,
})
