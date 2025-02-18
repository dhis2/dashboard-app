import { apiFetchDashboard } from '../api/fetchDashboard.js'
import { tGetMessages } from '../components/Item/MessagesItem/actions.js'
import { VIEW } from '../modules/dashboardModes.js'
import { MESSAGES } from '../modules/itemTypes.js'
import { storePreferredDashboardId } from '../modules/localStorage.js'
import {
    SET_SELECTED,
    CLEAR_SELECTED,
    SET_SELECTED_STARRED,
    sGetSelectedId,
} from '../reducers/selected.js'
import { acClearItemActiveTypes } from './itemActiveTypes.js'
import { acClearItemFilters } from './itemFilters.js'
import { acClearVisualizations } from './visualizations.js'

// actions

export const acSetSelected = (value) => ({
    type: SET_SELECTED,
    value,
})

export const acClearSelected = () => ({
    type: CLEAR_SELECTED,
})

export const acSetSelectedStarred = (isStarred) => ({
    type: SET_SELECTED_STARRED,
    value: isStarred,
})

// thunks
export const tSetSelectedDashboardById =
    (id, username) => async (dispatch, getState, dataEngine) => {
        const dashboard = await apiFetchDashboard(dataEngine, id, {
            mode: VIEW,
        })

        if (username) {
            storePreferredDashboardId(username, id)
        }

        if (id !== sGetSelectedId(getState())) {
            dispatch(acClearItemFilters())
            dispatch(acClearVisualizations())
            dispatch(acClearItemActiveTypes())
        }

        dashboard.dashboardItems.some((item) => item.type === MESSAGES) &&
            dispatch(tGetMessages(dataEngine))

        dispatch(acSetSelected(dashboard))
    }

export const tSetSelectedDashboardByIdOffline =
    (id, username) => (dispatch, getState) => {
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
