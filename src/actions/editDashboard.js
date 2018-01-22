import { actionTypes } from '../reducers';

export const acSetEditDashboard = value => ({
    type: actionTypes.RECEIVED_EDIT_DASHBOARD,
    value,
});
