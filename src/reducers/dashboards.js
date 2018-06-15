/** @module reducers/dashboards */

import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arraySort from 'd2-utilizr/lib/arraySort';
import { orArray, orObject } from '../util';
import {
    SPACER,
    isSpacerType,
    isTextType,
    emptyTextItemContent,
} from '../itemTypes';

export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
    APPEND_DASHBOARDS: 'APPEND_DASHBOARDS',
    SET_DASHBOARD_STARRED: 'SET_DASHBOARD_STARRED',
    SET_DASHBOARD_DISPLAY_NAME: 'SET_DASHBOARD_DISPLAY_NAME',
    SET_DASHBOARD_ITEMS: 'SET_DASHBOARD_ITEMS',
};

export const DEFAULT_DASHBOARDS = {
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
export default (state = DEFAULT_DASHBOARDS, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS: {
            return {
                byId: action.value,
                items: [],
            };
        }
        case actionTypes.APPEND_DASHBOARDS: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...action.value,
                },
            };
        }
        case actionTypes.SET_DASHBOARD_STARRED: {
            return updateDashboardProp(
                state,
                action.dashboardId,
                'starred',
                action.value
            );
        }
        case actionTypes.SET_DASHBOARD_DISPLAY_NAME: {
            return updateDashboardProp(
                state,
                action.dashboardId,
                'displayName',
                action.value
            );
        }
        case actionTypes.SET_DASHBOARD_ITEMS: {
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

export const sGetFromState = state => state.dashboards;

// selector level 1

/**
 * Selector which returns dashboards by id from the state object
 * If no id is provided it returns all dashboards
 * If no matching dashboard is found it returns undefined
 * If dashboards.byId is null, then the dashboards api request
 * has not yet completed. If dashboards.byId is an empty object
 * then the dashboards api request is complete, and no dashboards
 * were returned
 *
 * @function
 * @param {Object} state The current state
 * @param {Number} id The id of the dashboard
 * @returns {Object | undefined}
 */
export const sGetById = (state, id) =>
    id ? sGetFromState(state).byId[id] : sGetFromState(state).byId;

export const sDashboardsIsFetching = state => {
    return sGetFromState(state).byId === null;
};

/**
 * Selector which returns the current dashboard items
 *
 * @function
 * @param {Object} state The current state
 * @returns {Array}
 */
export const sGetItems = state => sGetFromState(state).items;

// selector level 2

/**
 * Generic selector which returns filtered dashboards
 *
 * @function
 * @param {Object} state The current state
 * @param {Object} propName The name of the filter prop
 * @param {Object} value The value of the filter prop
 * @returns {Array}
 */
const sGetDashboardsByProp = (state, propName, value) =>
    Object.values(orObject(sGetById(state))).filter(
        dashboard => dashboard[propName] === value
    );

// selector level 3

export const sGetStarredDashboards = state =>
    sGetDashboardsByProp(state, 'starred', true);

export const sGetUnstarredDashboards = state =>
    sGetDashboardsByProp(state, 'starred', false);

// selector level 4

export const sGetStarredDashboardIds = state => {
    return sGetStarredDashboards(state).map(dashboard => dashboard.id);
};

export const sGetUnstarredDashboardIds = state =>
    sGetUnstarredDashboards(state).map(dashboard => dashboard.id);

// selector level 5

export const sGetSortedDashboards = state =>
    [].concat(
        arraySort(sGetStarredDashboards(state), 'ASC', 'displayName'),
        arraySort(sGetUnstarredDashboards(state), 'ASC', 'displayName')
    );

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
                ? item.text === emptyTextItemContent ? '' : item.text
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
