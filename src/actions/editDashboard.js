// import { generateUid } from 'd2/uid'
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
    RECEIVED_ADD_ITEMS_TO,
    sGetEditDashboardItems,
    sGetLayoutColumns,
    // sGetLayout,
    sGetAddItemsTo,
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
import {
    addToItemsEnd,
    addToItemsStart,
    getAutoItemShapes,
    getDashboardItem,
    updateItems,
} from '../modules/gridUtil'

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

export const acSetAddItemsTo = value => ({
    type: RECEIVED_ADD_ITEMS_TO,
    value,
})

// thunks

// no layout + end: add to new row at the end, default size
// no layout + start: add to 0,0, default size
// layout + end: calculate and add to "next shape in layout"
// layout + start: add to 0,0,0,0, sort, remount

export const tSetDashboardItems = newItem => (dispatch, getState) => {
    const addItemsTo = sGetAddItemsTo(getState())
    const columns = sGetLayoutColumns(getState())
    const items = [...sGetEditDashboardItems(getState())]
    console.group('tSetDashboardItems')
    console.log('--addItemsTo', addItemsTo)
    console.log('--columns', columns)
    console.log('--items', items)
    console.log('--newItem', newItem)
    console.groupEnd()

    let dashboardItemsWithShapes

    if (!newItem) {
        dashboardItemsWithShapes = getAutoItemShapes(items, columns)
        updateItems(dashboardItemsWithShapes, dispatch, {
            reload: true,
        })
    } else {
        const newDashboardItem = getDashboardItem(newItem)

        if (addItemsTo === 'START') {
            dashboardItemsWithShapes = addToItemsStart(
                items,
                columns,
                newDashboardItem
            )
            updateItems(dashboardItemsWithShapes, dispatch, { reload: true })
        } else if (addItemsTo === 'END') {
            dashboardItemsWithShapes = addToItemsEnd(
                items,
                columns,
                newDashboardItem
            )
            updateItems(dashboardItemsWithShapes, dispatch)
        }
    }

    // if (!newItem || addItemsTo === 'START') {
    //     if (newItem) {
    //         items.push({
    //             ...getDashboardItem(newItem),
    //             x: 0,
    //             y: 0,
    //             w: 0,
    //             h: 0,
    //         })
    //     }

    //     console.log(
    //         '-Before itemsWithNewShapes/getAutoItemShapes: items: ',
    //         items,
    //         columns
    //     )
    //     const itemsWithNewShapes = getAutoItemShapes(items, columns)
    //     debugger
    //     if (!itemsWithNewShapes) {
    //         // TODO remove log
    //         console.log('-Stopped because itemsWithNewShapes is empty')
    //         return
    //     }

    //     updateItems(itemsWithNewShapes, dispatch, { reload: true })
    // } else if (!addItemsTo || addItemsTo === 'END') {
    //     // TODO remove !addItemsTo
    //     const item = getDashboardItem(newItem)
    //     const addToEndResult = addToItemsEnd(items, columns, item)

    //     console.group('tSetDashboardItems END')
    //     console.log('item', item)
    //     console.log('addToEndResult', addToEndResult)
    //     console.groupEnd()

    //     updateItems(addToEndResult)
    // }
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
