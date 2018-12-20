import { orObject } from '../modules/util';
import objectClean from 'd2-utilizr/lib/objectClean';

/** @module reducers/visualizations */

export const RECEIVED_VISUALIZATION = 'RECEIVED_VISUALIZATION';
export const RECEIVED_ACTIVE_VISUALIZATION = 'RECEIVED_ACTIVE_VISUALIZATION';

export const DEFAULT_STATE_VISUALIZATIONS = {};

const isEmpty = p => p === undefined || p === null;

export default (state = DEFAULT_STATE_VISUALIZATIONS, action) => {
    switch (action.type) {
        case RECEIVED_VISUALIZATION: {
            return {
                ...state,
                [action.value.id]: action.value,
            };
        }
        case RECEIVED_ACTIVE_VISUALIZATION: {
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
