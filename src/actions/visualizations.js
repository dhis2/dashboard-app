import {
    ADD_VISUALIZATION,
    CLEAR_VISUALIZATIONS,
} from '../reducers/visualizations.js'

export const acAddVisualization = (value) => ({
    type: ADD_VISUALIZATION,
    value,
})

export const acClearVisualizations = () => ({
    type: CLEAR_VISUALIZATIONS,
})
