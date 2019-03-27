export const SET_ITEM_FILTERS = 'SET_ITEM_FILTERS';

export const DEFAULT_STATE_ITEM_FILTERS = {};

export default (state = DEFAULT_STATE_ITEM_FILTERS, action) => {
    switch (action.type) {
        case SET_ITEM_FILTERS: {
            return action.filters;
        }
        default:
            return state;
    }
};

// selectors

export const sGetItemFiltersRoot = state => state.itemFilters;

export const sGetFiltersKeys = state => Object.keys(sGetItemFiltersRoot(state));
