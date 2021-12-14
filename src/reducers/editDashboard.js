/** @module reducers/editDashboard */
// import { generateUid } from 'd2/uid'
import update from 'immutability-helper'
import isEmpty from 'lodash/isEmpty'
import { getDashboardItem } from '../modules/gridUtil'
// import {
//     getGridItemProperties,
//     getPageBreakItemShape,
//     getPrintTitlePageItemShape,
//     NEW_ITEM_SHAPE,
// } from '../modules/gridUtil'
// import { itemTypeMap, PAGEBREAK, PRINT_TITLE_PAGE } from '../modules/itemTypes'
import { orArray, orObject } from '../modules/util'

export const RECEIVED_EDIT_DASHBOARD = 'RECEIVED_EDIT_DASHBOARD'
export const RECEIVED_NOT_EDITING = 'RECEIVED_NOT_EDITING'
export const START_NEW_DASHBOARD = 'START_NEW_DASHBOARD'
export const RECEIVED_TITLE = 'RECEIVED_TITLE'
export const RECEIVED_CODE = 'RECEIVED_CODE'
export const RECEIVED_DESCRIPTION = 'RECEIVED_DESCRIPTION'
export const ADD_DASHBOARD_ITEM = 'ADD_DASHBOARD_ITEM'
export const REMOVE_DASHBOARD_ITEM = 'REMOVE_DASHBOARD_ITEM'
export const UPDATE_DASHBOARD_ITEM = 'UPDATE_DASHBOARD_ITEM'
export const RECEIVED_DASHBOARD_ITEM_SHAPES = 'RECEIVED_DASHBOARD_ITEM_SHAPES'
export const SET_PRINT_PREVIEW_VIEW = 'SET_PRINT_PREVIEW_VIEW'
export const CLEAR_PRINT_PREVIEW_VIEW = 'CLEAR_PRINT_PREVIEW_VIEW'
export const RECEIVED_FILTER_SETTINGS = 'RECEIVED_FILTER_SETTINGS'
export const RECEIVED_HIDE_GRID = 'RECEIVED_HIDE_GRID'
export const RECEIVED_LAYOUT_COLUMNS = 'RECEIVED_LAYOUT_COLUMNS'
export const RECEIVED_ITEM_CONFIG_INSERT_POSITION =
    'RECEIVED_ITEM_CONFIG_INSERT_POSITION'

export const EMPTY_STATE_EDIT_DASHBOARD = {}
export const DEFAULT_STATE_EDIT_DASHBOARD = {
    id: '',
    name: '',
    code: '',
    access: { update: true, delete: true },
    allowedFilters: [],
    description: '',
    dashboardItems: [],
    restrictFilters: false,
    printPreviewView: false,
    isDirty: false,
    href: '',
    hideGrid: false,
    layout: {
        columns: [],
    },
    itemConfig: {
        insertPosition: 'END',
    },
}

