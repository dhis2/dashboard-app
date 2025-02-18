/** @module reducers/dashboards */

import arraySort from 'd2-utilizr/lib/arraySort.js'
import { orObject } from '../modules/util.js'

export const SET_DASHBOARDS = 'SET_DASHBOARDS'
export const ADD_DASHBOARDS = 'ADD_DASHBOARDS'

export const EMPTY_DASHBOARDS = {}
export const DEFAULT_STATE_DASHBOARDS = null

/**
 * Reducer that computes and returns the new state based on the given action
 * @function
 * @param {Object} state The current state
 * @param {Object} action The action to be evaluated
 * @returns {Object}
 */
export default (state = DEFAULT_STATE_DASHBOARDS, action) => {
    switch (action.type) {
        case SET_DASHBOARDS: {
            return action.value
        }
        case ADD_DASHBOARDS: {
            return {
                ...state,
                ...action.value,
            }
        }
        default:
            return state
    }
}

// root selector

export const sGetDashboardsRoot = (state) => state.dashboards

// selector level 1

const sGetAllDashboards = (state) => orObject(sGetDashboardsRoot(state))

// selector level 2

const sGetStarredDashboards = (state) =>
    Object.values(sGetAllDashboards(state)).filter(
        (dashboard) => dashboard.starred === true
    )

const sGetUnstarredDashboards = (state) =>
    Object.values(sGetAllDashboards(state)).filter(
        (dashboard) => dashboard.starred === false
    )

// selector level 3

export const sGetDashboardsSortedByStarred = (state) => [
    ...arraySort(sGetStarredDashboards(state), 'ASC', 'displayName'),
    ...arraySort(sGetUnstarredDashboards(state), 'ASC', 'displayName'),
]
