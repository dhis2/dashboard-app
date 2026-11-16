import { createSelector } from 'reselect'

export const SET_SELECTED = 'SET_SELECTED'
export const CLEAR_SELECTED = 'CLEAR_SELECTED'
export const SET_SELECTED_STARRED = 'SET_SELECTED_STARRED'

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
    starred: false,
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
        case SET_SELECTED_STARRED: {
            return {
                ...state,
                starred: action.value,
            }
        }
        default:
            return state
    }
}

// Selectors

export const sGetSelected = (state) => state.selected

export const sGetSelectedId = (state) => sGetSelected(state).id

export const sGetSelectedStarred = (state) => !!sGetSelected(state).starred

export const sGetSelectedIsEmbedded = (state) => !!sGetSelected(state).embedded

export const msGetSelectedSupersetEmbedData = createSelector(
    [
        (state) => state.selected.embedded?.id,
        (state) => state.selected.embedded?.options.hideChartControls,
        (state) => state.selected.embedded?.options.filters.expanded,
    ],
    (id, hideChartControls, expanded) => ({
        id,
        dashboardUiConfig: {
            hideTitle: true,
            hideTab: true,
            hideChartControls,
            filters: {
                visible: true,
                expanded,
            },
        },
    })
)

export const sGetSelectedDisplayName = (state) =>
    sGetSelected(state).displayName

export const sGetSelectedDisplayDescription = (state) =>
    sGetSelected(state).displayDescription

export const sGetSelectedDashboardItems = (state) =>
    sGetSelected(state).dashboardItems || SELECTED_PROPERTIES.dashboardItems

export const sGetIsNullDashboardItems = (state) =>
    sGetSelected(state).dashboardItems === undefined
