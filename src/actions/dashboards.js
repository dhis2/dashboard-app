import {
    SET_DASHBOARDS,
    ADD_DASHBOARDS,
    SET_DASHBOARD_STARRED,
    SET_DASHBOARD_ITEMS,
    sGetDashboardById,
    sGetDashboardsSortedByStarred,
} from '../reducers/dashboards'
import { NON_EXISTING_DASHBOARD_ID } from '../reducers/selected'
import { tSetSelectedDashboardById, acSetSelectedId } from './selected'
import { apiFetchDashboards } from '../api/fetchAllDashboards'
import { getPreferredDashboardId } from '../modules/localStorage'
import { arrayToIdMap } from '../modules/util'
import { getCustomDashboards } from '../modules/getCustomDashboards'

// actions

export const acSetDashboards = dashboards => ({
    type: SET_DASHBOARDS,
    value: arrayToIdMap(dashboards),
})

export const acAppendDashboards = dashboards => ({
    type: ADD_DASHBOARDS,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
})

export const acSetDashboardStarred = (dashboardId, isStarred) => ({
    type: SET_DASHBOARD_STARRED,
    dashboardId: dashboardId,
    value: isStarred,
})

export const acSetDashboardItems = value => ({
    type: SET_DASHBOARD_ITEMS,
    value,
})

// thunks

export const tFetchDashboards = () => async (
    dispatch,
    getState,
    dataEngine
) => {
    const dashboards = await apiFetchDashboards(dataEngine)
    dispatch(acSetDashboards(dashboards))
}

export const tSelectDashboard = (id, mode, username) => async (
    dispatch,
    getState
) => {
    try {
        const state = getState()

        let dashboardToSelect = null
        if (id) {
            dashboardToSelect = sGetDashboardById(state, id) || null
        } else {
            const preferredId = getPreferredDashboardId(username)
            const dash = sGetDashboardById(state, preferredId)
            dashboardToSelect =
                preferredId && dash
                    ? dash
                    : sGetDashboardsSortedByStarred(state)[0]
        }

        if (dashboardToSelect) {
            dispatch(
                tSetSelectedDashboardById(dashboardToSelect.id, mode, username)
            )
        } else {
            dispatch(acSetSelectedId(NON_EXISTING_DASHBOARD_ID))
        }
    } catch (err) {
        console.error('Error (apiFetchDashboards): ', err)
        return err
    }
}
