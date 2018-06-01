import { actionTypes } from '../reducers'

export const acReceivedSnackbarMessage = value => ({
    type: actionTypes.RECEIVED_SNACKBAR_MESSAGE,
    value
})

export const acCloseSnackbar = () => ({
    type: actionTypes.CLOSE_SNACKBAR
})
