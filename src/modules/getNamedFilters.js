// simplify the filters structure to:
// [{ id: 'pe', name: 'Period', values: [{ id: 2019: name: '2019' }, {id: 'LAST_MONTH', name: 'Last month' }]}, ...]

const getNamedFilters = (filters, dimensions) =>
    Object.keys(filters).reduce((arr, id) => {
        arr.push({
            id: id,
            name: dimensions.find(dimension => dimension.id === id).name,
            values: filters[id].map(value => ({
                id: value.id,
                name: value.displayName || value.name,
            })),
        })

        return arr
    }, [])

export default getNamedFilters
