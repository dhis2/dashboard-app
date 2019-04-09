import {
    ADD_ITEM_FILTER,
    REMOVE_ITEM_FILTER,
    SET_ITEM_FILTERS,
} from '../reducers/itemFilters';

export const FILTER_ORG_UNIT = 'ou';

// actions

export const acAddItemFilter = filter => ({
    type: ADD_ITEM_FILTER,
    filter,
});

export const acRemoveItemFilter = id => ({
    type: REMOVE_ITEM_FILTER,
    id,
});

export const acSetItemFilters = filters => ({
    type: SET_ITEM_FILTERS,
    filters,
});
