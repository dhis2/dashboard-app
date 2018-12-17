/** @module reducers/selected */
import { combineReducers } from 'redux';

import { validateReducer } from '../modules/util';

export const SET_SELECTED_ID = 'SET_SELECTED_ID';
export const SET_SELECTED_ISLOADING = 'SET_SELECTED_ISLOADING';
export const SET_SELECTED_SHOWDESCRIPTION = 'SET_SELECTED_SHOWDESCRIPTION';

export const DEFAULT_STATE_SELECTED_ID = null;
export const DEFAULT_STATE_SELECTED_ISLOADING = false;
export const DEFAULT_STATE_SELECTED_SHOWDESCRIPTION = false;

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const id = (state = DEFAULT_STATE_SELECTED_ID, action) => {
    switch (action.type) {
        case SET_SELECTED_ID:
            return validateReducer(action.value, DEFAULT_STATE_SELECTED_ID);
        default:
            return state;
    }
};

const isLoading = (state = DEFAULT_STATE_SELECTED_ISLOADING, action) => {
    switch (action.type) {
        case SET_SELECTED_ISLOADING:
            return validateReducer(
                action.value,
                DEFAULT_STATE_SELECTED_ISLOADING
            );
        default:
            return state;
    }
};

const showDescription = (
    state = DEFAULT_STATE_SELECTED_SHOWDESCRIPTION,
    action
) => {
    switch (action.type) {
        case SET_SELECTED_SHOWDESCRIPTION:
            return validateReducer(
                action.value,
                DEFAULT_STATE_SELECTED_SHOWDESCRIPTION
            );
        default:
            return state;
    }
};

export default combineReducers({
    id,
    isLoading,
    showDescription,
});

// Selectors

export const sGetSelectedRoot = state => state.selected;

export const sGetSelectedId = state => sGetSelectedRoot(state).id;

export const sGetSelectedIsLoading = state => sGetSelectedRoot(state).isLoading;

export const sGetSelectedShowDescription = state =>
    sGetSelectedRoot(state).showDescription;
