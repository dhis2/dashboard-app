const getStarDashboardMutation = (id) => ({
    type: 'create',
    resource: `dashboards/${id}/favorite`,
})

const getUnstarDashboardMutation = (id) => ({
    type: 'delete',
    resource: `dashboards/${id}/favorite`,
})

export const apiStarDashboard = (dataEngine, id, isStarred) => {
    const mutation = isStarred
        ? getStarDashboardMutation(id)
        : getUnstarDashboardMutation(id)

    return dataEngine.mutate(mutation)
}
