export const deleteDashboardMutation = {
    type: 'delete',
    resource: 'dashboards',
    id: ({ id }) => id,
}

export const apiDeleteDashboard = async (dataEngine, id) => {
    try {
        await dataEngine.mutate(deleteDashboardMutation, { variables: { id } })
    } catch (error) {
        console.log('Error: ', error)
    }
}
