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

const POST_DATA_STATISTICS_QUERY = {
    resource: 'dataStatistics',
    type: 'create',
    params: ({ eventType, favorite }) => ({
        eventType,
        favorite,
    }),
}

export const apiPostDataStatistics = async (eventType, favorite, engine) =>
    await engine.mutate(POST_DATA_STATISTICS_QUERY, {
        variables: {
            eventType,
            favorite,
        },
    })
