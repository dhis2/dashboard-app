import { apiFetchDashboards } from '../api/fetchAllDashboards.js'
import { arrayToIdMap } from '../modules/util.js'
import {
    SET_DASHBOARDS,
    ADD_DASHBOARDS,
    SET_DASHBOARD_STARRED,
} from '../reducers/dashboards.js'

// actions

export const acSetDashboards = (dashboards) => ({
    type: SET_DASHBOARDS,
    value: arrayToIdMap(dashboards),
})

export const acAppendDashboards = (dashboards) => ({
    type: ADD_DASHBOARDS,
    value: arrayToIdMap(dashboards),
})

export const acSetDashboardStarred = (id, isStarred) => ({
    type: SET_DASHBOARD_STARRED,
    id,
    value: isStarred,
})

// thunks

export const tFetchDashboards =
    () => async (dispatch, getState, dataEngine) => {
        const dashboards = await apiFetchDashboards(dataEngine)
        return dispatch(acSetDashboards(dashboards))
    }
