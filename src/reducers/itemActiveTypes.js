export const SET_ITEM_ACTIVE_TYPE = 'SET_ITEM_ACTIVE_TYPE'
export const CLEAR_ITEM_ACTIVE_TYPES = 'CLEAR_ITEM_ACTIVE_TYPES'

export const DEFAULT_STATE_ITEM_ACTIVE_TYPES = {}

export default (state = DEFAULT_STATE_ITEM_ACTIVE_TYPES, action) => {
    switch (action.type) {
        case SET_ITEM_ACTIVE_TYPE: {
            return {
                ...state,
                [action.id]: action.activeType,
            }
        }
        case CLEAR_ITEM_ACTIVE_TYPES: {
            return DEFAULT_STATE_ITEM_ACTIVE_TYPES
        }
        default:
            return state
    }
}

export const sGetItemActiveType = (state, id) => state.itemActiveTypes[id]
