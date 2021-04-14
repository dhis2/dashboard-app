/** @module reducers/selected */
import { combineReducers } from 'redux'

import { validateReducer } from '../modules/util'

export const SET_SELECTED_ID = 'SET_SELECTED_ID'
export const SET_SELECTED_SHOWDESCRIPTION = 'SET_SELECTED_SHOWDESCRIPTION'
export const SET_SELECTED_ITEM_ACTIVE_TYPE = 'SET_SELECTED_ITEM_ACTIVE_TYPE'
export const CLEAR_SELECTED_ITEM_ACTIVE_TYPES =
    'CLEAR_SELECTED_ITEM_ACTIVE_TYPES'

export const DEFAULT_STATE_SELECTED_ID = null
export const DEFAULT_STATE_SELECTED_SHOWDESCRIPTION = false
export const DEFAULT_STATE_SELECTED_ITEM_ACTIVE_TYPES = {}

export const NON_EXISTING_DASHBOARD_ID = '0'

const id = (state = DEFAULT_STATE_SELECTED_ID, action) => {
    switch (action.type) {
        case SET_SELECTED_ID:
            return validateReducer(action.value, DEFAULT_STATE_SELECTED_ID)
        default:
            return state
    }
}

const showDescription = (
    state = DEFAULT_STATE_SELECTED_SHOWDESCRIPTION,
    action
) => {
    switch (action.type) {
        case SET_SELECTED_SHOWDESCRIPTION:
            return validateReducer(
                action.value,
                DEFAULT_STATE_SELECTED_SHOWDESCRIPTION
            )
        default:
            return state
    }
}

const itemActiveTypes = (
    state = DEFAULT_STATE_SELECTED_ITEM_ACTIVE_TYPES,
    action
) => {
    switch (action.type) {
        case SET_SELECTED_ITEM_ACTIVE_TYPE: {
            return {
                ...state,
                [action.id]: action.activeType,
            }
        }
        case CLEAR_SELECTED_ITEM_ACTIVE_TYPES: {
            return DEFAULT_STATE_SELECTED_ITEM_ACTIVE_TYPES
        }
        default:
            return state
    }
}

export default combineReducers({
    id,
    showDescription,
    itemActiveTypes,
})

// Selectors

export const sGetSelectedRoot = state => state.selected

export const sGetSelectedId = state => sGetSelectedRoot(state).id

export const sGetSelectedShowDescription = state =>
    sGetSelectedRoot(state).showDescription

export const sGetSelectedItemActiveType = (state, id) =>
    sGetSelectedRoot(state).itemActiveTypes[id]
