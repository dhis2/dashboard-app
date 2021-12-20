export const getDashboardsQQuery = (query = '', maxItems = []) => {
    return {
        resource: `dashboards/q/${query}`,
        params: { count: 11, max: maxItems },
    }
}
