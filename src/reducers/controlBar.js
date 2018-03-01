/** @module reducers/controlBar */
import { combineReducers } from 'redux';
import { validateReducer } from '../util';

export const actionTypes = {
    SET_CONTROLBAR_ROWS: 'SET_CONTROLBAR_ROWS',
};

export const DEFAULT_ROWS = 1;

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

export default combineReducers({
    rows,
});

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetFromState = state => state.controlBar;

// Selector dependency level 2

export const sGetControlBarRows = state => sGetFromState(state).rows;
