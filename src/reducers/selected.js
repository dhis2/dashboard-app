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
    embedded: undefined,
}

export default (state = DEFAULT_SELECTED_STATE, action) => {
    switch (action.type) {
        case SET_SELECTED: {
            const newState = {}
            Object.keys(SELECTED_PROPERTIES).map(
                (k) => (newState[k] = action.value[k])
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

export const sGetSelected = (state) => state.selected

export const sGetSelectedId = (state) => sGetSelected(state).id

export const sGetSelectedIsEmbedded = (state) => !!sGetSelected(state).embedded

export const sGetSelectedSupersetEmbedData = (state) => {
    const embedData = sGetSelected(state).embedded
    return {
        id: embedData.id,
        dashboardUiConfig: {
            hideTitle: true,
            hideTab: true,
            hideChartControls: embedData.options.hideChartControls,
            filters: {
                visible: embedData.options.filters.visible,
                expanded: false,
            },
        },
    }
}

export const sGetSelectedDisplayName = (state) =>
    sGetSelected(state).displayName

export const sGetSelectedDisplayDescription = (state) =>
    sGetSelected(state).displayDescription

export const sGetSelectedDashboardItems = (state) =>
    sGetSelected(state).dashboardItems || SELECTED_PROPERTIES.dashboardItems

export const sGetIsNullDashboardItems = (state) =>
    sGetSelected(state).dashboardItems === undefined
