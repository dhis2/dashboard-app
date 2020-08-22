import {
    getDimensionById,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'

export const SET_DIMENSIONS = 'SET_DIMENSIONS'
export const DEFAULT_DIMENSIONS = [
    getDimensionById(DIMENSION_ID_PERIOD),
    getDimensionById(DIMENSION_ID_ORGUNIT),
]

export default (state = DEFAULT_DIMENSIONS, action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return [...DEFAULT_DIMENSIONS, ...action.value]
        }
        default:
            return state
    }
}

export const sGetDimensions = state => state.dimensions
