export const firstDashboardQuery = {
    dashboards: {
        resource: 'dashboards',
        params: {
            fields: 'id,displayName',
            order: 'favorite:desc,displayName:asc',
            paging: true,
            pageSize: 1,
        },
    },
}

export const requestedDashboardQuery = {
    dashboard: {
        resource: 'dashboards',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName'],
        },
    },
}

export const dashboardsByIdsQuery = {
    dashboards: {
        resource: 'dashboards',
        params: ({ ids }) => {
            return {
                fields: 'id,displayName,favorite~rename(starred)',
                order: 'favorite:desc,displayName:asc',
                filter: ids ? `id:in:[${ids.join(',')}]` : undefined,
                paging: false,
            }
        },
    },
}
