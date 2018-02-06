import { actionTypes } from '../reducers';

export const acReceivedUser = value => ({
    type: actionTypes.RECEIVED_USER,
    value,
});
