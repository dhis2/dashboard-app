import { orObject } from '../util';
import objectClean from 'd2-utilizr/lib/objectClean';

/** @module reducers/visualizations */

export const actionTypes = {
    RECEIVED_VISUALIZATION: 'RECEIVED_VISUALIZATION',
    RECEIVED_ACTIVE_VISUALIZATION: 'RECEIVED_ACTIVE_VISUALIZATION',
};

export default (state = {}, action) => {
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
                [action.value.id]: objectClean({
                    ...orObject(state[action.value.id]),
                    active: action.value.active,
                }),
            };
        }
        default:
            return state;
    }
};

// root selector
export const sGetFromState = state => state.visualizations;

// selectors level 1
export const sGetVisualization = (state, id) => {
    return sGetFromState(state)[id];
};

// selectors level 2
export const sGetVisInterpretations = (state, id) =>
    orObject(sGetVisualization(state, id)).interpretations;
