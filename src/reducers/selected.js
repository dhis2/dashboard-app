/** @module reducers/selected */
import { combineReducers } from 'redux'

import { validateReducer } from '../modules/util'

export const SET_SELECTED_ID = 'SET_SELECTED_ID'
export const DEFAULT_STATE_SELECTED_ID = null

export const NON_EXISTING_DASHBOARD_ID = '0'

const id = (state = DEFAULT_STATE_SELECTED_ID, action) => {
    switch (action.type) {
        case SET_SELECTED_ID:
            return validateReducer(action.value, DEFAULT_STATE_SELECTED_ID)
        default:
            return state
    }
}

export default combineReducers({
    id,
})

// Selectors

export const sGetSelectedRoot = state => state.selected

export const sGetSelectedId = state => sGetSelectedRoot(state).id
