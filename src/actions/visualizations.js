import {
    ADD_VISUALIZATION,
    SET_ACTIVE_VISUALIZATION_VIEW,
} from '../reducers/visualizations';

export const acAddVisualization = value => ({
    type: ADD_VISUALIZATION,
    value,
});

export const acSetActiveVisualizationView = (id, view) => {
    const action = {
        type: SET_ACTIVE_VISUALIZATION_VIEW,
        id,
        activeType: view,
    };

    return action;
};
