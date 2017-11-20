/** @module reducers/controlBar */
import { combineReducers } from 'redux';
import { validateReducer } from '../util';

export const actionTypes = {
    SET_CONTROLBAR_ROWS: 'SET_CONTROLBAR_ROWS',
    SET_CONTROLBAR_EXPANDED: 'SET_CONTROLBAR_EXPANDED',
};

export const DEFAULT_ROWS = 1;
export const DEFAULT_EXPANDED = false;

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const rows = (state = DEFAULT_ROWS, action) => {
    switch (action.type) {
        case actionTypes.SET_CONTROLBAR_ROWS:
            return validateReducer(action.value, DEFAULT_ROWS);
        default:
            return state;
    }
};

const expanded = (state = DEFAULT_EXPANDED, action) => {
    switch (action.type) {
        case actionTypes.SET_CONTROLBAR_EXPANDED:
            return validateReducer(action.value, DEFAULT_EXPANDED);
        default:
            return state;
    }
};

export default combineReducers({
    rows,
    expanded,
});

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetFromState = state => state.controlBar;

// Selector dependency level 2

export const sGetRows = state => sGetFromState(state).rows;
export const sGetExpanded = state => sGetFromState(state).expanded;
