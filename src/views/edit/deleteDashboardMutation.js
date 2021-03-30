export const deleteDashboardMutation = {
    type: 'delete',
    resource: 'dashboards',
    id: ({ id }) => id,
}
