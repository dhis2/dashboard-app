import { combineReducers } from 'redux';

import dashboards, * as fromDashboards from './dashboards';
import dashboardsConfig, * as fromDashboardsConfig from './dashboardsConfig';

import arraySort from 'd2-utilizr/lib/arraySort';

const USER = 'system';

// action types

export const actionTypes = Object.assign({},
    fromDashboards.actionTypes,
    fromDashboardsConfig.actionTypes
);

// reducer validator
export const validateReducer = (value, defaultValue) => value === undefined || value === null ? defaultValue : value;

// map constants to data
const mapConstToData = {
    [fromDashboardsConfig.sortFilterKeyValues.NAME]: 'name',
    [fromDashboardsConfig.sortFilterKeyValues.ITEMS]: 'numberOfItems',
    [fromDashboardsConfig.sortFilterKeyValues.CREATED]: 'created'
};

// reducers

export default combineReducers({
    dashboards,
    dashboardsConfig
});

// root selectors

export { fromDashboards, fromDashboardsConfig };

// selectors level 1

export const sGetSelectedDashboard = state => fromDashboards.sGetDashboardById(state, fromDashboardsConfig.sGetSelectedIdFromState(state));

export const sApplyDashboardsTextFilter = (dashboards, filter) => {
    return dashboards.filter(d => d.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
};

export const applyDashboardsShowFilter = (dashboards, filter) => {
    switch (filter) {
        case fromDashboardsConfig.showFilterValues.STARRED:
            return dashboards.filter(d => !!d.starred);
        case fromDashboardsConfig.showFilterValues.UNSTARRED:
            return dashboards.filter(d => !d.starred);
        default:
            return dashboards;
    }
};

export const applyDashboardsOwnerFilter = (dashboards, filter) => {
    switch (filter) {
        case fromDashboardsConfig.ownerFilterValues.ME:
            console.log(dashboards, filter);return dashboards.filter(d => d.owner === USER);
        case fromDashboardsConfig.ownerFilterValues.OTHERS:
            return dashboards.filter(d => d.owner !== USER);
        default:
            return dashboards;
    }
};

export const applySortFilter = (dashboards, filter) => {
    const { key, direction } = filter;

    return arraySort(dashboards, direction, mapConstToData[key]);
};

// selectors level 2

export const sGetDashboards = state => {
    const dashboardsFromState = fromDashboards.sGetFromState(state);

    const textFilter = fromDashboardsConfig.sGetTextFilterFromState(state);
    const showFilter = fromDashboardsConfig.sGetShowFilterFromState(state);
    const ownerFilter = fromDashboardsConfig.sGetOwnerFilterFromState(state);
    const sortFilter = fromDashboardsConfig.sGetSortFilterFromState(state);

    return applySortFilter(
        sApplyDashboardsTextFilter(
        applyDashboardsShowFilter(
        applyDashboardsOwnerFilter(
            dashboardsFromState, ownerFilter),
            showFilter),
            textFilter),
            sortFilter);
};


