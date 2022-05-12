import {
    getDimensionById,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'

export const SET_DIMENSIONS = 'SET_DIMENSIONS'
const PE_OU_DIMENSIONS = [
    getDimensionById(DIMENSION_ID_PERIOD),
    getDimensionById(DIMENSION_ID_ORGUNIT),
]

const INITIAL_DIMENSIONS = []

export default (state = INITIAL_DIMENSIONS, action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return [...PE_OU_DIMENSIONS, ...action.value]
        }
        default:
            return state
    }
}

export const sGetDimensions = (state) => state.dimensions
