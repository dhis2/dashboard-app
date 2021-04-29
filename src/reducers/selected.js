export const SET_SELECTED = 'SET_SELECTED'

export const DEFAULT_SELECTED_STATE = {
    id: '',
    displayName: '',
    displayDescription: '',
    starred: false,
    access: {},
    restrictFilters: false,
    allowedFilters: [],
    dashboardItems: [],
}

export default (state = DEFAULT_SELECTED_STATE, action) => {
    switch (action.type) {
        case SET_SELECTED: {
            const newState = {}
            Object.keys(DEFAULT_SELECTED_STATE).map(
                k => (newState[k] = action.value[k])
            )
            return newState
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
    sGetSelected(state).dashboardItems
