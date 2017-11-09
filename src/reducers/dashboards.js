/** @module reducers/dashboards */

import { validateReducer } from '../util';

/**
 * Action types for the dashboard reducer
 * @constant
 * @type {Object}
 */
export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
};

/**
 * The default list of dashboards
 * @constant
 * @type {Array}
 */
export const DEFAULT_DASHBOARDS = [];

/**
 * Reducer that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 * @returns {Object}
 */
export default (state = DEFAULT_DASHBOARDS, action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDS:
        return validateReducer(action.dashboards, DEFAULT_DASHBOARDS);
    default:
        return state;
    }
};

/**
 * Returns the list of dashboards from the state object
 * @function
 * @param {Object} state The current state
 * @returns {Array}
 */
export const sGetFromState = (state) => {
    return state.dashboards;
};

/**
 * Returns a dashboard based on id, from the state object.
 * If no matching dashboard is found, then undefined is returned
 * @function
 * @param {Object} state The current state
 * @param {number} id The id of the dashboard to retrieve
 * @returns {Object|undefined}
 */
export const sGetDashboardById = (state, id) => sGetFromState(state).find(dashboard => dashboard.id === id);

/**
 * Returns the array of dashboards, customized for ui
 * @function
 * @param {Array} data The original dashboard list
 * @returns {Array}
 */
export const getDashboards = data => data.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    starred: Math.random() > 0.7,
    owner: d.user.name,
    created: d.created.split('T').join(' ').substr(0, 16),
    lastUpdated: d.lastUpdated.split('T').join(' ').substr(0, 16),
    numberOfItems: d.dashboardItems,
}));

/**
 * Returns the persisted state
 * @function
 * @todo Implement the function
 * @param {Object} state The current state
 */
export const getPersistedState = state => ({
    dashboards: state.dashboards,
});
