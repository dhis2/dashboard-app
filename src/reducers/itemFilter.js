import objectClean from 'd2-utilizr/lib/objectClean';

export const actionTypes = {
    SET_ITEM_FILTER: 'SET_ITEM_FILTER',
};

const DEFAULT_FILTER = {};

const isEmpty = param => param === undefined || param === null;

export default (state = DEFAULT_FILTER, action) => {
    switch (action.type) {
        case actionTypes.SET_ITEM_FILTER: {
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

export const sGetFromState = state => state.itemFilter;
