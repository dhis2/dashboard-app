import { SET_ITEM_FILTER } from '../reducers/itemFilter';

export const FILTER_USER_ORG_UNIT = 'userOrgUnit';

// actions

export const acSetItemFilter = (key, value) => ({
    type: SET_ITEM_FILTER,
    key,
    value,
});
