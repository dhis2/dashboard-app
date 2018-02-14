import { combineReducers } from 'redux';
import { validateReducer } from '../util';

export const actionTypes = {
    SET_ITEM_FILTER: 'SET_ITEM_FILTER',
};

const DEFAULT_FILTER = {};

export default (state = DEFAULT_FILTER, action) => {
    switch (action.type) {
        case actionTypes.SET_ITEM_FILTER: {
            return {
                ...state,
                [action.dimensionId]: action.value,
            };
        }
        default:
            return state;
    }
};

// creator

export const acSetItemFilter = (dimensionId, value) => ({
    type: actionTypes.SET_ITEM_FILTER,
    dimensionId,
    value,
});
