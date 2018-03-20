import { actionTypes } from '../reducers';
import { apiGetControlBarRows } from '../api/controlBar';

// actions

export const acSetControlBarRows = rows => ({
    type: actionTypes.SET_CONTROLBAR_ROWS,
    value: rows,
});

export const acSetControlBarUserRows = rows => ({
    type: actionTypes.SET_CONTROLBAR_USER_ROWS,
    value: rows,
});

// thunks

export const tSetControlBarRows = () => async (dispatch, getState) => {
    const onSuccess = rows => {
        dispatch(acSetControlBarUserRows(rows));
    };

    const onError = error => {
        console.log('Error (apiGetControlBarRows): ', error);
        return error;
    };

    try {
        const controlBarRows = await apiGetControlBarRows();
        return onSuccess(controlBarRows);
    } catch (err) {
        return onError(err);
    }
};
