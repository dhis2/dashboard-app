const getVisualizationLayoutClone = vis => {
    const rows = vis.rows.map(obj => ({ ...obj }))
    const columns = vis.columns.map(obj => ({ ...obj }))
    const filters = vis.filters.map(obj => ({ ...obj }))

    return {
        rows,
        columns,
        filters,
    }
}

const getFilteredVisualization = (visualization, filters) => {
    if (!Object.keys(filters).length) {
        return visualization
    }

    const visualizationLayout = getVisualizationLayoutClone(visualization)

    Object.keys(filters).forEach(dimensionId => {
        if (filters[dimensionId]) {
            let dimensionFound = false

            Object.values(visualizationLayout).forEach(dimensionObjects =>
                dimensionObjects
                    .filter(obj => obj.dimension === dimensionId)
                    .forEach(obj => {
                        dimensionFound = true
                        obj.items = filters[dimensionId]
                    })
            )

            // add dimension to filters if not already present elsewhere
            if (!dimensionFound) {
                visualizationLayout.filters.push({
                    dimension: dimensionId,
                    items: filters[dimensionId],
                })
            }
        }
    })

    return {
        ...visualization,
        rows: visualizationLayout.rows,
        columns: visualizationLayout.columns,
        filters: visualizationLayout.filters,
    }
}

export default getFilteredVisualization
