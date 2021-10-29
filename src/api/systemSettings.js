export const DEFAULT_SETTINGS = {
    keyDashboardContextMenuItemOpenInRelevantApp: true,
    keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
    keyDashboardContextMenuItemSwitchViewType: true,
    keyDashboardContextMenuItemViewFullscreen: true,
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
    startModuleEnableLightweight: false,
}

const SYSTEM_SETTINGS = [
    'keyDashboardContextMenuItemOpenInRelevantApp',
    'keyDashboardContextMenuItemShowInterpretationsAndDetails',
    'keyDashboardContextMenuItemSwitchViewType',
    'keyDashboardContextMenuItemViewFullscreen',
    'keyGatherAnalyticalObjectStatisticsInDashboardViews',
    'keyHideBiMonthlyPeriods',
    'keyHideDailyPeriods',
    'keyHideMonthlyPeriods',
    'keyHideWeeklyPeriods',
    'keyHideBiWeeklyPeriods',
    'startModuleEnableLightweight',
]

const SYSTEM_SETTINGS_REMAPPINGS = {
    keyDashboardContextMenuItemOpenInRelevantApp: 'allowVisOpenInApp',
    keyDashboardContextMenuItemShowInterpretationsAndDetails:
        'allowVisShowInterpretations',
    keyDashboardContextMenuItemSwitchViewType: 'allowVisViewAs',
    keyDashboardContextMenuItemViewFullscreen: 'allowVisFullscreen',
    keyHideBiMonthlyPeriods: 'hideBiMonthlyPeriods',
    keyHideDailyPeriods: 'hideDailyPeriods',
    keyHideMonthlyPeriods: 'hideMonthlyPeriods',
    keyHideWeeklyPeriods: 'hideWeeklyPeriods',
    keyHideBiWeeklyPeriods: 'hideBiWeeklyPeriods',
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
