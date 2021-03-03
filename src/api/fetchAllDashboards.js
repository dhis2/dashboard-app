import { onError } from './index'

export const dashboardsQuery = {
    resource: 'dashboards',
    params: {
        fields: ['id', 'displayName', 'favorite'].join(','),
        paging: false,
    },
}

const fetchAllDashboards = async dataEngine => {
    try {
        const dashboardsData = await dataEngine.query({
            dashboards: dashboardsQuery,
        })

        return dashboardsData.dashboards.dashboards
    } catch (error) {
        onError(error)
    }
}

export default fetchAllDashboards
