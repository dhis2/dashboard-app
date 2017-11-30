/** @module reducers/selected */
import { combineReducers } from 'redux';
import { validateReducer } from '../util';
import { hasShape, getShape } from '../DashboardItemGrid/gridUtil';

export const actionTypes = {
    SET_SELECTED: 'SET_SELECTED_ID',
    SET_EDIT: 'SET_SELECTED_EDIT',
};

export const DEFAULT_SELECTED = null;
export const DEFAULT_EDIT = false;

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const id = (state = DEFAULT_SELECTED, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED:
            return validateReducer(action.value, DEFAULT_SELECTED);
        default:
            return state;
    }
};

const edit = (state = DEFAULT_EDIT, action) => {
    switch (action.type) {
        case actionTypes.SET_EDIT:
            return validateReducer(action.value, DEFAULT_EDIT);
        default:
            return state;
    }
};

export default combineReducers({
    id,
    edit,
});

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetFromState = state => state.selected;

// Selector dependency level 2

export const sGetId = state =>
    sGetFromState(state) ? sGetFromState(state).id : null;

export const sGetEdit = state =>
    sGetFromState(state) ? sGetFromState(state).edit : null;

/**
 * Returns an array of items that each contain its grid block shape object
 * @function
 * @param {Array} items
 * @returns {Array}
 */
export const uGetTransformedItems = items =>
    items.map(
        (item, index) =>
            hasShape(item) ? item : Object.assign({}, item, getShape(index))
    );
