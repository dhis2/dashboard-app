import { generateUid } from 'd2/uid';

import {
    RECEIVED_EDIT_DASHBOARD,
    START_NEW_DASHBOARD,
    RECEIVED_NOT_EDITING,
    RECEIVED_TITLE,
    RECEIVED_DESCRIPTION,
    RECEIVED_DASHBOARD_LAYOUT,
    ADD_DASHBOARD_ITEM,
    UPDATE_DASHBOARD_ITEM,
    REMOVE_DASHBOARD_ITEM,
} from '../reducers/editDashboard';
import { sGetEditDashboardRoot } from '../reducers/editDashboard';
import { updateDashboard, postDashboard } from '../api/editDashboard';
import { tSetSelectedDashboardById } from '../actions/selected';
import { NEW_ITEM_SHAPE } from '../components/ItemGrid/gridUtil';
import {
    itemTypeMap,
    isSpacerType,
    TEXT,
    emptyTextItemContent,
    isTextType,
} from '../modules/itemTypes';

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
        type: RECEIVED_EDIT_DASHBOARD,
        value: val,
    };
};

export const acSetEditNewDashboard = () => ({
    type: START_NEW_DASHBOARD,
});

export const acClearEditDashboard = () => ({
    type: RECEIVED_NOT_EDITING,
});

export const acSetDashboardTitle = value => ({
    type: RECEIVED_TITLE,
    value,
});

export const acSetDashboardDescription = value => ({
    type: RECEIVED_DESCRIPTION,
    value,
});

export const acUpdateDashboardLayout = value => ({
    type: RECEIVED_DASHBOARD_LAYOUT,
    value,
});

export const acAddDashboardItem = item => {
    const type = item.type;
    delete item.type;
    const itemPropName = itemTypeMap[type].propName;

    return {
        type: ADD_DASHBOARD_ITEM,
        value: {
            id: generateUid(),
            type,
            [itemPropName]: item.content,
            ...NEW_ITEM_SHAPE,
        },
    };
};

export const acUpdateDashboardItem = item => ({
    type: UPDATE_DASHBOARD_ITEM,
    value: item,
});

export const acRemoveDashboardItem = value => ({
    type: REMOVE_DASHBOARD_ITEM,
    value,
});

// thunks

export const tSaveDashboard = () => async (dispatch, getState) => {
    const dashboard = sGetEditDashboardRoot(getState());

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

        dispatch(acClearEditDashboard());
        await dispatch(tSetSelectedDashboardById(dashboardId));

        return Promise.resolve(dashboardId);
    } catch (error) {
        onError(error);
    }
};
