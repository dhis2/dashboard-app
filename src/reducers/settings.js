export const SET_SETTINGS = 'SET_SETTINGS'
export const ADD_SETTINGS = 'ADD_SETTINGS'

export const DEFAULT_SETTINGS = {
    keyDateFormat: 'yyyy-MM-dd',
    keyAnalysisRelativePeriod: 'LAST_12_MONTHS',
    keyAnalysisDigitGroupSeparator: 'SPACE',
    displayNameProperty: 'displayName',
    uiLocale: 'en',
    rootOrganisationUnit: {},
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
}

export default (state = DEFAULT_SETTINGS, action) => {
    switch (action.type) {
        case SET_SETTINGS: {
            return Object.assign({}, action.value)
        }
        case ADD_SETTINGS: {
            return {
                ...state,
                ...action.value,
            }
        }
        default:
            return state
    }
}

// Selectors

export const sGetSettings = state => state.settings

export const sGetSettingsDisplayNameProperty = state =>
    sGetSettings(state).displayNameProperty

export const sGetRootOrgUnit = state => sGetSettings(state).rootOrganisationUnit

export const sGetRelativePeriod = state =>
    sGetSettings(state).keyAnalysisRelativePeriod

export const sGetUiLocale = state => sGetSettings(state).uiLocale
export const sGatherAnalyticalObjectStatisticsInDashboardViews = state =>
    sGetSettings(state).keyGatherAnalyticalObjectStatisticsInDashboardViews
