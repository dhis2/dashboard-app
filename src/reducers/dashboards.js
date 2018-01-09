/** @module reducers/dashboards */

import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import update from 'immutability-helper';
import { orArray, orNull, orObject } from '../util';

/**
 * Action types for the dashboard reducer
 * @constant
 * @type {Object}
 */
export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
    ADD_DASHBOARD_ITEM: 'ADD_DASHBOARD_ITEM',
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
                ...(action.append ? state || {} : {}),
                ...action.value,
            };
        }
        case actionTypes.ADD_DASHBOARD_ITEM: {
            const newState = update(state, {
                [action.dashboardId]: {
                    dashboardItems: { $push: [action.value] },
                },
            });

            return newState;
        }
        default:
            return state;
    }
};

// selectors

/**
 * Selector which returns dashboards from the state object
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

/**
 * Returns the array of dashboards, customized for ui
 * @function
 * @param {Array} data The original dashboard list
 * @returns {Array}
 */
export const getCustomDashboards = data =>
    arrayFrom(data).map((d, index) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        starred: Math.random() > 0.7,
        owner: d.user.name,
        created: d.created
            .split('T')
            .join(' ')
            .substr(0, 16),
        lastUpdated: d.lastUpdated
            .split('T')
            .join(' ')
            .substr(0, 16),
        numberOfItems: orArray(d.dashboardItems).length,
        dashboardItems: d.dashboardItems,
    }));