export default (state = DEFAULT_STATE_EDIT_DASHBOARD, action) => {
    switch (action.type) {
        case RECEIVED_EDIT_DASHBOARD: {
            const newState = {}
            Object.keys(DEFAULT_STATE_EDIT_DASHBOARD).forEach(
                k => (newState[k] = action.value[k])
            )
            newState.printPreviewView =
                DEFAULT_STATE_EDIT_DASHBOARD.printPreviewView
            newState.isDirty = DEFAULT_STATE_EDIT_DASHBOARD.isDirty
            return newState
        }
        case RECEIVED_NOT_EDITING:
            return EMPTY_STATE_EDIT_DASHBOARD
        case SET_PRINT_PREVIEW_VIEW:
            return Object.assign({}, state, { printPreviewView: true })
        case CLEAR_PRINT_PREVIEW_VIEW:
            return Object.assign({}, state, { printPreviewView: false })
        case START_NEW_DASHBOARD:
            return DEFAULT_STATE_EDIT_DASHBOARD
        case RECEIVED_TITLE: {
            return Object.assign({}, state, {
                name: action.value,
                isDirty: true,
            })
        }
        case RECEIVED_CODE: {
            return Object.assign({}, state, {
                code: action.value,
                isDirty: true,
            })
        }
        case RECEIVED_DESCRIPTION: {
            return Object.assign({}, state, {
                description: action.value,
                isDirty: true,
            })
        }
        case ADD_DASHBOARD_ITEM: {
            const dashboardItem = getDashboardItem(action.value)

            if (!dashboardItem.position) {
                return update(state, {
                    dashboardItems: { $unshift: [dashboardItem] },
                    isDirty: { $set: true },
                })
            }

            return update(state, {
                dashboardItems: {
                    $splice: [
                        [parseInt(dashboardItem.position), 0, dashboardItem],
                    ],
                },
                isDirty: { $set: true },
            })
        }
        case REMOVE_DASHBOARD_ITEM: {
            const idToRemove = action.value

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === idToRemove
            )

            if (dashboardItemIndex > -1) {
                return update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1]],
                    },
                    isDirty: { $set: true },
                })
            }

            return state
        }
        case RECEIVED_DASHBOARD_ITEM_SHAPES: {
            if (!action.value) {
                return state
            }

            const stateItems = orArray(state.dashboardItems)

            if (stateItems.length !== action.value.length) {
                return {
                    ...state,
                    dashboardItems: action.value,
                }
            }

            let shapesHaveChanged = false

            const newStateItems = action.value.map(({ x, y, w, h, i }) => {
                const stateItem = stateItems.find(si => si.id === i)
                if (
                    !(
                        stateItem.x === x &&
                        stateItem.y === y &&
                        stateItem.w === w &&
                        stateItem.h === h
                    )
                ) {
                    shapesHaveChanged = true
                    return Object.assign({}, stateItem, {
                        w,
                        h,
                        x,
                        y,
                    })
                }

                return stateItem
            })

            return {
                ...state,
                dashboardItems: shapesHaveChanged
                    ? newStateItems
                    : state.dashboardItems,
                isDirty: shapesHaveChanged,
            }
        }
        case UPDATE_DASHBOARD_ITEM: {
            const dashboardItem = action.value

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === dashboardItem.id
            )

            if (dashboardItemIndex > -1) {
                const newState = update(state, {
                    dashboardItems: {
                        $splice: [
                            [
                                dashboardItemIndex,
                                1,
                                Object.assign({}, dashboardItem),
                            ],
                        ],
                    },
                    isDirty: { $set: true },
                })

                return newState
            }

            return state
        }
        case RECEIVED_FILTER_SETTINGS: {
            return Object.assign({}, state, {
                allowedFilters: action.value.allowedFilters,
                restrictFilters: action.value.restrictFilters,
                isDirty: true,
            })
        }
        case RECEIVED_HIDE_GRID: {
            return {
                ...state,
                hideGrid: action.value,
            }
        }
        case RECEIVED_LAYOUT_COLUMNS: {
            return {
                ...state,
                layout: {
                    ...state.layout,
                    columns: action.value,
                },
            }
        }
        case RECEIVED_ITEM_CONFIG_INSERT_POSITION: {
            return {
                ...state,
                itemConfig: {
                    ...state.itemConfig,
                    insertPosition: action.value,
                },
            }
        }
        default:
            return state
    }
}

// root selector

export const sGetEditDashboardRoot = state => state.editDashboard

// selectors

export const sGetIsEditing = state => !isEmpty(state.editDashboard)

export const sGetIsPrintPreviewView = state =>
    sGetEditDashboardRoot(state).printPreviewView

export const sGetEditDashboardName = state => sGetEditDashboardRoot(state).name
export const sGetEditDashboardCode = state => sGetEditDashboardRoot(state).code
export const sGetEditDashboardDescription = state =>
    sGetEditDashboardRoot(state).description

export const sGetEditDashboardItems = state =>
    orObject(sGetEditDashboardRoot(state)).dashboardItems

export const sGetEditIsDirty = state => sGetEditDashboardRoot(state).isDirty

export const sGetHideGrid = state => sGetEditDashboardRoot(state).hideGrid

const getLayout = editDashboard => editDashboard.layout

export const sGetLayout = state =>
    orObject(getLayout(sGetEditDashboardRoot(state)))

const getColumns = layout => layout.columns

export const sGetLayoutColumns = state => orArray(getColumns(sGetLayout(state)))

const getItemConfig = editDashboard => editDashboard.itemConfig

export const sGetItemConfig = state =>
    orObject(getItemConfig(sGetEditDashboardRoot(state)))

const getInsertPosition = itemConfig => itemConfig.insertPosition

export const sGetItemConfigInsertPosition = state =>
    getInsertPosition(sGetItemConfig(state))
