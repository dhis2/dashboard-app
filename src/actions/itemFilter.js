import { actionTypes } from '../reducers';

export const FILTER_USER_ORG_UNIT = 'userOrgUnit';

// actions

export const acSetItemFilter = (key, value) => ({
    type: actionTypes.SET_ITEM_FILTER,
    key,
    value,
});
