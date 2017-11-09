import { combineReducers } from 'redux';
import { validateReducer } from '../util';

export const actionTypes = {
    SET_DASHBOARDSCONFIG_ISFETCHING: 'SET_DASHBOARDSCONFIG_ISFETCHING',
    SET_DASHBOARDSCONFIG_TEXTFILTER: 'SET_DASHBOARDSCONFIG_TEXTFILTER',
    SET_DASHBOARDSCONFIG_SHOWFILTER: 'SET_DASHBOARDSCONFIG_SHOWFILTER',
    SET_DASHBOARDSCONFIG_OWNERFILTER: 'SET_DASHBOARDSCONFIG_OWNERFILTER',
    SET_DASHBOARDSCONFIG_SORTFILTER_KEY: 'SET_DASHBOARDSCONFIG_SORTFILTER_KEY',
    SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION: 'SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION',
    SET_DASHBOARDSCONFIG_VIEWFILTER: 'SET_DASHBOARDSCONFIG_VIEWFILTER',
};

export const showFilterData = [
    { id: 'ALL', value: 'All items' },
    { id: 'STARRED', value: 'Starred' },
    { id: 'UNSTARRED', value: 'Unstarred' },
];

export const ownerFilterData = [
    { id: 'ALL', value: 'All users' },
    { id: 'ME', value: 'Created by me' },
    { id: 'OTHERS', value: 'Created by others' },
];

export const sortFilterKeyData = [
    { id: 'NAME', value: 'Name' },
    { id: 'ITEMS', value: 'Number of items' },
    { id: 'CREATED', value: 'Created date' },
];

export const sortFilterDirectionData = [
    { id: 'ASC', value: 'asc' },
    { id: 'DESC', value: 'desc' },
];

export const sortFilterData = [
    { id: `${sortFilterKeyData[0].id}_${sortFilterDirectionData[0].id}`, value: `${sortFilterKeyData[0].value} (${sortFilterDirectionData[0].value})` },
    { id: `${sortFilterKeyData[0].id}_${sortFilterDirectionData[1].id}`, value: `${sortFilterKeyData[0].value} (${sortFilterDirectionData[1].value})` },
    { id: `${sortFilterKeyData[1].id}_${sortFilterDirectionData[0].id}`, value: `${sortFilterKeyData[1].value} (${sortFilterDirectionData[0].value})` },
    { id: `${sortFilterKeyData[1].id}_${sortFilterDirectionData[1].id}`, value: `${sortFilterKeyData[1].value} (${sortFilterDirectionData[1].value})` },
    { id: `${sortFilterKeyData[2].id}_${sortFilterDirectionData[0].id}`, value: `${sortFilterKeyData[2].value} (${sortFilterDirectionData[0].value})` },
    { id: `${sortFilterKeyData[2].id}_${sortFilterDirectionData[1].id}`, value: `${sortFilterKeyData[2].value} (${sortFilterDirectionData[1].value})` },
];

export const viewFilterData = [
    { id: 'LIST', value: 'List' },
    { id: 'TABLE', value: 'Table' },
];

export const DEFAULT_DASHBOARDSCONFIG_ISFETCHING = false;
export const DEFAULT_DASHBOARDSCONFIG_TEXTFILTER = '';
export const DEFAULT_DASHBOARDSCONFIG_SHOWFILTER = showFilterData[0].id;
export const DEFAULT_DASHBOARDSCONFIG_OWNERFILTER = ownerFilterData[0].id;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY = sortFilterKeyData[0].id;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION = sortFilterDirectionData[0].id;
export const DEFAULT_DASHBOARDSCONFIG_VIEWFILTER = viewFilterData[0].id;

const isFetching = (state = DEFAULT_DASHBOARDSCONFIG_ISFETCHING, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_ISFETCHING);
    default:
        return state;
    }
};

const textFilter = (state = DEFAULT_DASHBOARDSCONFIG_TEXTFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_TEXTFILTER:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_TEXTFILTER);
    default:
        return state;
    }
};

const showFilter = (state = DEFAULT_DASHBOARDSCONFIG_SHOWFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SHOWFILTER:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_SHOWFILTER);
    default:
        return state;
    }
};

const ownerFilter = (state = DEFAULT_DASHBOARDSCONFIG_OWNERFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_OWNERFILTER:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_OWNERFILTER);
    default:
        return state;
    }
};

const keyFilter = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY);
    default:
        return state;
    }
};

const directionFilter = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION);
    default:
        return state;
    }
};

const viewFilter = (state = DEFAULT_DASHBOARDSCONFIG_VIEWFILTER, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDSCONFIG_VIEWFILTER:
        return validateReducer(action.value, DEFAULT_DASHBOARDSCONFIG_VIEWFILTER);
    default:
        return state;
    }
};

export default combineReducers({
    isFetching,
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

// root selectors level 2

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
    return `${sortFilter.keyFilter}_${sortFilter.directionFilter}`;
};

// utils

export const uGetSortFilterFromId = (id) => {
    const [key, direction] = id.split('_');

    return {
        key,
        direction,
    };
};
