export const getStarDashboardMutation = id => ({
    type: 'create',
    resource: `dashboards/${id}/favorite`,
})

export const getUnstarDashboardMutation = id => ({
    type: 'delete',
    resource: `dashboards/${id}/favorite`,
})
