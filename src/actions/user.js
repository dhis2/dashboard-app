import { RECEIVED_USER } from '../reducers/user';

export const acReceivedUser = value => ({
    type: RECEIVED_USER,
    value,
});
