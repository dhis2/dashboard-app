import { orObject } from '../modules/util'
import objectClean from 'd2-utilizr/lib/objectClean'

/** @module reducers/visualizations */

export const ADD_VISUALIZATION = 'ADD_VISUALIZATION'
export const CLEAR_VISUALIZATIONS = 'CLEAR_VISUALIZATIONS'

export const DEFAULT_STATE_VISUALIZATIONS = {}

const isEmpty = p => p === undefined || p === null

export default (state = DEFAULT_STATE_VISUALIZATIONS, action) => {
    switch (action.type) {
        case ADD_VISUALIZATION: {
            return {
                ...state,
                [action.value.id]: objectClean(
                    {
                        ...orObject(state[action.value.id]),
                        ...action.value,
                    },
                    isEmpty
                ),
            }
        }
        case CLEAR_VISUALIZATIONS: {
            return DEFAULT_STATE_VISUALIZATIONS
        }
        default:
            return state
    }
}

// root selector
const sGetVisualizationsRoot = state => state.visualizations

// selectors level 1
export const sGetVisualization = (state, id) => {
    return sGetVisualizationsRoot(state)[id]
}
