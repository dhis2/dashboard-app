import { getInstance } from 'd2/lib/d2';
import arrayClean from 'd2-utilizr/lib/arrayClean';

import { interpretationFields } from './interpretations';
import { onError, getEndPointName } from './index';

// Id, name
export const getIdNameFields = ({ rename } = {}) => [
    'id',
    `${rename ? 'displayName~rename(name)' : 'name,displayName'}`,
];

// Item
export const getItemFields = () => ['dimensionItem~rename(id)'];

// Dimension
export const getDimensionFields = ({ withItems }) =>
    arrayClean([
        'dimension',
        'legendSet[id]',
        withItems ? `items[${getItemFields().join(',')}]` : ``,
    ]);

// Axis
export const getAxesFields = ({ withItems }) => [
    `columns[${getDimensionFields({ withItems }).join(',')}]`,
    `rows[${getDimensionFields({ withItems }).join(',')}]`,
    `filters[${getDimensionFields({ withItems }).join(',')}]`,
];

// Favorite
export const getFavoriteFields = ({ withDimensions, withOptions }) => {
    return arrayClean([
        `${getIdNameFields({ rename: true }).join(',')}`,
        'displayDescription~rename(description)',
        interpretationFields(),
        withDimensions ? `${getAxesFields({ withItems: true }).join(',')}` : ``,
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
                  '!series',
                  '!translations',
                  '!userOrganisationUnit',
                  '!userOrganisationUnitChildren',
                  '!userOrganisationUnitGrandChildren',
              ].join(',')
            : '',
    ]);
};

export const getFavoritesFields = ({ withDimensions, withOptions }) => [
    `reportTable[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `chart[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `map[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventReport[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventChart[${getFavoriteFields({ withDimensions }).join(',')}]`,
];

// List item
export const getListItemFields = () => [
    `reports[${getIdNameFields({ rename: true }).join(',')}]`,
    `resources[${getIdNameFields({ rename: true }).join(',')}]`,
    `users[${getIdNameFields({ rename: true }).join(',')}]`,
];

// Map
export const getMapFields = () =>
    'id,user,displayName~rename(name),longitude,latitude,zoom,basemap, mapViews[*,columns[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],rows[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],filters[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],dataDimensionItems,program[id,displayName~rename(name)],programStage[id,displayName~rename(name)],legendSet[id,displayName~rename(name)],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]]';

// Api

// Get more info about the favorite of a dashboard item
export const apiFetchFavorite = (id, type, { fields }) =>
    getInstance().then(d2 =>
        d2.Api.getApi().get(
            `${getEndPointName(type)}/${id}?fields=${fields ||
                getFavoriteFields({
                    withDimensions: true,
                    withOptions: true,
                })}`
        )
    );
