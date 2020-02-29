import { SET_CURRENT_VISUALIZATION_VIEW } from '../reducers/currentVisualizationViews';

export const acSetCurrentVisualizationView = value => ({
    type: SET_CURRENT_VISUALIZATION_VIEW,
    value,
});
