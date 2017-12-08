import 'babel-polyfill';

import { getCustomDashboards } from '../reducers/dashboards';
import { apiFetchDashboards, apiFetchSelected } from '../api';
import { arrayToIdMap } from '../util';
import * as fromReducers from '../reducers';

const { actionTypes } = fromReducers;

// object creators

// dashboards

export const acSetDashboards = (dashboards, append) => ({
    type: actionTypes.SET_DASHBOARDS,
    append: !!append,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
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
    const onSuccess = data => {
        dispatch(acSetDashboards(data.toArray()));
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

export const tSetSelectedDashboardById = id => async dispatch => {
    //dispatch(acSetSelected()); // sets id to null -> show loading indicator

    const onSuccess = data => {
        dispatch(acSetDashboards(data, true));
        dispatch(acSetSelected(id));
        return data;
    };

    const onError = error => {
        console.log('Error: ', error);
        return error;
    };

    try {
        const fetchedSelected = await apiFetchSelected(id);
        return onSuccess(fetchedSelected);
    } catch (err) {
        return onError(err);
    }
};
