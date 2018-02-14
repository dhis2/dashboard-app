import { actionTypes } from '../reducers';

// actions

export const acSetItemFilter = (dimensionId, value) => ({
    type: actionTypes.SET_ITEM_FILTER,
    dimensionId,
    value,
});
