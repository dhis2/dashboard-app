import {
    SET_ITEM_ACTIVE_TYPE,
    CLEAR_ITEM_ACTIVE_TYPES,
} from '../reducers/itemActiveTypes.js'

export const acSetItemActiveType = (id, activeType) => {
    const action = {
        type: SET_ITEM_ACTIVE_TYPE,
        id,
        activeType,
    }

    return action
}

export const acClearItemActiveTypes = () => ({
    type: CLEAR_ITEM_ACTIVE_TYPES,
})
