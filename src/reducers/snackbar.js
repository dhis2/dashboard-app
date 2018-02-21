export const actionTypes = {
    RECEIVED_MESSAGE: 'RECEIVED_MESSAGE',
    SNACKBAR_CLOSED: 'SNACKBAR_CLOSED',
};

export const DEFAULT_STATE = {
    message: {},
    duration: null,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_MESSAGE: {
            return { ...state, ...action.value };
        }
        case actionTypes.SNACKBAR_CLOSED: {
            return DEFAULT_STATE;
        }
        default:
            return state;
    }
};

// selectors

export const sGetSnackbar = state => state.snackbar || DEFAULT_STATE;
