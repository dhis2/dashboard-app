import { actionTypes } from '../reducers';
import { getCustomDashboards } from '../reducers/dashboards';
import { apiFetchDashboards, apiStarDashboard } from '../api/dashboards';
import { arrayToIdMap } from '../util';

// actions

export const acSetDashboards = (dashboards, append) => ({
    type: actionTypes.SET_DASHBOARDS,
    append: !!append,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
});

export const acStarDashboard = (dashboardId, isStarred) => ({
    type: actionTypes.STAR_DASHBOARD,
    dashboardId: dashboardId,
    value: isStarred,
});

// thunks

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

export const tStarDashboard = (id, isStarred) => async (dispatch, getState) => {
    const onSuccess = id => {
        // dispatch(tSetDashboards());
        // dispatch(tSetSelectedDashboardById(id));
        dispatch(acStarDashboard(id, isStarred));

        return;
    };

    const onError = error => {
        console.log('Error (apiStarDashboard): ', error);
        return error;
    };
    try {
        await apiStarDashboard(id, isStarred);
        return onSuccess(id);
    } catch (err) {
        return onError(err);
    }
};
