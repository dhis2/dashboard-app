import {
    SET_DASHBOARDS,
    ADD_DASHBOARDS,
    SET_DASHBOARD_STARRED,
    SET_DASHBOARD_DISPLAY_NAME,
    SET_DASHBOARD_ITEMS,
    getCustomDashboards,
    sGetDashboardById,
    sGetDashboardsSortedByStarred,
} from '../reducers/dashboards'
import { NON_EXISTING_DASHBOARD_ID } from '../reducers/selected'
import { sGetUserUsername } from '../reducers/user'
import { tSetSelectedDashboardById, acSetSelectedId } from './selected'
import {
    apiFetchDashboards,
    apiStarDashboard,
    apiDeleteDashboard,
} from '../api/dashboards'
import { getPreferredDashboardId } from '../api/localStorage'
import { arrayToIdMap } from '../modules/util'

// actions

export const acSetDashboards = dashboards => ({
    type: SET_DASHBOARDS,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
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

export const acSetDashboardDisplayName = (dashboardId, value) => ({
    type: SET_DASHBOARD_DISPLAY_NAME,
    dashboardId,
    value,
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

export const tSelectDashboard = id => async (dispatch, getState) => {
    try {
        const state = getState()

        let dashboardToSelect = null
        if (id) {
            dashboardToSelect = sGetDashboardById(state, id) || null
        } else {
            const preferredId = getPreferredDashboardId(sGetUserUsername(state))
            const dash = sGetDashboardById(state, preferredId)
            dashboardToSelect =
                preferredId && dash
                    ? dash
                    : sGetDashboardsSortedByStarred(state)[0]
        }

        if (dashboardToSelect) {
            dispatch(tSetSelectedDashboardById(dashboardToSelect.id))
        } else {
            dispatch(acSetSelectedId(NON_EXISTING_DASHBOARD_ID))
        }
    } catch (err) {
        console.log('Error (apiFetchDashboards): ', err)
        return err
    }
}

export const tStarDashboard = (id, isStarred) => async (
    dispatch,
    getState,
    dataEngine
) => {
    const onSuccess = id => {
        dispatch(acSetDashboardStarred(id, isStarred))
        return id
    }

    try {
        await apiStarDashboard(dataEngine, id, isStarred)
        return onSuccess(id)
    } catch (err) {
        console.log('Error (apiStarDashboard): ', err)
        return err
    }
}

export const tDeleteDashboard = id => async (
    dispatch,
    getState,
    dataEngine
) => {
    try {
        await apiDeleteDashboard(dataEngine, id)
        await dispatch(tFetchDashboards())

        return Promise.resolve()
    } catch (err) {
        console.log('Error (deleteDashboard): ', err)
        return err
    }
}
