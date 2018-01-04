/** @module reducers/interpretations */

export const actionTypes = {
    ADD_INTERPRETATION: 'ADD_INTERPRETATION',
    ADD_INTERPRETATIONS: 'ADD_INTERPRETATIONS',
};

/**
 * Reducer that computes new state for state.interpretations
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 * @returns {Object}
 */

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.ADD_INTERPRETATION: {
            return Object.assign({}, state, {
                [action.value.id]: action.value,
            });
        }
        case actionTypes.ADD_INTERPRETATIONS: {
            const newInterpretations = action.value.reduce((acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr,
                };
            }, {});

            return Object.assign({}, state, newInterpretations);
        }
        default:
            return state;
    }
};

// selectors
export const sGetInterpretations = (state, ids) => {
    const interpretations = {};

    ids.forEach(id => {
        if (state.interpretations[id]) {
            interpretations[id] = Object.assign({}, state.interpretations[id]);
        }
    });

    return interpretations;
};
