import { actionTypes } from '../reducers';

import { apiFetchDashboards } from '../api';

// dashboards objects
export const acSetDashboards = dashboards => ({
    type: actionTypes.SET_DASHBOARDS,
    dashboards
});

export const acSetDashboardsConfigIsFetching = isFetching => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING,
    isFetching: !!isFetching
});

export const acSetDashboardsConfigSelectedId = id => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SELECTEDID,
    id
});

export const acSetDashboardsConfigTextFilter = textFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_TEXTFILTER,
    textFilter
});

export const acSetDashboardsConfigShowFilter = showFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SHOWFILTER,
    showFilter
});

export const acSetDashboardsConfigSortFilterKey = key => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY,
    key
});

export const acSetDashboardsConfigSortFilterDirection = direction => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION,
    direction
});

export const acSetDashboardsConfigViewFilter = viewFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_VIEWFILTER,
    viewFilter
});

// thunks
export const tSetDashboards = () => (dispatch, getState) => {
    dispatch(acSetDashboardsConfigIsFetching(true));

    return apiFetchDashboards().then(dashboards => {
        dispatch(acSetDashboardsConfigIsFetching(false));
        dispatch(acSetDashboardsConfigTextFilter());
        dispatch(acSetDashboards(dashboards));
    });
};