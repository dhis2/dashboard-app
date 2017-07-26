import { combineReducers } from 'redux';

import dashboards, * as fromDashboards from './dashboards';
import dashboardsConfig, * as fromDashboardsConfig from './dashboardsConfig';

// action types

export const actionTypes = Object.assign({},
    fromDashboards.actionTypes,
    fromDashboardsConfig.actionTypes
);

// reducers

export default combineReducers({
    dashboards,
    dashboardsConfig
});

// root selectors

export { fromDashboards, fromDashboardsConfig };

// selectors level 2

export const sGetSelectedDashboard = state => fromDashboards.sGetDashboardById(state, fromDashboardsConfig.sGetSelectedIdFromState(state));

export const sGetDashboards = state => { //TODO more filters
console.log("-state:", state);
    const textFilter = fromDashboardsConfig.sGetTextFilterFromState(state).toLowerCase();
    const dashboardsFromState = fromDashboards.sGetFromState(state);

    return textFilter === '' ? dashboardsFromState : dashboardsFromState.filter(d => d.name.toLowerCase().indexOf(textFilter) !== -1);
};


