// filter out CATEGORY that are not of type ATTRIBUTE
const filteredDimensions = dimensions =>
    dimensions.filter(
        dim =>
            dim.dimensionType !== 'CATEGORY' ||
            (dim.dimensionType === 'CATEGORY' &&
                dim.dataDimensionType === 'ATTRIBUTE')
    )

export default filteredDimensions
