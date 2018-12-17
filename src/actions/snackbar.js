import {
    RECEIVED_SNACKBAR_MESSAGE,
    CLOSE_SNACKBAR,
} from '../reducers/snackbar';

export const acReceivedSnackbarMessage = value => ({
    type: RECEIVED_SNACKBAR_MESSAGE,
    value,
});

export const acCloseSnackbar = () => ({
    type: CLOSE_SNACKBAR,
});
