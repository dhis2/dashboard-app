import { combineReducers } from 'redux';

import dashboards, { actionTypes as atDashboards, sGetDashboardsFromState, sGetDashboardById } from './dashboards';
import dashboardsFilter, { actionTypes as atDashboardsFilter, sGetDashboardsFilterFromState } from './dashboardsFilter';
import selectedDashboardId, { actionTypes as atSelectedDashboard, sGetSelectedDashboardIdFromState } from './selectedDashboard';
import dashboardsIsFetching, { actionTypes as atDashboardsIsFetching } from './dashboardsLoading';

// action types

export const actionTypes = Object.assign(
    {},
    atDashboards,
    atDashboardsFilter,
    atSelectedDashboard,
    atDashboardsIsFetching
);

// reducers

export default combineReducers({
    dashboards,
    dashboardsFilter,
    selectedDashboardId,
    dashboardsIsFetching
});

// selectors level 1

export { sGetDashboardsFromState } from './dashboards';

export { sGetDashboardsFilterFromState } from './dashboardsFilter';

export { sGetSelectedDashboardIdFromState } from './selectedDashboard';

export { sGetDashboardsIsFetchingFromState } from './dashboardsLoading';

// selectors level 2

export const sGetSelectedDashboard = state => sGetDashboardById(state, sGetSelectedDashboardIdFromState(state));

export const sGetDashboards = state => {
    const filter = sGetDashboardsFilterFromState(state).toLowerCase();
    const dashboardsFromState = sGetDashboardsFromState(state);

    return filter === '' ? dashboardsFromState : dashboardsFromState.filter(d => d.name.toLowerCase().indexOf(filter) !== -1);
};


