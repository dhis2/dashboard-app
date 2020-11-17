import {
    SET_DASHBOARDS_FILTER,
    CLEAR_DASHBOARDS_FILTER,
} from '../reducers/dashboardsFilter'

// actions

export const acSetDashboardsFilter = value => ({
    type: SET_DASHBOARDS_FILTER,
    value,
})

export const acClearDashboardsFilter = () => ({
    type: CLEAR_DASHBOARDS_FILTER,
})
