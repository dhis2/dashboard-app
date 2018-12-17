import { combineReducers } from 'redux';
import { validateReducer } from '../modules/util';

export const SET_DASHBOARDS_FILTER_NAME = 'SET_DASHBOARDS_FILTER_NAME';
export const SET_DASHBOARDS_FILTER_OWNER = 'SET_DASHBOARDS_FILTER_OWNER';
export const SET_DASHBOARDS_FILTER_ORDER = 'SET_DASHBOARDS_FILTER_ORDER';

export const ownerData = [
    { id: 'ALL', value: 'All users' },
    { id: 'ME', value: 'Created by me' },
    { id: 'OTHERS', value: 'Created by others' },
];

export const orderData = [
    { id: 'NAME:ASC', value: 'Name (asc)' },
    { id: 'NAME:ASC', value: 'Name (desc)' },
    { id: 'ITEMS:ASC', value: 'Number of items (asc)' },
    { id: 'ITEMS:ASC', value: 'Number of items (desc)' },
    { id: 'CREATED:ASC', value: 'Created date (asc)' },
    { id: 'CREATED:ASC', value: 'Created date (desc)' },
];

export const DEFAULT_STATE_DASHBOARDS_FILTER_NAME = '';
export const DEFAULT_STATE_DASHBOARDS_FILTER_OWNER = ownerData[0].id;
export const DEFAULT_STATE_DASHBOARDS_FILTER_ORDER = orderData[0].id;

const name = (state = DEFAULT_STATE_DASHBOARDS_FILTER_NAME, action) => {
    switch (action.type) {
        case SET_DASHBOARDS_FILTER_NAME:
            return validateReducer(
                action.value,
                DEFAULT_STATE_DASHBOARDS_FILTER_NAME
            );
        default:
            return state;
    }
};

const owner = (state = DEFAULT_STATE_DASHBOARDS_FILTER_OWNER, action) => {
    switch (action.type) {
        case SET_DASHBOARDS_FILTER_OWNER:
            return validateReducer(
                action.value,
                DEFAULT_STATE_DASHBOARDS_FILTER_NAME
            );
        default:
            return state;
    }
};

const order = (state = DEFAULT_STATE_DASHBOARDS_FILTER_ORDER, action) => {
    switch (action.type) {
        case SET_DASHBOARDS_FILTER_ORDER:
            return validateReducer(
                action.value,
                DEFAULT_STATE_DASHBOARDS_FILTER_ORDER
            );
        default:
            return state;
    }
};

export default combineReducers({
    name,
    owner,
    order,
});

// selectors

export const sGetDashboardsFilterRoot = state => state.dashboardsFilter;

// selector dependency level 2

export const sGetFilterName = state => sGetDashboardsFilterRoot(state).name;
export const sGetFilterOwner = state => sGetDashboardsFilterRoot(state).owner;
export const sGetFilterOrder = state => sGetDashboardsFilterRoot(state).order;
