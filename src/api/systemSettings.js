export const DEFAULT_SETTINGS = {
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

const SYSTEM_SETTINGS_REMAPPINGS = {
    keyDashboardContextMenuItemOpenInRelevantApp: 'allowVisOpenInApp',
    keyDashboardContextMenuItemShowInterpretationsAndDetails:
        'allowVisShowInterpretations',
    keyDashboardContextMenuItemSwitchViewType: 'allowVisViewAs',
    keyDashboardContextMenuItemViewFullscreen: 'allowVisFullscreen',
}

export const renameSystemSettings = settings => {
    return Object.keys(settings).reduce((mapped, key) => {
        mapped[SYSTEM_SETTINGS_REMAPPINGS[key] || key] = settings[key]
        return mapped
    }, {})
}

export const systemSettingsQuery = {
    resource: 'systemSettings',
    params: { key: SYSTEM_SETTINGS },
}
