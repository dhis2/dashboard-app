import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard } from '../api/editDashboard';
import { fromSelected } from '.';

const onError = error => {
    console.log('Error (Saving Dashboard): ', error);
    return error;
};

export const acSetEditDashboard = value => ({
    type: actionTypes.RECEIVED_EDIT_DASHBOARD,
    value,
});

export const acSetDashboardTitle = value => ({
    type: actionTypes.RECEIVED_TITLE,
    value,
});

export const tSaveDashboard = () => async (dispatch, getState) => {
    const newDashboard = fromEditDashboard.sGetEditDashboard(getState());
    try {
        await updateDashboard(newDashboard);
        await dispatch(fromSelected.tSetSelectedDashboardById(newDashboard.id));
        return dispatch(fromSelected.acSetSelectedEdit(false));
    } catch (error) {
        onError(error);
    }
};
