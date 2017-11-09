/** @module reducers/selectedDashboard */

import { validateReducer } from '../util';
import { hasShape, getShape } from '../DashboardItemGrid/gridUtil';

/**
 * Action types for the selectedDashboard reducer
 * @constant
 * @type {Object}
 */
export const actionTypes = {
    SET_SELECTEDDASHBOARD: 'SET_SELECTEDDASHBOARD',
};

/**
 * The default selected dashboard
 * @constant
 */
export const DEFAULT_SELECTEDDASHBOARD = null;

/**
 * Reducer that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
export default (state = DEFAULT_SELECTEDDASHBOARD, action) => {
    switch (action.type) {
    case actionTypes.SET_SELECTEDDASHBOARD:
        return validateReducer(action.value, DEFAULT_SELECTEDDASHBOARD);
    default:
        return state;
    }
};

/**
 * Returns the selected dashboard from the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetSelectedDashboardFromState = state => state.selectedDashboard;

/**
 * Returns the array of items on the selected dashboard
 * @function
 * @param {Object} state
 * @returns {Array}
 */
export const sGetSelectedDashboardItems = state => (sGetSelectedDashboardFromState(state) || {}).dashboardItems || [];

/**
 * Returns an array of items that each contain its grid block shape object
 * @function
 * @param {Array} items
 * @returns {Array}
 */
export const uGetTransformedItems = items => items.map((item, index) => (hasShape(item) ? item : Object.assign({}, item, getShape(index))));
