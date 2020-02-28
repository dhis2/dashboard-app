import {
    ADD_CURRENT_VISUALIZATION_VIEW,
    SET_CURRENT_VISUALIZATION_VIEW,
} from '../reducers/currentVisualizationViews';

export const acAddCurrentVisualizationView = value => ({
    type: ADD_CURRENT_VISUALIZATION_VIEW,
    value,
});

export const acSetCurrentVisualizationView = value => ({
    type: SET_CURRENT_VISUALIZATION_VIEW,
    value,
});
