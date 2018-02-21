import { actionTypes } from '../reducers';

export const acReceivedSnackbarMessage = value => ({
    type: actionTypes.RECEIVED_MESSAGE,
    value,
});

export const acCloseSnackbar = () => ({
    type: actionTypes.SNACKBAR_CLOSED,
});
