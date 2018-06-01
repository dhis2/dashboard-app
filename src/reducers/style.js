/** @module reducers/selected */
import { validateReducer } from '../util'

export const actionTypes = {
    SET_STYLE: 'SET_STYLE'
}

export const DEFAULT_STYLE = 'LIST'

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const style = (state = DEFAULT_STYLE, action) => {
    switch (action.type) {
        case actionTypes.SET_STYLE:
            return validateReducer(action.value, DEFAULT_STYLE)
        default:
            return state
    }
}

export default style

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetFromState = state => state.style
