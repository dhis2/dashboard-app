import { SET_DIMENSIONS } from '../reducers/dimensions.js'

export const acSetDimensions = (dimensions) => ({
    type: SET_DIMENSIONS,
    value: dimensions,
})
