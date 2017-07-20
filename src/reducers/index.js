import { combineReducers } from 'redux';

import dashboards, { actionTypes as atDashboards, getDashboardById } from './dashboards';
import selectedDashboardId, { actionTypes as atSelectedDashboard, getSelectedDashboardIdFromState } from './selectedDashboard';

// action types

export const actionTypes = Object.assign(
    {},
    atDashboards,
    atSelectedDashboard
);

// reducers

export default combineReducers({
    dashboards,
    selectedDashboardId
});

// selectors level 1

export { getDashboardsFromState } from './dashboards';

export { getSelectedDashboardIdFromState } from './selectedDashboard';

// selectors level 2

export const getSelectedDashboard = state => getDashboardById(state, getSelectedDashboardIdFromState(state));


