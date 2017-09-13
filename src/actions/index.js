import * as fromReducers from '../reducers';

import { apiFetchDashboards } from '../api';

const { actionTypes } = fromReducers;

// dashboards objects

export const acSetDashboards = dashboards => ({
    type: actionTypes.SET_DASHBOARDS,
    dashboards,
});

// dashboardsConfig objects

export const acSetDashboardsConfigIsFetching = isFetching => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING,
    isFetching,
});

export const acSetDashboardsConfigSelectedId = selectedId => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SELECTEDID,
    selectedId,
});

export const acSetDashboardsConfigTextFilter = textFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_TEXTFILTER,
    textFilter,
});

export const acSetDashboardsConfigShowFilter = showFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SHOWFILTER,
    showFilter,
});

export const acSetDashboardsConfigOwnerFilter = ownerFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_OWNERFILTER,
    ownerFilter,
});

export const acSetDashboardsConfigSortFilterKey = key => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY,
    key,
});

export const acSetDashboardsConfigSortFilterDirection = direction => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION,
    direction,
});

export const acSetDashboardsConfigViewFilter = viewFilter => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_VIEWFILTER,
    viewFilter,
});

// dashboards thunks

export const tSetDashboards = () => (dispatch, getState) => {
    dispatch(acSetDashboardsConfigIsFetching(true));

    return apiFetchDashboards().then((dashboards) => {
        dispatch(acSetDashboardsConfigIsFetching(false));
        dispatch(acSetDashboardsConfigTextFilter());
        dispatch(acSetDashboards(dashboards));
    });
};

// dashboardsConfig thunks

export const tSetPresetHome = () => (dispatch, getState) => {
    dispatch(acSetDashboardsConfigTextFilter());
    dispatch(acSetDashboardsConfigShowFilter());
    dispatch(acSetDashboardsConfigOwnerFilter());
    dispatch(acSetDashboardsConfigSortFilterKey());
    dispatch(acSetDashboardsConfigSortFilterDirection());
    dispatch(acSetDashboardsConfigViewFilter('LIST'));
};

export const tSetPresetManage = () => (dispatch, getState) => {
    dispatch(acSetDashboardsConfigTextFilter());
    dispatch(acSetDashboardsConfigShowFilter());
    dispatch(acSetDashboardsConfigOwnerFilter());
    dispatch(acSetDashboardsConfigSortFilterKey());
    dispatch(acSetDashboardsConfigSortFilterDirection());
    dispatch(acSetDashboardsConfigViewFilter('TABLE'));
};
