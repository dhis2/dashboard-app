/** @module reducers/visualizations */

export const actionTypes = {
    RECEIVED_VISUALIZATION: 'RECEIVED_VISUALIZATION',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_VISUALIZATION: {
            const res = Object.assign({}, state, {
                [action.value.id]: action.value,
            });

            return res;
        }
        default:
            return state;
    }
};

// selectors
export const sGetVisualization = (state, id) => {
    return state.visualizations[id];
};

export const sGetVisInterpretations = (state, visId) => {
    const vis = state.visualizations[visId];
    return vis.interpretations;
};
