import {
    SET_DASHBOARDS_FILTER,
    CLEAR_DASHBOARDS_FILTER,
} from '../reducers/dashboardsFilter.js'

// actions

export const acSetDashboardsFilter = (value) => ({
    type: SET_DASHBOARDS_FILTER,
    value,
})

/* TODO: Possibly this action can be removed if we keep a an input
 * with type="search". Clicking the cross in the input will send an
 * an empty string as payload to the onchange handler. So just calling
 * acSetDashboardsFilter on change will be enough */
export const acClearDashboardsFilter = () => ({
    type: CLEAR_DASHBOARDS_FILTER,
})
