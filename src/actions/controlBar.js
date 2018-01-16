import { actionTypes } from '../reducers';

// actions

export const tSetControlBarRows = rows => ({
    type: actionTypes.SET_CONTROLBAR_ROWS,
    value: rows,
});

export const tSetControlBarExpanded = expanded => ({
    type: actionTypes.SET_CONTROLBAR_EXPANDED,
    value: !!expanded,
});
