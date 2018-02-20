import { actionTypes } from '../reducers';

export const acReceivedSnackbarMessage = value => ({
    type: actionTypes.RECEIVED_MESSAGE,
    value,
});

export const acSnackbarClosed = () => ({
    type: actionTypes.SNACKBAR_CLOSED,
});
