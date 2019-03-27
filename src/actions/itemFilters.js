import { SET_ITEM_FILTERS } from '../reducers/itemFilters';

export const FILTER_ORG_UNIT = 'ou';

// actions

export const acSetItemFilters = filters => ({
    type: SET_ITEM_FILTERS,
    filters,
});
