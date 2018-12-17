/** @module reducers/dashboards */

import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arraySort from 'd2-utilizr/lib/arraySort';

import { orArray, orObject } from '../modules/util';
import {
    SPACER,
    isSpacerType,
    isTextType,
    emptyTextItemContent,
} from '../modules/itemTypes';

export const SET_DASHBOARDS = 'SET_DASHBOARDS';
export const ADD_DASHBOARDS = 'ADD_DASHBOARDS';
export const SET_DASHBOARD_STARRED = 'SET_DASHBOARD_STARRED';
export const SET_DASHBOARD_DISPLAY_NAME = 'SET_DASHBOARD_DISPLAY_NAME';
export const SET_DASHBOARD_ITEMS = 'SET_DASHBOARD_ITEMS';

export const DEFAULT_STATE_DASHBOARDS = {
    byId: null,
    items: [],
};

// reducer helper functions

const updateDashboardProp = (state, dashboardId, prop, value) => ({
    byId: {
        ...state.byId,
        [dashboardId]: {
            ...state.byId[dashboardId],
            [prop]: value,
        },
    },
    items: state.items,
});

/**
 * Reducer that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 * @returns {Object}
 */
export default (state = DEFAULT_STATE_DASHBOARDS, action) => {
    switch (action.type) {
        case SET_DASHBOARDS: {
            return {
                byId: action.value,
                items: [],
            };
        }
        case ADD_DASHBOARDS: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...action.value,
                },
            };
        }
        case SET_DASHBOARD_STARRED: {
            return updateDashboardProp(
                state,
                action.dashboardId,
                'starred',
                action.value
            );
        }
        case SET_DASHBOARD_DISPLAY_NAME: {
            return updateDashboardProp(
                state,
                action.dashboardId,
                'displayName',
                action.value
            );
        }
        case SET_DASHBOARD_ITEMS: {
            return {
                ...state,
                items: action.value,
            };
        }
        default:
            return state;
    }
};

// root selector

export const sGetDashboardsRoot = state => state.dashboards;

// selector level 1

/**
 * Selector which returns a dashboard by id from the state object
 * If no matching dashboard is found it returns undefined
 * If dashboards.byId is null, then the dashboards api request
 * has not yet completed. If dashboards.byId is an empty object
 * then the dashboards api request is complete, but no dashboards
 * were returned
 *
 * @function
 * @param {Object} state The current state
 * @param {Number} id The id of the dashboard
 * @returns {Object | undefined}
 */
export const sGetDashboardById = (state, id) =>
    orObject(sGetDashboardsRoot(state).byId)[id];

export const sDashboardsIsFetching = state => {
    return sGetDashboardsRoot(state).byId === null;
};

/**
 * Selector which returns all dashboards (the byId object)
 *
 * @function
 * @param {Object} state The current state
 * @returns {Object | undefined}
 */
export const sGetAllDashboards = state =>
    orObject(sGetDashboardsRoot(state).byId);

/**
 * Selector which returns the current dashboard items
 *
 * @function
 * @param {Object} state The current state
 * @returns {Array}
 */
export const sGetDashboardItems = state => sGetDashboardsRoot(state).items;

// selector level 2

export const sGetStarredDashboards = state =>
    Object.values(sGetAllDashboards(state)).filter(
        dashboard => dashboard.starred === true
    );

export const sGetUnstarredDashboards = state =>
    Object.values(sGetAllDashboards(state)).filter(
        dashboard => dashboard.starred === false
    );

// selector level 3

export const sGetStarredDashboardIds = state => {
    return sGetStarredDashboards(state).map(dashboard => dashboard.id);
};

export const sGetUnstarredDashboardIds = state =>
    sGetUnstarredDashboards(state).map(dashboard => dashboard.id);

export const sGetDashboardsSortedByStarred = state => [
    ...arraySort(sGetStarredDashboards(state), 'ASC', 'displayName'),
    ...arraySort(sGetUnstarredDashboards(state), 'ASC', 'displayName'),
];

// utils

/**
 * Returns the array of dashboards, customized for ui
 * @function
 * @param {Array} data The original dashboard list
 * @returns {Array}
 */
export const getCustomDashboards = data => {
    const uiItems = items =>
        items.map(item => {
            const type = isSpacerType(item) ? SPACER : item.type;
            const text = isTextType(item)
                ? item.text === emptyTextItemContent
                    ? ''
                    : item.text
                : null;

            return {
                ...item,
                ...(text !== null ? { text } : {}),
                type,
            };
        });

    return arrayFrom(data).map((d, index) => ({
        id: d.id,
        name: d.name,
        displayName: d.displayName,
        description: d.description,
        displayDescription: d.displayDescription,
        starred: d.favorite,
        owner: d.user.name,
        created: d.created
            .split('T')
            .join(' ')
            .substr(0, 16),
        lastUpdated: d.lastUpdated
            .split('T')
            .join(' ')
            .substr(0, 16),
        access: d.access,
        numberOfItems: orArray(d.dashboardItems).length,
        dashboardItems: uiItems(d.dashboardItems),
    }));
};
