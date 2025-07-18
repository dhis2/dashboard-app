import {
    ADD_ITEM_FILTER,
    REMOVE_ITEM_FILTER,
    CLEAR_ITEM_FILTERS,
} from '../reducers/itemFilters.js'

export const FILTER_ORG_UNIT = 'ou'
export const FILTER_PE = 'pe'

// actions

export const acAddItemFilter = (filter) => ({
    type: ADD_ITEM_FILTER,
    filter,
})

export const acRemoveItemFilter = (id) => ({
    type: REMOVE_ITEM_FILTER,
    id,
})

export const acClearItemFilters = () => ({
    type: CLEAR_ITEM_FILTERS,
})
