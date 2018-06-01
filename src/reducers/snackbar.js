export const actionTypes = {
    RECEIVED_SNACKBAR_MESSAGE: 'RECEIVED_SNACKBAR_MESSAGE',
    CLOSE_SNACKBAR: 'CLOSE_SNACKBAR'
}

export const DEFAULT_STATE = {
    message: {},
    duration: null,
    open: false
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_SNACKBAR_MESSAGE: {
            return { ...state, ...action.value }
        }
        case actionTypes.CLOSE_SNACKBAR: {
            return DEFAULT_STATE
        }
        default:
            return state
    }
}

// selectors

export const sGetSnackbar = state => state.snackbar || DEFAULT_STATE
