import isBoolean from 'd2-utilizr/lib/isBoolean';

export const actionTypes = {
    SET_DASHBOARDSCONFIG_ISFETCHING: 'SET_DASHBOARDSCONFIG_ISFETCHING',
    SET_DASHBOARDSCONFIG_SELECTEDID: 'SET_DASHBOARDSCONFIG_SELECTEDID',
    SET_DASHBOARDSCONFIG_TEXTFILTER: 'SET_DASHBOARDSCONFIG_TEXTFILTER',
    SET_DASHBOARDSCONFIG_SHOWFILTER: 'SET_DASHBOARDSCONFIG_SHOWFILTER',
    SET_DASHBOARDSCONFIG_SORTFILTER: 'SET_DASHBOARDSCONFIG_SORTFILTER',
    SET_DASHBOARDSCONFIG_VIEWFILTER: 'SET_DASHBOARDSCONFIG_VIEWFILTER'
};

export const DEFAULT_DASHBOARDSCONFIG_ISFETCHING = false;
export const DEFAULT_DASHBOARDSCONFIG_TEXTFILTER = '';
export const DEFAULT_DASHBOARDSCONFIG_SELECTEDID = null;

const isFetching = (state = DEFAULT_DASHBOARDSCONFIG_ISFETCHING, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING:
            return isBoolean(action.isFetching) ? action.isFetching : DEFAULT_DASHBOARDSCONFIG_ISFETCHING;
        default:
            return state;
    }
};

const selectedId = (state = DEFAULT_DASHBOARDSCONFIG_SELECTEDID, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDSCONFIG_SELECTEDID:
            return action.selectedId;
        default:
            return state;
    }
};

const textFilter = (state = DEFAULT_DASHBOARDSCONFIG_TEXTFILTER, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS_TEXTFILTER:
            return action.textFilter || DEFAULT_DASHBOARDSCONFIG_TEXTFILTER;
        default:
            return state;
    }
};

// selectors level 1

export const sGetDashboardsconfigIsFetchingFromState = state => state.isFetching;

export const sGetDashboardsconfigSelectedIdFromState = state => state.selectedId;

export const sGetDashboardsconfigTextFilterFromState = state => state.textFilter;






// selectors level 1
