import { getInstance } from 'd2'

export const apiGetDataStatistics = async (dataEngine, username) => {
    const getDataStatisticsQuery = {
        resource: 'dataStatistics/favorites',
        params: {
            eventType: 'DASHBOARD_VIEW',
            pageSize: 6,
            ...(username ? { username } : {}),
        },
    }

    try {
        const mostViewedDashboardsResult = await dataEngine.query({
            dashboard: getDataStatisticsQuery,
        })

        return mostViewedDashboardsResult
    } catch (error) {
        console.log('Error: ', error)
    }
}

export const apiPostDataStatistics = async (eventType, id) => {
    const d2 = await getInstance()
    const url = `dataStatistics?eventType=${eventType}&favorite=${id}`

    d2.Api.getApi().post(url)
}
