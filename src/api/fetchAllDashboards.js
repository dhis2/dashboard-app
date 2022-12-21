export const dashboardsQuery = {
    resource: 'dashboards',
    params: {
        fields: ['id', 'displayName', 'favorite~rename(starred)'],
        paging: false,
    },
}

export const apiFetchDashboards = async (dataEngine) => {
    try {
        const dashboardsData = await dataEngine.query({
            dashboards: dashboardsQuery,
        })

        return dashboardsData.dashboards.dashboards
    } catch (error) {
        console.log('Error: ', error)
    }
}
