/** @module reducers/selected */
import { validateReducer } from '../modules/util';

export const SET_STYLE = 'SET_STYLE';

export const DEFAULT_STATE_STYLE = 'LIST';

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const style = (state = DEFAULT_STATE_STYLE, action) => {
    switch (action.type) {
        case SET_STYLE:
            return validateReducer(action.value, DEFAULT_STATE_STYLE);
        default:
            return state;
    }
};

export default style;

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetStyleRoot = state => state.style;
