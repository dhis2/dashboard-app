/** @module reducers/dashboards */

import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import { orArray, orNull, orObject } from '../util';
import {
    SPACER,
    isSpacerType,
    isTextType,
    emptyTextItemContent,
} from '../itemTypes';

/**
 * Action types for the dashboard reducer
 * @constant
 * @type {Object}
 */
export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
    STAR_DASHBOARD: 'STAR_DASHBOARD',
};

/**
 * The default list of dashboards
 * @constant
 * @type {Array}
 */
export const DEFAULT_DASHBOARDS = null;

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
                ...(action.append ? orObject(state) : {}),
                ...action.value,
            };
        }
        case actionTypes.STAR_DASHBOARD: {
            return {
                ...state,
                [action.dashboardId]: {
                    ...state[action.dashboardId],
                    starred: action.value,
                },
            };
        }
        default:
            return state;
    }
};

// selectors

/**
 * Selector which returns dashboards from the state object
 * If state.dashboards is null, then the dashboards api request
 * has not yet completed. If state.dashboards is an empty object
 * then the dashboards api request is complete, and there are no
 * dashboards
 *
 * @function
 * @param {Object} state The current state
 * @returns {Array}
 */
export const sGetFromState = state => state.dashboards;

/**
 * Returns a dashboard based on id, from the state object.
 * If no matching dashboard is found, then undefined is returned
 * @function
 * @param {Object} state The current state
 * @param {number} id The id of the dashboard to retrieve
 * @returns {Object|undefined}
 */
export const sGetById = (state, id) =>
    orNull(orObject(sGetFromState(state))[id]);

export const sGetStarredDashboardIds = state => {
    const dashboards = Object.values(orObject(sGetFromState(state)));
    return dashboards
        .filter(dashboard => dashboard.starred === true)
        .map(starred => starred.id);
};

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
        description: d.description,
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
