import { SET_DIMENSIONS } from '../reducers/dimensions'

export const acSetDimensions = dimensions => ({
    type: SET_DIMENSIONS,
    value: dimensions,
})
