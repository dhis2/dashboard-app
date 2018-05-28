import { actionTypes } from '../reducers';
import {
    getCustomDashboards,
    sGetById,
    sGetSortedDashboards,
} from '../reducers/dashboards';
import { sGetUsername } from '../reducers/user';
import { tSetSelectedDashboardById, acSetSelectedId } from './selected';
import { acClearEditDashboard } from './editDashboard';
import {
    apiFetchDashboards,
    apiStarDashboard,
    apiDeleteDashboard,
} from '../api/dashboards';
import { getPreferredDashboardId } from '../api/localStorage';
import { arrayToIdMap } from '../util';

// actions

export const acSetDashboards = dashboards => ({
    type: actionTypes.SET_DASHBOARDS,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
});

export const acAppendDashboards = dashboards => ({
    type: actionTypes.APPEND_DASHBOARDS,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
});

export const acSetDashboardStarred = (dashboardId, isStarred) => ({
    type: actionTypes.SET_DASHBOARD_STARRED,
    dashboardId: dashboardId,
    value: isStarred,
});

export const acSetDashboardDisplayName = (dashboardId, value) => ({
    type: actionTypes.SET_DASHBOARD_DISPLAY_NAME,
    dashboardId,
    value,
});

export const acSetDashboardItems = value => ({
    type: actionTypes.SET_DASHBOARD_ITEMS,
    value,
});

// thunks

export const tFetchDashboards = () => async dispatch => {
    const collection = await apiFetchDashboards();
    dispatch(acSetDashboards(collection.toArray()));
};

export const tSelectDashboard = id => async (dispatch, getState) => {
    const onError = error => {
        console.log('Error (apiFetchDashboards): ', error);
        return error;
    };

    try {
        const state = getState();

        let dashboardToSelect = null;
        if (id) {
            dashboardToSelect = sGetById(state, id) || null;
        } else {
            const preferredId = getPreferredDashboardId(sGetUsername(state));
            const dash = sGetById(state, preferredId);
            dashboardToSelect =
                preferredId && dash ? dash : sGetSortedDashboards(state)[0];
        }

        if (dashboardToSelect) {
            dispatch(tSetSelectedDashboardById(dashboardToSelect.id));
        } else {
            dispatch(acSetSelectedId(false));
        }
    } catch (err) {
        return onError(err);
    }
};

export const tStarDashboard = (id, isStarred) => async (dispatch, getState) => {
    const onSuccess = id => {
        dispatch(acSetDashboardStarred(id, isStarred));
        return id;
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

export const tDeleteDashboard = id => async (dispatch, getState) => {
    const onSuccess = async () => {
        await dispatch(tSelectDashboard());

        return dispatch(acClearEditDashboard());
    };

    try {
        await apiDeleteDashboard(id);

        return onSuccess();
    } catch (err) {
        console.log('Error (deleteDashboard): ', err);
        return err;
    }
};
