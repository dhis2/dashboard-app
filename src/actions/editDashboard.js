import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard, postDashboard } from '../api/editDashboard';
import { fromSelected } from '.';
import { fromDashboards } from '.';
import {
    itemTypeMap,
    isSpacerType,
    TEXT,
    emptyTextItemContent,
    isTextType,
} from '../itemTypes';

const onError = error => {
    console.log('Error (Saving Dashboard): ', error);
    return error;
};

// actions

export const acSetEditDashboard = value => ({
    type: actionTypes.RECEIVED_EDIT_DASHBOARD,
    value,
});

export const acSetEditNewDashboard = () => ({
    type: actionTypes.START_NEW_DASHBOARD,
});

export const acClearEditDashboard = () => ({
    type: actionTypes.RECEIVED_NOT_EDITING,
});

export const acSetDashboardTitle = value => ({
    type: actionTypes.RECEIVED_TITLE,
    value,
});

export const acSetDashboardDescription = value => ({
    type: actionTypes.RECEIVED_DESCRIPTION,
    value,
});

export const acUpdateDashboardLayout = value => ({
    type: actionTypes.RECEIVED_DASHBOARD_LAYOUT,
    value,
});

export const acAddDashboardItem = (item, yValue) => {
    const type = item.type;
    delete item.type;
    const itemPropName = itemTypeMap[type].propName;

    return {
        type: actionTypes.ADD_DASHBOARD_ITEM,
        value: {
            id: generateUid(),
            type,
            [itemPropName]: item.content,
            // TODO pass these as arguments
            x: 0,
            y: yValue,
            h: 20,
            w: 29,
        },
    };
};

export const acUpdateDashboardItem = item => ({
    type: actionTypes.UPDATE_DASHBOARD_ITEM,
    value: item,
});

export const acRemoveDashboardItem = value => ({
    type: actionTypes.REMOVE_DASHBOARD_ITEM,
    value,
});

//thunks

export const tSetDashboardDisplayTitle = value => async (
    dispatch,
    getState
) => {
    const dashboard = fromEditDashboard.sGetEditDashboard(getState());

    dispatch({
        type: actionTypes.RECEIVED_DISPLAY_TITLE,
        value,
    });

    dispatch(fromDashboards.acSetDashboardDisplayName(dashboard.id, value));
};

export const tSaveDashboard = () => async (dispatch, getState) => {
    const dashboard = fromEditDashboard.sGetEditDashboard(getState());

    const dashboardItems = dashboard.dashboardItems.map(item => {
        const text = isTextType(item)
            ? item.text || emptyTextItemContent
            : null;

        const type = isSpacerType(item) ? TEXT : item.type;

        return {
            ...item,
            ...(text ? { text } : {}),
            type,
        };
    });

    const dashboardToSave = {
        ...dashboard,
        dashboardItems,
    };

    try {
        const selectedId = dashboardToSave.id
            ? await updateDashboard(dashboardToSave)
            : await postDashboard(dashboardToSave);

        await dispatch(fromSelected.tSetSelectedDashboardById(selectedId));

        return dispatch(acClearEditDashboard());
    } catch (error) {
        onError(error);
    }
};
