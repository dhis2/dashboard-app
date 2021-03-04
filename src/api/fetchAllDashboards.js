import { onError } from './index'

export const dashboardsQuery = {
    resource: 'dashboards',
    params: {
        fields: ['id', 'displayName', 'favorite'].join(','),
        paging: false,
    },
}

export const apiFetchDashboards = async dataEngine => {
    try {
        const dashboardsData = await dataEngine.query({
            dashboards: dashboardsQuery,
        })

        return dashboardsData.dashboards.dashboards
    } catch (error) {
        onError(error)
    }
}
