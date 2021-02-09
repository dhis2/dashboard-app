export const DEFAULT_SETTINGS = {
    displayNameProperty: 'displayName',
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
}

const SYSTEM_SETTINGS = ['keyGatherAnalyticalObjectStatisticsInDashboardViews']

const query = {
    resource: 'systemSettings',
    params: { key: SYSTEM_SETTINGS },
}

export default query
