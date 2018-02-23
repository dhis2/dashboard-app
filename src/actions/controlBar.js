import { actionTypes } from '../reducers';
import { apiGetControlBarRows } from '../api/controlBar';

// actions

export const acSetControlBarRows = rows => ({
    type: actionTypes.SET_CONTROLBAR_ROWS,
    value: rows,
});

export const acSetControlBarExpanded = expanded => ({
    type: actionTypes.SET_CONTROLBAR_EXPANDED,
    value: !!expanded,
});

// thunks

export const tSetControlBarRows = () => async (dispatch, getState) => {
    const onError = error => {
        console.log('Error (apiGetControlBarRows): ', error);
        return error;
    };

    try {
        const controlBarRows = await apiGetControlBarRows();
        console.log('controlBarRows', controlBarRows);
        dispatch(acSetControlBarRows(controlBarRows));

        return;
    } catch (err) {
        return onError(err);
    }
};
