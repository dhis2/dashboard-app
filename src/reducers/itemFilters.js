import { sGetDimensions } from './dimensions'
import { createSelector } from 'reselect'

export const CLEAR_ITEM_FILTERS = 'CLEAR_ITEM_FILTERS'
export const SET_ITEM_FILTERS = 'SET_ITEM_FILTERS'
export const ADD_ITEM_FILTER = 'ADD_ITEM_FILTER'
export const REMOVE_ITEM_FILTER = 'REMOVE_ITEM_FILTER'

export const DEFAULT_STATE_ITEM_FILTERS = {}

export default (state = DEFAULT_STATE_ITEM_FILTERS, action) => {
    switch (action.type) {
        case ADD_ITEM_FILTER: {
            return {
                ...state,
                [action.filter.id]: action.filter.value,
            }
        }
        case REMOVE_ITEM_FILTER: {
            const newState = { ...state }

            delete newState[action.id]

            return newState
        }
        case SET_ITEM_FILTERS: {
            return action.filters
        }
        case CLEAR_ITEM_FILTERS: {
            return DEFAULT_STATE_ITEM_FILTERS
        }
        default:
            return state
    }
}

// selectors

export const sGetItemFiltersRoot = state => state.itemFilters

// simplify the filters structure to:
// [{ id: 'pe', name: 'Period', values: [{ id: 2019: name: '2019' }, {id: 'LAST_MONTH', name: 'Last month' }]}, ...]
export const sGetNamedItemFilters = createSelector(
    [sGetItemFiltersRoot, sGetDimensions],
    (filters, dimensions) =>
        Object.keys(filters).reduce((arr, id) => {
            arr.push({
                id: id,
                name: dimensions.find(dimension => dimension.id === id).name,
                values: filters[id].map(value => ({
                    id: value.id,
                    name: value.displayName || value.name,
                })),
            })

            return arr
        }, [])
)
