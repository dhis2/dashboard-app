/** @module reducers/dashboards */

import arraySort from 'd2-utilizr/lib/arraySort'

import { orObject } from '../modules/util'

export const SET_DASHBOARDS = 'SET_DASHBOARDS'
export const ADD_DASHBOARDS = 'ADD_DASHBOARDS'
export const SET_DASHBOARD_STARRED = 'SET_DASHBOARD_STARRED'

export const DEFAULT_STATE_DASHBOARDS = {
    byId: null,
}

export const EMPTY_DASHBOARDS = {}
// export const NO_DASHBOARDS = 'NO_DASHBOARDS'

// reducer helper functions

const updateDashboardProp = ({ state, dashboardId, prop, value }) => ({
    byId: {
        ...state.byId,
        [dashboardId]: {
            ...state.byId[dashboardId],
            [prop]: value,
        },
    },
})

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
            return {
                byId: action.value,
            }
        }
        case ADD_DASHBOARDS: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...action.value,
                },
            }
        }
        case SET_DASHBOARD_STARRED: {
            return updateDashboardProp({
                state,
                dashboardId: action.dashboardId,
                prop: 'starred',
                value: action.value,
            })
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
 * If dashboards.byId is null, then the dashboards api request
 * has not yet completed. If dashboards.byId is an empty object
 * then the dashboards api request is complete, but no dashboards
 * were returned
 *
 * @function
 * @param {Object} state The current state
 * @param {Number} id The id of the dashboard
 * @returns {Object | undefined}
 */
export const sGetDashboardById = (state, id) =>
    orObject(sGetDashboardsRoot(state).byId)[id]

export const sDashboardsIsFetching = state => {
    return sGetDashboardsRoot(state).byId === null
}

/**
 * Selector which returns all dashboards (the byId object)
 *
 * @function
 * @param {Object} state The current state
 * @returns {Object | undefined}
 */
export const sGetAllDashboards = state =>
    orObject(sGetDashboardsRoot(state).byId)

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
