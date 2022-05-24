import {
    SET_ACTIVE_MODAL_DIMENSION,
    CLEAR_ACTIVE_MODAL_DIMENSION,
} from '../reducers/activeModalDimension.js'

export const acSetActiveModalDimension = (value) => ({
    type: SET_ACTIVE_MODAL_DIMENSION,
    value,
})

export const acClearActiveModalDimension = () => ({
    type: CLEAR_ACTIVE_MODAL_DIMENSION,
})
