import { generateUid } from 'd2/uid'
import i18n from '@dhis2/d2-i18n'

import {
    RECEIVED_EDIT_DASHBOARD,
    START_NEW_DASHBOARD,
    RECEIVED_NOT_EDITING,
    RECEIVED_TITLE,
    RECEIVED_DESCRIPTION,
    RECEIVED_DASHBOARD_ITEM_SHAPES,
    ADD_DASHBOARD_ITEM,
    UPDATE_DASHBOARD_ITEM,
    REMOVE_DASHBOARD_ITEM,
    SET_PRINT_PREVIEW_VIEW,
    CLEAR_PRINT_PREVIEW_VIEW,
    RECEIVED_FILTER_SETTINGS,
    sGetEditDashboardRoot,
    RECEIVED_HIDE_GRID,
    RECEIVED_LAYOUT_COLUMNS,
    sGetEditDashboardItems,
    sGetLayoutColumns,
} from '../reducers/editDashboard'
import { tFetchDashboards } from './dashboards'
import { updateDashboard, postDashboard } from '../api/editDashboard'
// import {
//     NEW_ITEM_SHAPE,
//     getGridItemProperties,
//     getPageBreakItemShape,
//     getPrintTitlePageItemShape,
// } from '../modules/gridUtil'
// import { itemTypeMap, PAGEBREAK, PRINT_TITLE_PAGE } from '../modules/itemTypes'
import { convertUiItemsToBackend } from '../modules/uiBackendItemConverter'
import { getAutoItemShapes, getDashboardItem } from '../modules/gridUtil'

// actions

export const acSetEditDashboard = dashboard => ({
    type: RECEIVED_EDIT_DASHBOARD,
    value: dashboard,
})

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

export const acUpdateDashboardItemShapes = value => ({
    type: RECEIVED_DASHBOARD_ITEM_SHAPES,
    value,
})

export const acAddDashboardItem = item => ({
    type: ADD_DASHBOARD_ITEM,
    value: item,
})

export const acUpdateDashboardItem = item => ({
    type: UPDATE_DASHBOARD_ITEM,
    value: item,
})

export const acRemoveDashboardItem = value => ({
    type: REMOVE_DASHBOARD_ITEM,
    value,
})

export const acSetFilterSettings = value => ({
    type: RECEIVED_FILTER_SETTINGS,
    value,
})

export const acSetHideGrid = value => ({
    type: RECEIVED_HIDE_GRID,
    value,
})

export const acSetLayoutColumns = value => ({
    type: RECEIVED_LAYOUT_COLUMNS,
    value,
})

// thunks

export const tSetDashboardItems = newItem => (dispatch, getState) => {
    const prevItems = sGetEditDashboardItems(getState())

    if (newItem) {
        prevItems.unshift({
            ...getDashboardItem(newItem),
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        })
    }

    // TODO change from columns to layout
    const columns = sGetLayoutColumns(getState())
    const itemsWithNewShapes = getAutoItemShapes(prevItems, columns)

    console.log('itemsWithNewShapes', itemsWithNewShapes)

    dispatch(acSetHideGrid(true))
    dispatch(acUpdateDashboardItemShapes(itemsWithNewShapes))
    setTimeout(() => dispatch(acSetHideGrid(false)), 0)
}

export const tSaveDashboard = () => async (dispatch, getState, dataEngine) => {
    const dashboard = sGetEditDashboardRoot(getState())

    const dashboardToSave = {
        ...dashboard,
        dashboardItems: convertUiItemsToBackend(dashboard.dashboardItems),
        name: dashboard.name || i18n.t('Untitled dashboard'),
    }

    const dashboardId = dashboardToSave.id
        ? await updateDashboard(dataEngine, dashboardToSave)
        : await postDashboard(dataEngine, dashboardToSave)

    // update the dashboard list
    await dispatch(tFetchDashboards())

    return Promise.resolve(dashboardId)
}
