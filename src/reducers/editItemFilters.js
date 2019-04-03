export const REMOVE_EDIT_ITEM_FILTER = 'REMOVE_EDIT_ITEM_FILTER';
export const SET_EDIT_ITEM_FILTERS = 'SET_EDIT_ITEM_FILTERS';

export const DEFAULT_STATE_EDIT_ITEM_FILTERS = {};

export default (state = DEFAULT_STATE_EDIT_ITEM_FILTERS, action) => {
    switch (action.type) {
        case REMOVE_EDIT_ITEM_FILTER: {
            const newState = { ...state };

            delete newState[action.id];

            return newState;
        }
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
