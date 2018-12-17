/** @module reducers/interpretations */

import update from 'immutability-helper';

export const RECEIVED_INTERPRETATION = 'RECEIVED_INTERPRETATION';
export const ADD_INTERPRETATIONS = 'ADD_INTERPRETATIONS';
export const REMOVE_INTERPRETATION = 'REMOVE_INTERPRETATION';

// Reducer

export default (state = {}, action) => {
    switch (action.type) {
        case RECEIVED_INTERPRETATION: {
            return Object.assign({}, state, {
                [action.value.id]: action.value,
            });
        }
        case ADD_INTERPRETATIONS: {
            const newInterpretations = action.value.reduce((acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr,
                };
            }, {});

            return Object.assign({}, state, newInterpretations);
        }
        case REMOVE_INTERPRETATION: {
            return update(state, { $unset: [action.value] });
        }
        default:
            return state;
    }
};

// Selectors

export const sGetInterpretationsRoot = state => state.interpretations;

export const sGetInterpretation = (state, id) =>
    sGetInterpretationsRoot(state)[id] || null;

export const sGetInterpretations = (state, ids) =>
    ids.reduce((ipts, id) => {
        const ipt = sGetInterpretationsRoot(state)[id];

        if (ipt) {
            ipts[id] = Object.assign({}, ipt);
        }

        return ipts;
    }, {});
