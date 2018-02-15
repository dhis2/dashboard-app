import { actionTypes } from '../reducers';

// actions

export const acSetItemFilter = (key, value) => ({
    type: actionTypes.SET_ITEM_FILTER,
    key,
    value,
});
