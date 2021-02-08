const SYSTEM_SETTINGS = ['keyGatherAnalyticalObjectStatisticsInDashboardViews']

const query = {
    systemSettings: {
        resource: `systemSettings?${SYSTEM_SETTINGS.map(s => `key=${s}`).join(
            '&'
        )}`,
    },
}

export default query
