export const apps = [
    {
        key: 'app-widget',
        name: 'Scorecard',
        appType: 'DASHBOARD_WIDGET',
        launchUrl: 'https://iframe/app/widget/scorecard',
    },
    {
        key: 'app-widget-no-title',
        name: 'Scorecard but hide the title',
        launchUrl: 'https://iframe/app/widget/scorecard',
        appType: 'DASHBOARD_WIDGET',
        settings: {
            dashboardWidget: {
                hideTitle: true,
            },
        },
    },
    {
        key: 'dashboard-plugin',
        name: 'Dashboard plugin',
        appType: 'APP',
        pluginLaunchUrl: 'https://plugin/iframe/url',
    },
]
export const bundledApps = []
export const currentUser = {
    username: 'rainbowDash',
    id: 'r3nb0d5h',
    settings: {},
}
export const rootOrgUnits = []
export const systemSettings = {
    keyDashboardContextMenuItemOpenInRelevantApp: true,
    keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
    keyDashboardContextMenuItemSwitchViewType: true,
    keyDashboardContextMenuItemViewFullscreen: true,
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
}
