export const DEFAULT_SETTINGS = {
    displayNameProperty: 'displayName',
    keyDashboardContextMenuItemOpenInRelevantApp: true,
    keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
    keyDashboardContextMenuItemSwitchViewType: true,
    keyDashboardContextMenuItemViewFullscreen: true,
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
}

const SYSTEM_SETTINGS = [
    'keyDashboardContextMenuItemOpenInRelevantApp',
    'keyDashboardContextMenuItemShowInterpretationsAndDetails',
    'keyDashboardContextMenuItemSwitchViewType',
    'keyDashboardContextMenuItemViewFullscreen',
    'keyGatherAnalyticalObjectStatisticsInDashboardViews',
]

const query = {
    resource: 'systemSettings',
    params: { key: SYSTEM_SETTINGS },
}

export default query
