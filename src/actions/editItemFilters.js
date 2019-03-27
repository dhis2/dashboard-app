import { SET_EDIT_ITEM_FILTERS } from '../reducers/editItemFilters';

// actions

export const acSetEditItemFilters = filters => ({
    type: SET_EDIT_ITEM_FILTERS,
    filters,
});
