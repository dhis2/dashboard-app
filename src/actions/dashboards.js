import { actionTypes } from '../reducers';
import { getCustomDashboards } from '../reducers/dashboards';
import { apiFetchDashboards } from '../api';
import { arrayToIdMap, favoriteTypeUrlMap } from '../util';
import { generateUid } from 'd2/lib/uid';

// actions

export const acSetDashboards = (dashboards, append) => ({
    type: actionTypes.SET_DASHBOARDS,
    append: !!append,
    value: arrayToIdMap(getCustomDashboards(dashboards)),
});

export const acAddDashboardItem = (dashboardId, yValue, favorite) => {
    const favoritePropName = favoriteTypeUrlMap[favorite.type].propName;

    return {
        type: actionTypes.ADD_DASHBOARD_ITEM,
        value: {
            id: generateUid(),
            type: favorite.type,
            [favoritePropName]: favorite,
            x: 0,
            y: yValue,
            h: 20,
            w: 29,
        },
        dashboardId,
    };
};

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
