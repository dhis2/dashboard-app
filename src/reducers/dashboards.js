/** @module reducers/dashboards */

import arraySort from 'd2-utilizr/lib/arraySort'
import { orObject } from '../modules/util'

export const SET_DASHBOARDS = 'SET_DASHBOARDS'
export const ADD_DASHBOARDS = 'ADD_DASHBOARDS'
export const SET_DASHBOARD_STARRED = 'SET_DASHBOARD_STARRED'

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
        case SET_DASHBOARD_STARRED: {
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    starred: action.value,
                },
            }
        }
        default:
            return state
    }
}

// root selector

export const sGetDashboardsRoot = state => state.dashboards

// selector level 1

/**
 * Selector which returns a dashboard by id from the state object
 * If no matching dashboard is found it returns undefined
 * If dashboards is null, then the dashboards api request
 * has not yet completed. If dashboards is an empty object
 * then the dashboards api request is complete, but no dashboards
 * were returned
 *
 * @function
 * @param {Object} state The current state
 * @param {Number} id The id of the dashboard
 * @returns {Object | undefined}
 */
export const sGetDashboardById = (state, id) =>
    (sGetDashboardsRoot(state) || EMPTY_DASHBOARDS)[id]

export const sGetDashboardStarred = (state, id) =>
    sGetDashboardById(state, id).starred

export const sDashboardsIsFetching = state => {
    return sGetDashboardsRoot(state) === null
}

/**
 * Selector which returns all dashboards
 *
 * @function
 * @param {Object} state The current state
 * @returns {Object | undefined}
 */
export const sGetAllDashboards = state => orObject(sGetDashboardsRoot(state))

// selector level 2

const sGetStarredDashboards = state =>
    Object.values(sGetAllDashboards(state)).filter(
        dashboard => dashboard.starred === true
    )

const sGetUnstarredDashboards = state =>
    Object.values(sGetAllDashboards(state)).filter(
        dashboard => dashboard.starred === false
    )

// selector level 3

export const sGetDashboardsSortedByStarred = state => [
    ...arraySort(sGetStarredDashboards(state), 'ASC', 'displayName'),
    ...arraySort(sGetUnstarredDashboards(state), 'ASC', 'displayName'),
]
