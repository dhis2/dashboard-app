export const parseSupersetDashboardFieldValues = (values) => ({
    name: values.title || 'Untitled dashboard',
    description: values.description,
    code: values.code,
    embedded: {
        provider: 'SUPERSET',
        id: values.supersetEmbedId,
        options: {
            hideTab: false,
            hideChartControls: !values.showChartControls,
            filters: {
                visible: true,
                expanded: values.expandFilters,
            },
        },
    },
})
