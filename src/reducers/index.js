import { combineReducers } from 'redux';

import arraySort from 'd2-utilizr/lib/arraySort';

import dashboards, * as fromDashboards from './dashboards';
import dashboardsConfig, * as fromDashboardsConfig from './dashboardsConfig';

const USER = 'system';

// action types

export const actionTypes = Object.assign({},
    fromDashboards.actionTypes,
    fromDashboardsConfig.actionTypes,
);

// reducer validator
export const validateReducer = (value, defaultValue) => (value === undefined || value === null ? defaultValue : value);

// map constants to data
const mapConstToData = {
    NAME: 'name',
    ITEMS: 'numberOfItems',
    CREATED: 'created',
    OWNER: 'owner',
};

// reducers

export default combineReducers({
    dashboards,
    dashboardsConfig,
});

// root selectors

export { fromDashboards, fromDashboardsConfig };

// selectors level 1

export const sGetSelectedDashboard = state => fromDashboards.sGetDashboardById(state, fromDashboardsConfig.sGetSelectedIdFromState(state));

export const sApplyDashboardsTextFilter = (dashboards, filter) => dashboards.filter(d => d.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

export const applyDashboardsShowFilter = (dashboards, filter) => {
    const STARRED = 'STARRED'; // TODO
    const UNSTARRED = 'UNSTARRED'; // TODO

    switch (filter) {
    case STARRED:
        return dashboards.filter(d => !!d.starred);
    case UNSTARRED:
        return dashboards.filter(d => !d.starred);
    default:
        return dashboards;
    }
};

export const applyDashboardsOwnerFilter = (dashboards, filter) => {
    const ME = 'ME'; // TODO
    const OTHERS = 'OTHERS'; // TODO

    switch (filter) {
    case ME:
        return dashboards.filter(d => d.owner === USER);
    case OTHERS:
        return dashboards.filter(d => d.owner !== USER);
    default:
        return dashboards;
    }
};

export const applySortFilter = (dashboards, filter) => {
    const { keyFilter, directionFilter } = filter;

    return arraySort(dashboards, directionFilter, mapConstToData[keyFilter]);
};

// selectors level 2

export const sGetDashboards = (state) => {
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

