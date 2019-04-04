export const SET_ITEM_FILTERS = 'SET_ITEM_FILTERS';
export const ADD_ITEM_FILTER = 'ADD_ITEM_FILTER';
export const REMOVE_ITEM_FILTER = 'REMOVE_ITEM_FILTER';

export const DEFAULT_STATE_ITEM_FILTERS = {};

export default (state = DEFAULT_STATE_ITEM_FILTERS, action) => {
    switch (action.type) {
        case ADD_ITEM_FILTER: {
            return {
                ...state,
                [action.filter.id]: action.filter.value,
            };
        }
        case REMOVE_ITEM_FILTER: {
            const newState = { ...state };

            delete newState[action.id];

            return newState;
        }
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
