import { combineReducers } from 'redux';

import { validateReducer } from './index';

import { getById } from '../util';

export const actionTypes = {
    SET_DASHBOARDSCONFIG_ISFETCHING: 'SET_DASHBOARDSCONFIG_ISFETCHING',
    SET_DASHBOARDSCONFIG_SELECTEDID: 'SET_DASHBOARDSCONFIG_SELECTEDID',
    SET_DASHBOARDSCONFIG_TEXTFILTER: 'SET_DASHBOARDSCONFIG_TEXTFILTER',
    SET_DASHBOARDSCONFIG_SHOWFILTER: 'SET_DASHBOARDSCONFIG_SHOWFILTER',
    SET_DASHBOARDSCONFIG_OWNERFILTER: 'SET_DASHBOARDSCONFIG_OWNERFILTER',
    SET_DASHBOARDSCONFIG_SORTFILTER_KEY: 'SET_DASHBOARDSCONFIG_SORTFILTER_KEY',
    SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION: 'SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION',
    SET_DASHBOARDSCONFIG_VIEWFILTER: 'SET_DASHBOARDSCONFIG_VIEWFILTER',
};

export const showFilterValues = [
    { id: 'ALL', value: 'All items' },
    { id: 'STARRED', value: 'Starred' },
    { id: 'UNSTARRED', value: 'Unstarred' },
];

export const ownerFilterValues = [
    { id: 'ALL', value: 'All items' },
    { id: 'ME', value: 'Created by me' },
    { id: 'OTHERS', value: 'Created by others' },
];

export const sortFilterKeyValues = [
    { id: 'NAME', value: 'Name' },
    { id: 'ITEMS', value: 'Number of items' },
    { id: 'CREATED', value: 'Created date' },
];

export const sortFilterDirectionValues = [
    { id: 'ASC', value: 'asc' },
    { id: 'DESC', value: 'desc' },
];

export const sortFilterValues = [
    { id: `${sortFilterKeyValues[0].id}_${sortFilterDirectionValues[0].id}`, value: `${sortFilterKeyValues[0].value} (${sortFilterDirectionValues[0].value})` },
    { id: `${sortFilterKeyValues[0].id}_${sortFilterDirectionValues[1].id}`, value: `${sortFilterKeyValues[0].value} (${sortFilterDirectionValues[1].value})` },
    { id: `${sortFilterKeyValues[1].id}_${sortFilterDirectionValues[0].id}`, value: `${sortFilterKeyValues[1].value} (${sortFilterDirectionValues[0].value})` },
    { id: `${sortFilterKeyValues[1].id}_${sortFilterDirectionValues[1].id}`, value: `${sortFilterKeyValues[1].value} (${sortFilterDirectionValues[1].value})` },
    { id: `${sortFilterKeyValues[2].id}_${sortFilterDirectionValues[0].id}`, value: `${sortFilterKeyValues[2].value} (${sortFilterDirectionValues[0].value})` },
    { id: `${sortFilterKeyValues[2].id}_${sortFilterDirectionValues[1].id}`, value: `${sortFilterKeyValues[2].value} (${sortFilterDirectionValues[1].value})` },
];

export const viewFilterValues = [
    { id: 'LIST', value: 'List' },
    { id: 'TABLE', value: 'Table' },
];

export const DEFAULT_DASHBOARDSCONFIG_ISFETCHING = false;
export const DEFAULT_DASHBOARDSCONFIG_SELECTEDID = '';
export const DEFAULT_DASHBOARDSCONFIG_TEXTFILTER = '';
export const DEFAULT_DASHBOARDSCONFIG_SHOWFILTER = showFilterValues[0].id;
export const DEFAULT_DASHBOARDSCONFIG_OWNERFILTER = ownerFilterValues[0].id;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY = sortFilterKeyValues[0].id;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION = sortFilterDirectionValues[0].id;
export const DEFAULT_DASHBOARDSCONFIG_VIEWFILTER = viewFilterValues[0].id;

const isFetching = (state = DEFAULT_DASHBOARDSCONFIG_ISFETCHING, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING:
        return validateReducer(action.isFetching, DEFAULT_DASHBOARDSCONFIG_ISFETCHING);
    default:
        return state;
    }
};

const selectedId = (state = DEFAULT_DASHBOARDSCONFIG_SELECTEDID, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SELECTEDID:
        return validateReducer(action.selectedId, DEFAULT_DASHBOARDSCONFIG_SELECTEDID);
    default:
        return state;
    }
};

const textFilter = (state = DEFAULT_DASHBOARDSCONFIG_TEXTFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_TEXTFILTER:
        return validateReducer(action.textFilter, DEFAULT_DASHBOARDSCONFIG_TEXTFILTER);
    default:
        return state;
    }
};

const showFilter = (state = DEFAULT_DASHBOARDSCONFIG_SHOWFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SHOWFILTER:
        return validateReducer(action.showFilter, DEFAULT_DASHBOARDSCONFIG_SHOWFILTER);
    default:
        return state;
    }
};

const ownerFilter = (state = DEFAULT_DASHBOARDSCONFIG_OWNERFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_OWNERFILTER:
        return validateReducer(action.ownerFilter, DEFAULT_DASHBOARDSCONFIG_OWNERFILTER);
    default:
        return state;
    }
};

const keyFilter = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY:
        return validateReducer(action.key, DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY);
    default:
        return state;
    }
};

const directionFilter = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION:
        return validateReducer(action.direction, DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION);
    default:
        return state;
    }
};

const viewFilter = (state = DEFAULT_DASHBOARDSCONFIG_VIEWFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_VIEWFILTER:
        return validateReducer(action.viewFilter, DEFAULT_DASHBOARDSCONFIG_VIEWFILTER);
    default:
        return state;
    }
};

export default combineReducers({
    isFetching,
    selectedId,
    textFilter,
    showFilter,
    ownerFilter,
    sortFilter: combineReducers({
        keyFilter,
        directionFilter,
    }),
    viewFilter,
});

// root selector

export const sGetDashboardsConfigFromState = state => state.dashboardsConfig;

// selectors level 2

export const sGetIsFetchingFromState = state => sGetDashboardsConfigFromState(state).isFetching;

export const sGetSelectedIdFromState = state => sGetDashboardsConfigFromState(state).selectedId;

export const sGetTextFilterFromState = state => sGetDashboardsConfigFromState(state).textFilter;

export const sGetShowFilterFromState = state => sGetDashboardsConfigFromState(state).showFilter;

export const sGetOwnerFilterFromState = state => sGetDashboardsConfigFromState(state).ownerFilter;

export const sGetSortFilterFromState = state => sGetDashboardsConfigFromState(state).sortFilter;

export const sGetViewFilterFromState = state => sGetDashboardsConfigFromState(state).viewFilter;

// selectors level 3

export const sGetSortFilterId = (state) => {
    const sortFilter = sGetSortFilterFromState(state);
    return `${sortFilter.key}_${sortFilter.direction}`;
};

// utils

export const uGetSortFilterFromId = (id) => {
    const [key, direction] = id.split('_');

    return {
        key,
        direction,
    };
};
