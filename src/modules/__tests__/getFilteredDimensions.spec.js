import getFilteredDimensions from '../getFilteredDimensions.js'

test('getFilteredDimensions filters out CATEGORY dimensions that do not have dataDimensionType="ATTRIBUTE"', () => {
    const dimensions = [
        {
            dataDimensionType: 'ATTRIBUTE',
            dimensionType: 'CATEGORY',
        },
        {
            dataDimensionType: 'DISAGGREGATION',
            dimensionType: 'CATEGORY',
        },
        {
            dimensionType: 'DATA_ELEMENT_GROUP_SET',
        },
        {
            dimensionType: 'ORGANISATION_UNIT_GROUP_SET',
        },
        {
            dimensionType: 'CATEGORY_OPTION_GROUP_SET',
        },
    ]

    const expectedRemovedDimensions = [
        {
            dataDimensionType: 'DISAGGREGATION',
            dimensionType: 'CATEGORY',
        },
    ]

    const expectedKeptDimensions = [
        {
            dataDimensionType: 'ATTRIBUTE',
            dimensionType: 'CATEGORY',
        },
        {
            dimensionType: 'DATA_ELEMENT_GROUP_SET',
        },
        {
            dimensionType: 'ORGANISATION_UNIT_GROUP_SET',
        },
        {
            dimensionType: 'CATEGORY_OPTION_GROUP_SET',
        },
    ]

    const filteredDimensions = getFilteredDimensions(dimensions)
    expect(filteredDimensions.length).toEqual(4)
    expect(filteredDimensions).toEqual(
        expect.not.arrayContaining(expectedRemovedDimensions)
    )
    expect(filteredDimensions).toEqual(
        expect.arrayContaining(expectedKeptDimensions)
    )
})
