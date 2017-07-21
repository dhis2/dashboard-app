import { combineReducers } from 'redux';

import dashboards, { actionTypes as atDashboards, getDashboardsFromState, getDashboardById } from './dashboards';
import dashboardFilter, { actionTypes as atDashboardFilter, getDashboardFilterFromState } from './dashboardFilter';
import selectedDashboardId, { actionTypes as atSelectedDashboard, getSelectedDashboardIdFromState } from './selectedDashboard';

// action types

export const actionTypes = Object.assign(
    {},
    atDashboards,
    atDashboardFilter,
    atSelectedDashboard
);

// reducers

export default combineReducers({
    dashboards,
    dashboardFilter,
    selectedDashboardId
});

// selectors level 1

export { getDashboardsFromState } from './dashboards';

export { getDashboardFilterFromState } from './dashboardFilter';

export { getSelectedDashboardIdFromState } from './selectedDashboard';

// selectors level 2

export const getSelectedDashboard = state => getDashboardById(state, getSelectedDashboardIdFromState(state));

export const getDashboards = state => {
    const filter = getDashboardFilterFromState(state).toLowerCase();
    const dashboardsFromState = getDashboardsFromState(state);

    return filter === '' ? dashboardsFromState : dashboardsFromState.filter(d => d.name.toLowerCase().indexOf(filter) !== -1);
};


