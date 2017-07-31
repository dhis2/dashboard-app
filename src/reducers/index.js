import { combineReducers } from 'redux';

import dashboards, * as fromDashboards from './dashboards';
import dashboardsConfig, * as fromDashboardsConfig from './dashboardsConfig';

import arraySort from 'd2-utilizr/lib/arraySort';

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

// selectors level 1

export const sGetSelectedDashboard = state => fromDashboards.sGetDashboardById(state, fromDashboardsConfig.sGetSelectedIdFromState(state));

export const sApplyDashboardsTextFilter = (dashboards, textFilter) => {
    return dashboards.filter(d => d.name.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1);
};

export const applyDashboardsShowFilter = (dashboards, showFilter) => {
    switch (showFilter) {
        case fromDashboardsConfig.showFilterValues.STARRED:
            return dashboards.filter(d => !!d.starred);
        default:
            return dashboards;
    }
}

export const applySortFilter = (dashboards, sortFilter) => {
    const { key, direction } = sortFilter;

    return arraySort(dashboards, direction, key.toLowerCase());
}

// selectors level 2

export const sGetDashboards = state => {
    const dashboardsFromState = fromDashboards.sGetFromState(state);

    const textFilter = fromDashboardsConfig.sGetTextFilterFromState(state);
    const showFilter = fromDashboardsConfig.sGetShowFilterFromState(state);
    const sortFilter = fromDashboardsConfig.sGetSortFilterFromState(state);

    return applySortFilter(sApplyDashboardsTextFilter(applyDashboardsShowFilter(dashboardsFromState, showFilter), textFilter), sortFilter);
};


