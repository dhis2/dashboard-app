import { orObject } from '../modules/util';
import objectClean from 'd2-utilizr/lib/objectClean';

/** @module reducers/currentVisualizationViews */

export const ADD_CURRENT_VISUALIZATION_VIEW = 'ADD_CURRENT_VISUALIZATION_VIEW';
export const SET_CURRENT_VISUALIZATION_VIEW = 'SET_CURRENT_VISUALIZATION_VIEW';

export const DEFAULT_STATE = {};

const isEmpty = p => p === undefined || p === null;

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case ADD_CURRENT_VISUALIZATION_VIEW: {
            return {
                ...state,
                [action.value.id]: objectClean(
                    {
                        ...orObject(state[action.value.id]),
                        ...action.value,
                    },
                    isEmpty
                ),
            };
        }
        case SET_CURRENT_VISUALIZATION_VIEW: {
            return {
                ...state,
                [action.value.id]: objectClean(
                    {
                        ...orObject(action.value.visualization),
                    },
                    isEmpty
                ),
            };
        }

        default:
            return state;
    }
};

// root selector
export const sGetCurrentVisualizationViewsRoot = state =>
    state.currentVisualizationViews;

// selectors level 1
export const sGetCurrentVisualizationView = (state, id) => {
    return sGetCurrentVisualizationViewsRoot(state)[id];
};
