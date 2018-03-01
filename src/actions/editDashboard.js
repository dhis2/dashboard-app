import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard, postDashboard } from '../api/editDashboard';
import { fromSelected } from '.';
import { NEW_ITEM_SHAPE } from '../ItemGrid/gridUtil';
import {
    itemTypeMap,
    isSpacerType,
    APP,
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

export const acAddDashboardItem = item => {
    const type = item.type;
    delete item.type;
    const itemPropName = itemTypeMap[type].propName;

    const content = type === APP ? item.content.appKey : item.content;

    // console.log('add itemContent', itemPropName, ': ', item.content);

    return {
        type: actionTypes.ADD_DASHBOARD_ITEM,
        value: {
            id: generateUid(),
            type,
            [itemPropName]: content,
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

    console.log('save items', dashboardItems);

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
