export const SET_SELECTED = 'SET_SELECTED'
export const CLEAR_SELECTED = 'CLEAR_SELECTED'

export const DEFAULT_SELECTED_STATE = {}
const SELECTED_PROPERTIES = {
    id: '',
    displayName: '',
    displayDescription: '',
    access: {},
    restrictFilters: false,
    allowedFilters: [],
    dashboardItems: [],
    layout: [],
    itemConfig: {},
}

export default (state = DEFAULT_SELECTED_STATE, action) => {
    switch (action.type) {
        case SET_SELECTED: {
            const newState = {}
            Object.keys(SELECTED_PROPERTIES).map(
                k => (newState[k] = action.value[k])
            )
            return newState
        }
        case CLEAR_SELECTED: {
            return DEFAULT_SELECTED_STATE
        }
        default:
            return state
    }
}

// Selectors

export const sGetSelected = state => state.selected

export const sGetSelectedId = state => sGetSelected(state).id

export const sGetSelectedDisplayName = state => sGetSelected(state).displayName

export const sGetSelectedDisplayDescription = state =>
    sGetSelected(state).displayDescription

export const sGetSelectedDashboardItems = state =>
    sGetSelected(state).dashboardItems || SELECTED_PROPERTIES.dashboardItems

export const sGetIsNullDashboardItems = state =>
    sGetSelected(state).dashboardItems === undefined
