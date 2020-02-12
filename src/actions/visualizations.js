import {
    ADD_VISUALIZATION,
    SET_ACTIVE_VISUALIZATION_TYPE,
} from '../reducers/visualizations';

export const acAddVisualization = value => ({
    type: ADD_VISUALIZATION,
    value,
});

export const acSetActiveVisualizationType = (id, activeType) => {
    const action = {
        type: SET_ACTIVE_VISUALIZATION_TYPE,
        id,
        activeType,
    };

    return action;
};
