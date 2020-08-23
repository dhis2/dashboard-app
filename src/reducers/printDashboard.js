/** @module reducers/editDashboard */
import update from 'immutability-helper'
import isEmpty from 'lodash/isEmpty'
import { orObject } from '../modules/util'

export const SET_PRINT_DASHBOARD = 'SET_PRINT_DASHBOARD'
export const CLEAR_PRINT_DASHBOARD = 'CLEAR_PRINT_DASHBOARD'
export const ADD_PRINT_DASHBOARD_ITEM = 'ADD_PRINT_DASHBOARD_ITEM'
export const REMOVE_PRINT_DASHBOARD_ITEM = 'REMOVE_PRINT_DASHBOARD_ITEM'
export const UPDATE_PRINT_DASHBOARD_ITEM = 'UPDATE_PRINT_DASHBOARD_ITEM'

export const DEFAULT_STATE_PRINT_DASHBOARD = {}
export const NEW_PRINT_DASHBOARD_STATE = {
    id: '',
    name: '',
    access: {},
    description: '',
    dashboardItems: [],
}

export default (state = DEFAULT_STATE_PRINT_DASHBOARD, action) => {
    switch (action.type) {
        case SET_PRINT_DASHBOARD: {
            const newState = {}
            Object.keys(NEW_PRINT_DASHBOARD_STATE).map(
                k => (newState[k] = action.value[k])
            )
            return newState
        }
        case CLEAR_PRINT_DASHBOARD:
            return DEFAULT_STATE_PRINT_DASHBOARD
        case ADD_PRINT_DASHBOARD_ITEM:
            if (!action.value.position) {
                return update(state, {
                    dashboardItems: { $unshift: [action.value] },
                })
            }

            return update(state, {
                dashboardItems: {
                    $splice: [
                        [parseInt(action.value.position), 0, action.value],
                    ],
                },
            })

        case REMOVE_PRINT_DASHBOARD_ITEM: {
            const idToRemove = action.value

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === idToRemove
            )

            if (dashboardItemIndex > -1) {
                return update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1]],
                    },
                })
            }

            return state
        }
        case UPDATE_PRINT_DASHBOARD_ITEM: {
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
                })

                return newState
            }

            return state
        }
        default:
            return state
    }
}

// root selector

export const sGetPrintDashboardRoot = state => state.printDashboard

// selectors

export const sGetIsPrinting = state => !isEmpty(state.printDashboard)

export const sGetPrintDashboardItems = state =>
    orObject(sGetPrintDashboardRoot(state)).dashboardItems
