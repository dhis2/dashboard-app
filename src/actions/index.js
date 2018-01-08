import 'babel-polyfill';

import { getCustomDashboards } from '../reducers/dashboards';
import { apiFetchDashboards, apiFetchSelected } from '../api';
import { arrayToIdMap, favoriteTypeUrlMap } from '../util';
import * as fromReducers from '../reducers';
import { getShapedItems } from '../ItemGrid/gridUtil';

const { actionTypes } = fromReducers;

// object creators

// controlbar

export const tSetControlBarRows = rows => ({
    type: actionTypes.SET_CONTROLBAR_ROWS,
    value: rows,
});

export const tSetControlBarExpanded = expanded => ({
    type: actionTypes.SET_CONTROLBAR_EXPANDED,
    value: !!expanded,
});

// dashboards

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

// selected

export const acSetSelectedId = value => ({
    type: actionTypes.SET_SELECTED_ID,
    value,
});

export const acSetSelectedEdit = value => ({
    type: actionTypes.SET_SELECTED_EDIT,
    value,
});

export const acSetSelectedIsLoading = value => ({
    type: actionTypes.SET_SELECTED_ISLOADING,
    value,
});

export const acSetSelectedShowDescription = value => ({
    type: actionTypes.SET_SELECTED_SHOWDESCRIPTION,
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

export const receivedVisualization = value => ({
    type: actionTypes.RECEIVED_VISUALIZATION,
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

// selectedDashboard

export const tSetSelectedDashboardById = id => async dispatch => {
    dispatch(acSetSelectedIsLoading(true));

    const onSuccess = selected => {
        console.log('selected dashboard', selected);

        selected.dashboardItems.forEach(item => {
            let vis;
            switch (item.type) {
                case 'CHART':
                    vis = item.chart;
                    break;
                case 'REPORT_TABLE':
                    vis = item.reportTable;
                    break;
                default:
                    vis = [];
            }

            dispatch(receivedVisualization(vis));
        });

        dispatch(
            acSetDashboards(
                {
                    ...selected,
                    dashboardItems: getShapedItems(selected.dashboardItems),
                },
                true
            )
        );
        dispatch(acSetSelectedId(id));
        dispatch(acSetSelectedIsLoading(false));
        return selected;
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
