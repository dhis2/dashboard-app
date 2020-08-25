import { generateUid } from 'd2/uid'

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
    SET_PRINT_PREVIEW_VIEW,
    CLEAR_PRINT_PREVIEW_VIEW,
} from '../reducers/editDashboard'
import { sGetEditDashboardRoot } from '../reducers/editDashboard'
import { updateDashboard, postDashboard } from '../api/editDashboard'
import { tSetSelectedDashboardById } from '../actions/selected'
import {
    NEW_ITEM_SHAPE,
    getGridItemProperties,
    getPageBreakItemShape,
    getPrintTitlePageItemShape,
} from '../components/ItemGrid/gridUtil'
import { itemTypeMap, PAGEBREAK, PRINT_TITLE_PAGE } from '../modules/itemTypes'
import { convertUiItemsToBackend } from '../modules/uiBackendItemConverter'

const onError = error => {
    console.log('Error (Saving Dashboard): ', error)
    return error
}

// actions

export const acSetEditDashboard = (dashboard, items) => {
    const val = {
        ...dashboard,
        dashboardItems: items,
    }

    return {
        type: RECEIVED_EDIT_DASHBOARD,
        value: val,
    }
}

export const acSetEditNewDashboard = () => ({
    type: START_NEW_DASHBOARD,
})

export const acClearEditDashboard = () => ({
    type: RECEIVED_NOT_EDITING,
})

export const acSetPrintPreviewView = () => ({
    type: SET_PRINT_PREVIEW_VIEW,
})

export const acClearPrintPreviewView = () => ({
    type: CLEAR_PRINT_PREVIEW_VIEW,
})

export const acSetDashboardTitle = value => ({
    type: RECEIVED_TITLE,
    value,
})

export const acSetDashboardDescription = value => ({
    type: RECEIVED_DESCRIPTION,
    value,
})

export const acUpdateDashboardLayout = value => ({
    type: RECEIVED_DASHBOARD_LAYOUT,
    value,
})

export const acAddDashboardItem = item => {
    const type = item.type
    delete item.type
    const itemPropName = itemTypeMap[type].propName

    const id = generateUid()
    const gridItemProperties = getGridItemProperties(id)

    let shape
    if (type === PAGEBREAK) {
        const yPos = item.yPos || 0
        shape = getPageBreakItemShape(yPos, item.isStatic)
    } else if (type === PRINT_TITLE_PAGE) {
        shape = getPrintTitlePageItemShape()
    } else {
        shape = NEW_ITEM_SHAPE
    }

    return {
        type: ADD_DASHBOARD_ITEM,
        value: {
            id,
            type,
            position: item.position || null,
            [itemPropName]: item.content,
            ...NEW_ITEM_SHAPE,
            ...gridItemProperties,
            ...shape,
        },
    }
}

export const acUpdateDashboardItem = item => ({
    type: UPDATE_DASHBOARD_ITEM,
    value: item,
})

export const acRemoveDashboardItem = value => ({
    type: REMOVE_DASHBOARD_ITEM,
    value,
})

// thunks

export const tSaveDashboard = () => async (dispatch, getState) => {
    const dashboard = sGetEditDashboardRoot(getState())

    const dashboardToSave = {
        ...dashboard,
        dashboardItems: convertUiItemsToBackend(dashboard.dashboardItems),
    }

    try {
        const dashboardId = dashboardToSave.id
            ? await updateDashboard(dashboardToSave)
            : await postDashboard(dashboardToSave)

        dispatch(acClearEditDashboard())
        await dispatch(tSetSelectedDashboardById(dashboardId))

        return Promise.resolve(dashboardId)
    } catch (error) {
        onError(error)
    }
}
