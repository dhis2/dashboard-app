import 'babel-polyfill';
import * as fromReducers from '../reducers';

import { apiFetchDashboards, apiFetchSelected } from '../api';

const { actionTypes } = fromReducers;

// object creators

// dashboards

export const acSetDashboards = (dashboards, append) => ({
    type: actionTypes.SET_DASHBOARDS,
    append: !!append,
    value: dashboards,
});

// selected

export const acSetSelected = value => ({
    type: actionTypes.SET_SELECTED,
    value,
});

// filter

export const acSetFilterName = value => ({
    type: actionTypes.SET_FILTER_NAME,
    value,
});

export const acSetFilterOwner = value => ({
    type: actionTypes.SET_FILTER_OWNER,
    value,
});

export const acSetFilterOrder = value => ({
    type: actionTypes.SET_FILTER_ORDER,
    value,
});

// thunk creators

// dashboards

export const tSetDashboards = () => async (dispatch, getState) => {
    const { getCustomDashboards } = fromReducers.fromDashboards;

    const onSuccess = data => {
        dispatch(acSetDashboards(getCustomDashboards(data.toArray())));
        return data;
    };

    const onError = error => {
        console.log('Error (apiFetchDashboards): ', error);
        return error;
    };

    try {
        const collection = await apiFetchDashboards();
        return onSuccess(collection);
    } catch (err) {
        return onError(err);
    }
};

// filter

export const tSetPresetHome = () => (dispatch, getState) => {
    dispatch(acSetFilterName());
    dispatch(acSetFilterOwner());
    dispatch(acSetFilterOrder());
};

export const tSetPresetManage = () => (dispatch, getState) => {
    dispatch(acSetFilterName());
    dispatch(acSetFilterOwner());
    dispatch(acSetFilterOrder());
};

// selectedDashboard

export const tSetSelectedDashboard = id => async dispatch => {
    dispatch(acSetSelected()); // sets id to null -> show loading indicator

    const onSuccess = data => {
        dispatch(acSetSelected(data));
        return data;
    };

    const onError = error => {
        console.log('Error: ', error);
        return error;
    };

    try {
        const fetchedData = await apiFetchSelected(id);
        return onSuccess(fetchedData);
    } catch (err) {
        return onError(err);
    }
};
