import objectClean from 'd2-utilizr/lib/objectClean';
import isEmpty from 'd2-utilizr/lib/isEmpty';

export const SET_ITEM_FILTER = 'SET_ITEM_FILTER';

export const DEFAULT_STATE_ITEM_FILTER = {};

export default (state = DEFAULT_STATE_ITEM_FILTER, action) => {
    switch (action.type) {
        case SET_ITEM_FILTER: {
            return objectClean(
                {
                    ...state,
                    [action.key]: action.value,
                },
                isEmpty
            );
        }
        default:
            return state;
    }
};

// selectors

export const sGetItemFilterRoot = state => state.itemFilter;

export const sGetFilterKeys = state => Object.keys(sGetItemFilterRoot(state));
