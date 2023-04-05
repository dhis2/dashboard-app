import arrayClean from 'd2-utilizr/lib/arrayClean.js'

// Id, name
export const getIdNameFields = ({ rename } = {}) => [
    'id',
    `${rename ? 'displayName~rename(name)' : 'name,displayName'}`,
]

// Item
export const getItemFields = () => [
    'dimensionItem~rename(id)',
    'displayName~rename(name)',
    'dimensionItemType',
]

// Dimension
export const getDimensionFields = ({ withItems, withRepetition }) =>
    arrayClean([
        'dimension',
        'legendSet[id]',
        'filter',
        'programStage',
        withItems ? `items[${getItemFields().join(',')}]` : ``,
        withRepetition ? 'repetition' : '',
    ])

// Axis
export const getAxesFields = ({ withItems, withRepetition }) => [
    `columns[${getDimensionFields({ withItems, withRepetition }).join(',')}]`,
    `rows[${getDimensionFields({ withItems, withRepetition }).join(',')}]`,
    `filters[${getDimensionFields({ withItems, withRepetition }).join(',')}]`,
]

// Favorite
export const getFavoriteFields = ({
    withDimensions,
    withOptions,
    withRepetition,
}) => {
    return arrayClean([
        `${getIdNameFields({ rename: true }).join(',')}`,
        'type',
        'displayDescription~rename(description)',
        withDimensions
            ? `${getAxesFields({ withItems: true, withRepetition }).join(',')}`
            : ``,
        withOptions
            ? [
                  '*',
                  '!attributeDimensions',
                  '!attributeValues',
                  '!category',
                  '!categoryDimensions',
                  '!categoryOptionGroupSetDimensions',
                  '!columnDimensions',
                  '!dataDimensionItems',
                  '!dataElementDimensions',
                  '!dataElementGroupSetDimensions',
                  '!filterDimensions',
                  '!itemOrganisationUnitGroups',
                  '!lastUpdatedBy',
                  '!organisationUnitGroupSetDimensions',
                  '!organisationUnitLevels',
                  '!organisationUnits',
                  '!programIndicatorDimensions',
                  '!relativePeriods',
                  '!reportParams',
                  '!rowDimensions',
                  '!translations',
                  '!userOrganisationUnit',
                  '!userOrganisationUnitChildren',
                  '!userOrganisationUnitGrandChildren',
              ].join(',')
            : '',
    ])
}

export const getFavoritesFields = () => [
    `visualization[${getFavoriteFields({ withDimensions: false }).join(',')}]`,
    `map[${getFavoriteFields({ withDimensions: false }).join(',')}]`,
    `eventReport[${getFavoriteFields({ withDimensions: false }).join(',')}]`,
    `eventChart[${getFavoriteFields({ withDimensions: false }).join(',')}]`,
    `eventVisualization[${getFavoriteFields({ withDimensions: false }).join(
        ','
    )}]`,
]

// List item
export const getListItemFields = () => [
    `reports[${['type', ...getIdNameFields({ rename: true })].join(',')}]`,
    `resources[${getIdNameFields({ rename: true }).join(',')}]`,
    `users[${getIdNameFields({ rename: true }).join(',')}]`,
]

// Map
export const getMapFields = () => {
    const favoriteFields = getFavoriteFields({
        withDimensions: true,
        withOptions: true,
    })

    const teFields =
        'program[id,displayName~rename(name)],programStage[id,displayName~rename(name)],trackedEntityType[id,displayName~rename(name)]'

    return [
        `${getIdNameFields({ rename: true }).join(',')}`,
        'user,longitude,latitude,zoom,basemap',
        `mapViews[${favoriteFields.concat(teFields)}]`,
    ]
}
