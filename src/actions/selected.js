import { getCustomDashboards, sGetDashboardById } from '../reducers/dashboards'
import { sGetIsEditing } from '../reducers/editDashboard'
import { sGetEditItemFiltersRoot } from '../reducers/editItemFilters'
import {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
    SET_SELECTED_DASHBOARD_MODE,
    sGetSelectedIsLoading,
    sGetSelectedId,
} from '../reducers/selected'
import { sGetUserUsername } from '../reducers/user'

import { acSetDashboardItems, acAppendDashboards } from './dashboards'
import { acClearEditItemFilters } from './editItemFilters'
import { acClearItemFilters, acSetItemFilters } from './itemFilters'
import { tGetMessages } from '../components/Item/MessagesItem/actions'
import { acReceivedSnackbarMessage, acCloseSnackbar } from './snackbar'
import { acAddVisualization } from './visualizations'

import { apiFetchDashboard } from '../api/dashboards'
import { storePreferredDashboardId } from '../api/localStorage'

import { withShape } from '../modules/gridUtil'
import { loadingDashboardMsg } from '../components/SnackbarMessage/SnackbarMessage'
import { extractFavorite } from '../components/Item/VisualizationItem/plugin'

import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    MESSAGES,
} from '../modules/itemTypes'
import { orObject } from '../modules/util'

// actions

export const acSetSelectedId = value => ({
    type: SET_SELECTED_ID,
    value,
})

export const acSetSelectedIsLoading = value => ({
    type: SET_SELECTED_ISLOADING,
    value,
})

export const acSetSelectedShowDescription = value => ({
    type: SET_SELECTED_SHOWDESCRIPTION,
    value,
})

export const acSetSelectedDashboardMode = value => ({
    type: SET_SELECTED_DASHBOARD_MODE,
    value,
})

export const tLoadDashboard = id => async dispatch => {
    try {
        const dash = await apiFetchDashboard(id)

        dispatch(acAppendDashboards(dash))

        return Promise.resolve(dash)
    } catch (err) {
        console.log('Error: ', err)
        return err
    }
}

// thunks
export const tSetSelectedDashboardById = id => async (dispatch, getState) => {
    dispatch(acSetSelectedIsLoading(true))

    const snackbarTimeout = setTimeout(() => {
        const dashboardName = orObject(sGetDashboardById(getState(), id))
            .displayName
        if (sGetSelectedIsLoading(getState()) && dashboardName) {
            loadingDashboardMsg.name = dashboardName

            dispatch(
                acReceivedSnackbarMessage({
                    message: loadingDashboardMsg,
                    open: true,
                })
            )
        }
    }, 500)

    const onSuccess = selected => {
        const customDashboard = getCustomDashboards(selected)[0]

        dispatch(acSetDashboardItems(withShape(customDashboard.dashboardItems)))

        storePreferredDashboardId(sGetUserUsername(getState()), id)

        // add visualizations to store
        customDashboard.dashboardItems.forEach(item => {
            switch (item.type) {
                case REPORT_TABLE:
                case CHART:
                case MAP:
                case EVENT_REPORT:
                case EVENT_CHART:
                    dispatch(acAddVisualization(extractFavorite(item)))
                    break
                case MESSAGES:
                    dispatch(tGetMessages(id))
                    break
                default:
                    break
            }
        })

        const state = getState()
        if (id === sGetSelectedId(state)) {
            if (sGetIsEditing(state)) {
                // disable filters when switching to edit mode
                dispatch(acClearItemFilters())
            } else {
                // enable filters when switching to view mode
                dispatch(acSetItemFilters(sGetEditItemFiltersRoot(state)))
            }
        } else {
            // clear filters when switching dashboard
            dispatch(acClearEditItemFilters())
            dispatch(acClearItemFilters())
        }

        dispatch(acSetSelectedId(id))

        dispatch(acSetSelectedIsLoading(false))

        clearTimeout(snackbarTimeout)

        dispatch(acCloseSnackbar())

        return selected
    }

    const onError = error => {
        console.log('Error: ', error)
        return error
    }

    try {
        const selected = await dispatch(tLoadDashboard(id))

        return onSuccess(selected)
    } catch (err) {
        return onError(err)
    }
}
