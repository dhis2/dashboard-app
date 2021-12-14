export const getDashboardsQQuery = (query = '', maxItems = []) => {
    return {
        resource: `dashboards/q/${encodeURIComponent(query)}`,
        params: { count: 11, max: maxItems },
    }
}
