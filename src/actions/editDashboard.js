import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { fromEditDashboard } from '../reducers';
import { updateDashboard } from '../api/editDashboard';
import { fromSelected } from '.';
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

export const tSaveDashboard = () => async (dispatch, getState) => {
    const newDashboard = fromEditDashboard.sGetEditDashboard(getState());
    try {
        await updateDashboard(newDashboard);
        await dispatch(fromSelected.tSetSelectedDashboardById(newDashboard.id));
        return dispatch(fromSelected.acSetSelectedEdit(false));
    } catch (error) {
        onError(error);
    }
};

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

export const acRemoveDashboardItem = item => ({
    type: actionTypes.REMOVE_DASHBOARD_ITEM,
    value: item,
});
