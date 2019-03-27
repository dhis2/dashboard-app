export const SET_EDIT_ITEM_FILTERS = 'SET_EDIT_ITEM_FILTERS';

export const DEFAULT_STATE_EDIT_ITEM_FILTERS = {};

export default (state = DEFAULT_STATE_EDIT_ITEM_FILTERS, action) => {
    switch (action.type) {
        case SET_EDIT_ITEM_FILTERS: {
            return action.filters;
        }
        default:
            return state;
    }
};

// selectors

export const sGetEditItemFiltersRoot = state => state.editItemFilters;

export const sGetEditFiltersKeys = state =>
    Object.keys(sGetEditItemFiltersRoot(state));
