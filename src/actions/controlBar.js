import { SET_CONTROLBAR_USER_ROWS } from '../reducers/controlBar';
import { apiGetControlBarRows } from '../api/controlBar';

// actions

export const acSetControlBarUserRows = rows => ({
    type: SET_CONTROLBAR_USER_ROWS,
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
