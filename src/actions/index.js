import * as fromReducers from '../reducers';

import { apiFetchDashboards } from '../api';
import { apiFetchSelectedDashboard } from '../api/index';

const { actionTypes } = fromReducers;

// object creators

// dashboards

export const acSetDashboards = (dashboards, append) => ({
    type: actionTypes.SET_DASHBOARDS,
    append: !!append,
    value: dashboards,
});

// dashboardsConfig

export const acSetDashboardsConfigIsFetching = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_ISFETCHING,
    value,
});

export const acSetDashboardsConfigSelectedId = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SELECTEDID,
    value,
});

export const acSetDashboardsConfigTextFilter = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_TEXTFILTER,
    value,
});

export const acSetDashboardsConfigShowFilter = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SHOWFILTER,
    value,
});

export const acSetDashboardsConfigOwnerFilter = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_OWNERFILTER,
    value,
});

export const acSetDashboardsConfigSortFilterKey = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_KEY,
    value,
});

export const acSetDashboardsConfigSortFilterDirection = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_SORTFILTER_DIRECTION,
    value,
});

export const acSetDashboardsConfigViewFilter = value => ({
    type: actionTypes.SET_DASHBOARDSCONFIG_VIEWFILTER,
    value,
});

// selectedDashboard

export const acSetSelectedDashboard = value => ({
    type: actionTypes.SET_SELECTEDDASHBOARD,
    value,
});

// thunk creators

// dashboards

export const tSetDashboards = () => (dispatch, getState) => {
    dispatch(acSetDashboardsConfigIsFetching(true));

    return apiFetchDashboards().then(dashboardCollection => {
        console.log(dashboardCollection.toArray());
        dispatch(acSetDashboardsConfigIsFetching(false));
        dispatch(acSetDashboardsConfigTextFilter());
        dispatch(
            acSetDashboards(
                fromReducers.fromDashboards.getDashboards(
                    dashboardCollection.toArray()
                )
            )
        );
    });
};

// dashboardsConfig

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

// selectedDashboard

export const tSetSelectedDashboard = id => dispatch => {
    // isFetching true

    console.log('t id', id);
    return apiFetchSelectedDashboard(id).then(what => {
        console.log('what', what);

        dispatch(acSetSelectedDashboard(what));

        // isFetching false
    });
};
