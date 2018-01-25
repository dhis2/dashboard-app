import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard, postDashboard } from '../api/editDashboard';
import { fromSelected } from '.';
import { tSetDashboards } from './dashboards';
import { itemTypeMap } from '../util';

const onError = error => {
    console.log('Error (Saving Dashboard): ', error);
    return error;
};

// actions

export const acSetEditDashboard = value => ({
    type: actionTypes.RECEIVED_EDIT_DASHBOARD,
    value,
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

export const tSaveDashboard = () => async (dispatch, getState) => {
    const newDashboard = fromEditDashboard.sGetEditDashboard(getState());

    try {
        const selectedId = newDashboard.id
            ? await updateDashboard(newDashboard)
            : await postDashboard(newDashboard);

        await dispatch(fromSelected.tSetSelectedDashboardById(selectedId));
        dispatch(fromSelected.acSetSelectedEdit(false));

        return dispatch(acSetEditDashboard({}));
    } catch (error) {
        onError(error);
    }
};
