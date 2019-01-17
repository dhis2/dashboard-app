/** @module reducers/controlBar */
import { combineReducers } from 'redux';
import { validateReducer } from '../modules/util';

export const SET_CONTROLBAR_USER_ROWS = 'SET_CONTROLBAR_USER_ROWS';

export const DEFAULT_STATE_CONTROLBAR_ROWS = 1;

const userRows = (state = DEFAULT_STATE_CONTROLBAR_ROWS, action) => {
    switch (action.type) {
        case SET_CONTROLBAR_USER_ROWS:
            return validateReducer(action.value, DEFAULT_STATE_CONTROLBAR_ROWS);
        default:
            return state;
    }
};

export default combineReducers({
    userRows,
});

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetControlBarRoot = state => state.controlBar;

// Selector dependency level 2

export const sGetControlBarUserRows = state =>
    sGetControlBarRoot(state).userRows;
