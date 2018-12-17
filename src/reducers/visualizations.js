import { orObject } from '../util';
import objectClean from 'd2-utilizr/lib/objectClean';

/** @module reducers/visualizations */

const isEmpty = p => p === undefined || p === null;

export const actionTypes = {
    RECEIVED_VISUALIZATION: 'RECEIVED_VISUALIZATION',
    RECEIVED_ACTIVE_VISUALIZATION: 'RECEIVED_ACTIVE_VISUALIZATION',
};

export const DEFAULT_STATE = {};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_VISUALIZATION: {
            return {
                ...state,
                [action.value.id]: action.value,
            };
        }
        case actionTypes.RECEIVED_ACTIVE_VISUALIZATION: {
            return {
                ...state,
                [action.id]: objectClean(
                    {
                        ...orObject(state[action.id]),
                        activeType: action.activeType,
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
export const sGetVisualizationsRoot = state => state.visualizations;

// selectors level 1
export const sGetVisualization = (state, id) => {
    return sGetVisualizationsRoot(state)[id];
};

// selectors level 2
export const sGetVisInterpretations = (state, id) =>
    orObject(sGetVisualization(state, id)).interpretations;
