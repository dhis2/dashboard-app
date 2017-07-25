import { actionTypes } from '../reducers';

import { apiFetchDashboards } from '../api';

// dashboards objects
export const acSetDashboards = (dashboards) => ({
    type: actionTypes.SET_DASHBOARDS,
    dashboards
});

export const acDashboardsIsFetching = (isFetching) => ({
    type: actionTypes.SET_DASHBOARDS_ISFETCHING,
    isFetching: !!isFetching
});

// dashboardFilter objects
export const acSetDashboardsFilter = text => ({
    type: actionTypes.SET_DASHBOARDS_FILTER,
    text
});

// selectedDashboard objects
export const acSetSelectedDashboard = (id) => ({
    type: actionTypes.SET_SELECTED_DASHBOARD,
    id
});

// thunks
export const tSetDashboards = () => (dispatch, getState) => {
    dispatch(acDashboardsIsFetching(true));

    return apiFetchDashboards().then(dashboards => {
        dispatch(acDashboardsIsFetching(false));
        dispatch(acSetDashboardsFilter());
        dispatch(acSetDashboards(dashboards));
    });
};