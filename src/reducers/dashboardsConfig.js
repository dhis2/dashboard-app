import { combineReducers } from 'redux';

import { validateReducer } from './index';

export const actionTypes = {
    SET_DASHBOARDSCONFIG_ISFETCHING: 'SET_DASHBOARDSCONFIG_ISFETCHING',
    SET_DASHBOARDSCONFIG_SELECTEDID: 'SET_DASHBOARDSCONFIG_SELECTEDID',
    SET_DASHBOARDSCONFIG_TEXTFILTER: 'SET_DASHBOARDSCONFIG_TEXTFILTER',
    SET_DASHBOARDSCONFIG_SHOWFILTER: 'SET_DASHBOARDSCONFIG_SHOWFILTER',
    SET_DASHBOARDSCONFIG_SORTFILTER_KEY: 'SET_DASHBOARDSCONFIG_SORTFILTER_KEY',
    SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION: 'SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION',
    SET_DASHBOARDSCONFIG_VIEWFILTER: 'SET_DASHBOARDSCONFIG_VIEWFILTER'
};

export const showFilterValues = {
    ALL: 'ALL',
    STARRED: 'STARRED'
};

export const sortFilterKeyValues = {
    NAME: 'NAME',
    ITEMS: 'ITEMS',
    CREATED: 'CREATED'
};

export const sortFilterDirectionValues = {
    ASC: 'ASC',
    DESC: 'DESC'
};

export const viewFilterValues = {
    LIST: 'LIST',
    TABLE: 'TABLE'
};

export const DEFAULT_DASHBOARDSCONFIG_ISFETCHING = false;
export const DEFAULT_DASHBOARDSCONFIG_SELECTEDID = 'nghVC4wtyzi';
export const DEFAULT_DASHBOARDSCONFIG_TEXTFILTER = '';
export const DEFAULT_DASHBOARDSCONFIG_SHOWFILTER = showFilterValues.ALL;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY = sortFilterKeyValues.NAME;
export const DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION = sortFilterDirectionValues.ASC;
export const DEFAULT_DASHBOARDSCONFIG_VIEWFILTER = viewFilterValues.LIST;

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

const key = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY:
            return validateReducer(action.key, DEFAULT_DASHBOARDSCONFIG_SORTFILTER_KEY);
        default:
            return state;
    }
};

const direction = (state = DEFAULT_DASHBOARDSCONFIG_SORTFILTER_DIRECTION, action) => {
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
    sortFilter: combineReducers({
        key,
        direction
    }),
    viewFilter
});

// root selector

export const sGetDashboardsConfigFromState = state => state.dashboardsConfig;

// selectors level 2

export const sGetIsFetchingFromState = state => sGetDashboardsConfigFromState(state).isFetching;

export const sGetSelectedIdFromState = state => sGetDashboardsConfigFromState(state).selectedId;

export const sGetTextFilterFromState = state => sGetDashboardsConfigFromState(state).textFilter;

export const sGetShowFilterFromState = state => sGetDashboardsConfigFromState(state).showFilter;

export const sGetSortFilterFromState = state => sGetDashboardsConfigFromState(state).sortFilter;

export const sGetViewFilterFromState = state => sGetDashboardsConfigFromState(state).viewFilter;

// selectors level 3

export const sGetSortFilterId = state => {
    var sortFilter = sGetSortFilterFromState(state);
    return sortFilter.key + '_' + sortFilter.direction;
};

// utils

export const uGetSortFilterFromId = id => {
    const [key, direction] = id.split('_');

    return {
        key,
        direction
    };
};




