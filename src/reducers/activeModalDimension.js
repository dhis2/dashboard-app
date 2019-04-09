export const SET_ACTIVE_MODAL_DIMENSION = 'SET_ACTIVE_MODAL_DIMENSION';
export const CLEAR_ACTIVE_MODAL_DIMENSION = 'CLEAR_ACTIVE_MODAL_DIMENSION';

export const DEFAULT_STATE_ACTIVE_MODAL_DIMENSION = {};

export default (state = DEFAULT_STATE_ACTIVE_MODAL_DIMENSION, action) => {
    switch (action.type) {
        case SET_ACTIVE_MODAL_DIMENSION: {
            return action.value;
        }
        case CLEAR_ACTIVE_MODAL_DIMENSION: {
            return DEFAULT_STATE_ACTIVE_MODAL_DIMENSION;
        }
        default:
            return state;
    }
};

export const sGetActiveModalDimension = state => state.activeModalDimension;
