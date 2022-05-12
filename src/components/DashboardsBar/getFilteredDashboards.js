import arraySort from 'd2-utilizr/lib/arraySort'

export const getFilteredDashboards = (dashboards, filterText) => {
    const filteredDashboards = arraySort(
        Object.values(dashboards).filter((d) =>
            d.displayName.toLowerCase().includes(filterText.toLowerCase())
        ),
        'ASC',
        'displayName'
    )

    return [
        ...filteredDashboards.filter((d) => d.starred),
        ...filteredDashboards.filter((d) => !d.starred),
    ]
}
