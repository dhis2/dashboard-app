import i18n from '@dhis2/d2-i18n'
import { updateDashboard, postDashboard } from '../api/editDashboard.js'
import {
    addToItemsEnd,
    addToItemsStart,
    getAutoItemShapes,
    getDashboardItem,
    rescaleItemsToColumns,
    updateItems,
} from '../modules/gridUtil.js'
import { itemTypeMap } from '../modules/itemTypes.js'
import { setPendingScrollItem } from '../modules/scrollToNewItem.js'
import { convertUiItemsToBackend } from '../modules/uiBackendItemConverter.js'
import { generateUid } from '../modules/uid.js'
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
    RECEIVED_GRID_COLUMNS,
    RECEIVED_ITEM_CONFIG_INSERT_POSITION,
    RECEIVED_ITEM_CONFIG_NEW_ITEM_WIDTH,
    sGetEditDashboardItems,
    sGetLayoutColumns,
    sGetItemConfigInsertPosition,
    sGetItemConfigNewItemWidth,
    RECEIVED_CODE,
} from '../reducers/editDashboard.js'
import { tFetchDashboards } from './dashboards.js'

// actions

export const acSetEditDashboard = (dashboard) => ({
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

export const acSetDashboardTitle = (value) => ({
    type: RECEIVED_TITLE,
    value,
})

export const acSetDashboardCode = (value) => ({
    type: RECEIVED_CODE,
    value,
})

export const acSetDashboardDescription = (value) => ({
    type: RECEIVED_DESCRIPTION,
    value,
})

export const acUpdateDashboardItemShapes = (value) => ({
    type: RECEIVED_DASHBOARD_ITEM_SHAPES,
    value,
})

export const acAddDashboardItem = (item) => ({
    type: ADD_DASHBOARD_ITEM,
    value: item,
})

export const acUpdateDashboardItem = (item) => ({
    type: UPDATE_DASHBOARD_ITEM,
    value: item,
})

export const acRemoveDashboardItem = (value) => ({
    type: REMOVE_DASHBOARD_ITEM,
    value,
})

export const acSetFilterSettings = (value) => ({
    type: RECEIVED_FILTER_SETTINGS,
    value,
})

export const acSetHideGrid = (value) => ({
    type: RECEIVED_HIDE_GRID,
    value,
})

export const acSetLayoutColumns = (value) => ({
    type: RECEIVED_LAYOUT_COLUMNS,
    value,
})

export const acSetEditGridColumns = (value) => ({
    type: RECEIVED_GRID_COLUMNS,
    value,
})

export const acSetItemConfigInsertPosition = (value) => ({
    type: RECEIVED_ITEM_CONFIG_INSERT_POSITION,
    value,
})

export const acSetItemConfigNewItemWidth = (value) => ({
    type: RECEIVED_ITEM_CONFIG_NEW_ITEM_WIDTH,
    value,
})

// thunks

// no layout + end: add to new row at the end, default size
// no layout + start: add to 0,0, default size
// layout + end: calculate and add to "next shape in layout"
// layout + start: add to 0,0,0,0, sort, remount

export const tSetDashboardItems =
    (itemToAdd, itemIdToRemove) => (dispatch, getState) => {
        const insertPosition = sGetItemConfigInsertPosition(getState())
        const newItemWidth = sGetItemConfigNewItemWidth(getState())
        const columns = sGetLayoutColumns(getState())

        let items = [...sGetEditDashboardItems(getState())]
        let dashboardItemsWithShapes

        if (!itemToAdd && !itemIdToRemove) {
            // changing columns

            if (!columns.length) {
                // freeflow
                updateItems(items, dispatch)
            } else {
                dashboardItemsWithShapes = getAutoItemShapes(items, columns)
                updateItems(dashboardItemsWithShapes, dispatch, {
                    reload: true,
                })
            }
        } else {
            if (itemIdToRemove) {
                items = items.filter((item) => item.id !== itemIdToRemove)
            }

            if (!itemToAdd) {
                dashboardItemsWithShapes = getAutoItemShapes(items, columns)
                updateItems(dashboardItemsWithShapes, dispatch)
            } else {
                // Apply the per-dashboard default width (honored in freeflow;
                // ignored in fixed layout, where getAutoItemShapes sizes items
                // to the column count).
                const newDashboardItem = {
                    ...getDashboardItem(itemToAdd),
                    w: newItemWidth,
                }

                // Click-to-add places the item at the top/bottom of the canvas,
                // possibly off-screen. Flag it so the grid scrolls it into view.
                setPendingScrollItem(newDashboardItem.id)

                switch (insertPosition) {
                    case 'START':
                        dashboardItemsWithShapes = addToItemsStart(
                            items,
                            columns,
                            newDashboardItem
                        )
                        break
                    case 'END':
                    default:
                        dashboardItemsWithShapes = addToItemsEnd(
                            items,
                            columns,
                            newDashboardItem
                        )
                }

                updateItems(dashboardItemsWithShapes, dispatch)
            }
        }
    }

// Duplicate an existing item into the "next" position.
// Fixed layout: drop the copy right after the original and let the auto-layout
// flow it into the following cell. Freeflow: place it at the next available
// position without disturbing the manually-placed existing items.
export const tDuplicateDashboardItem =
    (itemId) => (dispatch, getState) => {
        const columns = sGetLayoutColumns(getState())
        const items = [...sGetEditDashboardItems(getState())]
        const index = items.findIndex((item) => item.id === itemId)

        if (index === -1) {
            return
        }

        const newId = generateUid()
        const duplicate = { ...items[index], id: newId, i: newId }

        setPendingScrollItem(newId)

        if (columns.length) {
            const reordered = [
                ...items.slice(0, index + 1),
                duplicate,
                ...items.slice(index + 1),
            ]
            updateItems(getAutoItemShapes(reordered, columns), dispatch)
        } else {
            updateItems(addToItemsEnd(items, columns, duplicate), dispatch)
        }
    }

// Swap an item's underlying content in place, keeping its position and size.
// `type` is the new item type and `content` is the { id, name } of the chosen
// visualization. The previous content prop is dropped so a cross-type swap (e.g.
// visualization → map) doesn't leave a stale reference, since UPDATE_DASHBOARD_ITEM
// replaces the whole item object.
export const tChangeDashboardItemContent =
    (itemId, type, content) => (dispatch, getState) => {
        const items = sGetEditDashboardItems(getState())
        const existing = items.find((item) => item.id === itemId)

        if (!existing) {
            return
        }

        const oldPropName = itemTypeMap[existing.type]?.propName
        const newPropName = itemTypeMap[type]?.propName

        const newItem = { ...existing }
        if (oldPropName && oldPropName !== newPropName) {
            delete newItem[oldPropName]
        }
        newItem.type = type
        newItem[newPropName] = content

        dispatch(acUpdateDashboardItem(newItem))
    }

// Editor-only: change the grid column resolution and snap existing items to it.
// Storage stays in the canonical 60-unit space.
export const tSetEditGridColumns = (columns) => (dispatch, getState) => {
    dispatch(acSetEditGridColumns(columns))

    const items = sGetEditDashboardItems(getState())

    if (items.length) {
        updateItems(rescaleItemsToColumns(items, columns), dispatch, {
            reload: true,
        })
    }
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
