import { SET_SELECTED_ID, sGetSelectedId } from '../reducers/selected'

import { acSetDashboardItems, acAppendDashboards } from './dashboards'
import { acClearItemFilters } from './itemFilters'
import { tGetMessages } from '../components/Item/MessagesItem/actions'
import { acClearVisualizations } from './visualizations'
import { acClearItemActiveTypes } from './itemActiveTypes'
import { apiFetchDashboard } from '../api/fetchDashboard'
import { storePreferredDashboardId } from '../modules/localStorage'

import { withShape } from '../modules/gridUtil'
import { getCustomDashboards } from '../modules/getCustomDashboards'

import { MESSAGES } from '../modules/itemTypes'

// actions

export const acSetSelectedId = value => ({
    type: SET_SELECTED_ID,
    value,
})

// thunks
export const tSetSelectedDashboardById = (id, mode, username) => (
    dispatch,
    getState,
    dataEngine
) => {
    return apiFetchDashboard(dataEngine, id, mode).then(selected => {
        dispatch(acAppendDashboards(selected))

        const customDashboard = getCustomDashboards(selected)[0]

        dispatch(acSetDashboardItems(withShape(customDashboard.dashboardItems)))

        if (username) {
            storePreferredDashboardId(username, id)
        }

        if (id !== sGetSelectedId(getState())) {
            dispatch(acClearItemFilters())
            dispatch(acClearVisualizations())
            dispatch(acClearItemActiveTypes())
        }

        customDashboard.dashboardItems.some(item => item.type === MESSAGES) &&
            dispatch(tGetMessages(dataEngine))

        dispatch(acSetSelectedId(id))

        return selected
    })
}
