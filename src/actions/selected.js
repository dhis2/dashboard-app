import i18n from '@dhis2/d2-i18n'
import {
    getCustomDashboards,
    sGetDashboardById,
    EMPTY_DASHBOARD,
} from '../reducers/dashboards'
import {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
    sGetSelectedIsLoading,
    sGetSelectedId,
} from '../reducers/selected'
import { sGetUserUsername } from '../reducers/user'

import { acSetDashboardItems, acAppendDashboards } from './dashboards'
import { acClearItemFilters } from './itemFilters'
import { tGetMessages } from '../components/Item/MessagesItem/actions'
import { acReceivedSnackbarMessage, acCloseSnackbar } from './snackbar'
import { acAddVisualization } from './visualizations'

import { apiFetchDashboard } from '../api/dashboards'
import { storePreferredDashboardId } from '../api/localStorage'
import {
    apiGetShowDescription,
    apiPostShowDescription,
} from '../api/description'

import { withShape } from '../components/ItemGrid/gridUtil'
import { extractFavorite } from '../components/Item/VisualizationItem/plugin'

import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    MESSAGES,
} from '../modules/itemTypes'

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

// thunks
export const tSetSelectedDashboardById = id => async (dispatch, getState) => {
    dispatch(acSetSelectedIsLoading(true))

    const snackbarTimeout = setTimeout(() => {
        const dashboardName = (
            sGetDashboardById(getState(), id) || EMPTY_DASHBOARD
        ).displayName

        if (sGetSelectedIsLoading(getState()) && dashboardName) {
            dispatch(
                acReceivedSnackbarMessage({
                    message: `${i18n.t('Loading dashboard')}: ${dashboardName}`,
                    open: true,
                })
            )
        }
    }, 500)

    const onSuccess = selected => {
        dispatch(acAppendDashboards(selected))

        const customDashboard = getCustomDashboards(selected)[0]

        dispatch(acSetDashboardItems(withShape(customDashboard.dashboardItems)))

        storePreferredDashboardId(sGetUserUsername(getState()), id)

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

        if (id !== sGetSelectedId(getState())) {
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
        const dashboard = await apiFetchDashboard(id)

        return onSuccess(dashboard)
    } catch (err) {
        return onError(err)
    }
}

export const tSetShowDescription = () => async dispatch => {
    const onSuccess = value => {
        dispatch(acSetSelectedShowDescription(value))
    }

    const onError = error => {
        console.log('Error (apiGetShowDescription): ', error)
        return error
    }

    try {
        const showDescription = await apiGetShowDescription()
        return onSuccess(showDescription)
    } catch (err) {
        return onError(err)
    }
}

export const tUpdateShowDescription = value => async dispatch => {
    const onSuccess = () => {
        dispatch(acSetSelectedShowDescription(value))
    }

    const onError = error => {
        console.log('Error (apiGetShowDescription): ', error)
        return error
    }

    try {
        await apiPostShowDescription(value)
        return onSuccess()
    } catch (err) {
        return onError(err)
    }
}
