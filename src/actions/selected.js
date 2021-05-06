import { SET_SELECTED, sGetSelectedId } from '../reducers/selected'

import { acAppendDashboards } from './dashboards'
import { acClearItemFilters } from './itemFilters'
import { tGetMessages } from '../components/Item/MessagesItem/actions'
import { acClearVisualizations } from './visualizations'
import { acClearItemActiveTypes } from './itemActiveTypes'
import { apiFetchDashboard } from '../api/fetchDashboard'
import { storePreferredDashboardId } from '../modules/localStorage'
import { MESSAGES } from '../modules/itemTypes'
import { VIEW } from '../modules/dashboardModes'

// actions

export const acSetSelected = value => ({
    type: SET_SELECTED,
    value,
})

// thunks
export const tSetSelectedDashboardById = (id, username) => (
    dispatch,
    getState,
    dataEngine
) => {
    return apiFetchDashboard(dataEngine, id, { mode: VIEW }).then(dashboard => {
        //add the dashboard to the list of dashboards if not already there
        dispatch(
            acAppendDashboards([
                {
                    id: dashboard.id,
                    displayName: dashboard.displayName,
                    starred: dashboard.starred,
                },
            ])
        )

        if (username) {
            storePreferredDashboardId(username, id)
        }

        if (id !== sGetSelectedId(getState())) {
            dispatch(acClearItemFilters())
            dispatch(acClearVisualizations())
            dispatch(acClearItemActiveTypes())
        }

        dashboard.dashboardItems.some(item => item.type === MESSAGES) &&
            dispatch(tGetMessages(dataEngine))

        dispatch(acSetSelected(dashboard))

        return dashboard
    })
}

export const tSetSelectedDashboardByIdOffline = (id, username) => (
    dispatch,
    getState
) => {
    if (username) {
        storePreferredDashboardId(username, id)
    }

    if (id !== sGetSelectedId(getState())) {
        dispatch(acClearItemFilters())
        dispatch(acClearVisualizations())
        dispatch(acClearItemActiveTypes())
    }

    dispatch(acSetSelected({ id }))
}
