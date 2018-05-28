import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard, postDashboard } from '../api/editDashboard';
import { tAppendDashboard } from '../actions/selected';
import { NEW_ITEM_SHAPE } from '../ItemGrid/gridUtil';
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

export const acSetEditDashboard = (dashboard, items) => {
    const val = {
        ...dashboard,
        dashboardItems: items,
    };

    return {
        type: actionTypes.RECEIVED_EDIT_DASHBOARD,
        value: val,
    };
};

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

export const acAddDashboardItem = item => {
    const type = item.type;
    delete item.type;
    const itemPropName = itemTypeMap[type].propName;

    return {
        type: actionTypes.ADD_DASHBOARD_ITEM,
        value: {
            id: generateUid(),
            type,
            [itemPropName]: item.content,
            ...NEW_ITEM_SHAPE,
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

// thunks

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
        const dashboardId = dashboardToSave.id
            ? await updateDashboard(dashboardToSave)
            : await postDashboard(dashboardToSave);

        await dispatch(tAppendDashboard(dashboardId));

        return Promise.resolve(dashboardId);
    } catch (error) {
        onError(error);
    }
};
