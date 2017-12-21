/** @module reducers/selected */
import { combineReducers } from 'redux';

import { validateReducer } from '../util';

export const actionTypes = {
    SET_SELECTED_ID: 'SET_SELECTED_ID',
    SET_SELECTED_EDIT: '',
    SET_SELECTED_ISLOADING: 'SET_SELECTED_ISLOADING',
    SET_SELECTED_SHOWDESCRIPTION: 'SET_SELECTED_SHOWDESCRIPTION',
};

export const DEFAULT_SELECTED_ID = null;
export const DEFAULT_SELECTED_EDIT = false;
export const DEFAULT_SELECTED_ISLOADING = false;
export const DEFAULT_SELECTED_SHOWDESCRIPTION = false;

/**
 * Reducer functions that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 */
const id = (state = DEFAULT_SELECTED_ID, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_ID:
            return validateReducer(action.value, DEFAULT_SELECTED_ID);
        default:
            return state;
    }
};

const edit = (state = DEFAULT_SELECTED_EDIT, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_EDIT:
            return validateReducer(action.value, DEFAULT_SELECTED_EDIT);
        default:
            return state;
    }
};

const isLoading = (state = DEFAULT_SELECTED_ISLOADING, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_ISLOADING:
            return validateReducer(action.value, DEFAULT_SELECTED_ISLOADING);
        default:
            return state;
    }
};

const showDescription = (state = DEFAULT_SELECTED_SHOWDESCRIPTION, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_SHOWDESCRIPTION:
            return validateReducer(
                action.value,
                DEFAULT_SELECTED_SHOWDESCRIPTION
            );
        default:
            return state;
    }
};

export default combineReducers({
    id,
    edit,
    isLoading,
    showDescription,
});

/**
 * Selectors that point to specific props in the state object
 * @function
 * @param {Object} state
 * @returns {Object}
 */
export const sGetFromState = state => state.selected;

// Selector dependency level 2

export const sGetSelectedId = state => sGetFromState(state).id;

export const sGetSelectedEdit = state => sGetFromState(state).edit;

export const sGetSelectedIsLoading = state => sGetFromState(state).isLoading;

export const sGetSelectedShowDescription = state =>
    sGetFromState(state).showDescription;
