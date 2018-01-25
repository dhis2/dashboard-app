import { getInstance } from 'd2/lib/d2';
import arrayClean from 'd2-utilizr/lib/arrayClean';

import { itemTypeMap } from '../util';

export const getUrlByFavoriteType = type => itemTypeMap[type].endPointName;

export const delay = (ms = 500) =>
    new Promise(resolve => setTimeout(resolve, ms));

const getIdNameFields = ({ rename } = {}) => [
    'id',
    `${rename ? 'displayName~rename(name)' : 'name'}`,
];

const getItemFields = () => ['dimensionItem~rename(id)'];

const getDimensionFields = ({ withItems }) =>
    arrayClean([
        'dimension',
        withItems ? `items[${getItemFields().join(',')}]` : ``,
    ]);

const getAxesFields = ({ withItems }) => [
    `columns[${getDimensionFields({ withItems }).join(',')}]`,
    `rows[${getDimensionFields({ withItems }).join(',')}]`,
    `filters[${getDimensionFields({ withItems }).join(',')}]`,
];

const interpretationFields = () => {
    return 'interpretations[id]';
    // return 'interpretations[id,text,created,user[id,displayName],likedBy,comments[id,text,created,user[id,displayName]]]';
};

const getFavoriteFields = ({ withDimensions, withOptions }) => {
    return arrayClean([
        `${getIdNameFields({ rename: true }).join(',')}`,
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

const getFavoritesFields = ({ withDimensions, withOptions }) => [
    `reportTable[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `chart[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `map[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventReport[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventChart[${getFavoriteFields({ withDimensions }).join(',')}]`,
];

const getListItemFields = () => [
    `reports[${getIdNameFields({ rename: true }).join(',')}]`,
    `resources[${getIdNameFields({ rename: true }).join(',')}]`,
    `users[${getIdNameFields({ rename: true }).join(',')}]`,
];

const getDashboardItemsFields = ({ withFavorite } = {}) =>
    arrayClean([
        'id',
        'type',
        'shape',
        'x',
        'y',
        'width~rename(w)',
        'height~rename(h)',
        `${getListItemFields().join(',')}`,
        withFavorite
            ? `${getFavoritesFields({
                  withDimensions: withFavorite.withDimensions,
              }).join(',')}`
            : ``,
    ]);

const getDashboardFields = ({ withItems, withFavorite } = {}) =>
    arrayClean([
        `${getIdNameFields({ rename: true }).join(',')}`,
        'description',
        `user[${getIdNameFields({ rename: true }).join(',')}]`,
        'created',
        'lastUpdated',
        withItems
            ? `dashboardItems[${getDashboardItemsFields({
                  withFavorite,
              }).join(',')}]`
            : ``,
    ]);

const onError = error => console.log('Error: ', error);

// Get "all" dashboards on startup
export const apiFetchDashboards = () =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.list({
                fields: [
                    getDashboardFields().join(','),
                    'dashboardItems[id]',
                ].join(','),
                paging: 'false',
            })
        )
        .catch(onError);

// Get more info about selected dashboard
export const apiFetchSelected = id =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.get(id, {
                fields: arrayClean(
                    getDashboardFields({
                        withItems: true,
                        withFavorite: { withDimensions: false },
                    })
                ).join(','),
            })
        )
        .catch(onError);

// Get more info about selected dashboard
export const apiFetchFavorite = (id, type) =>
    getInstance().then(d2 =>
        d2.Api.getApi().get(
            `${getUrlByFavoriteType(type)}/${id}?fields=${getFavoriteFields({
                withDimensions: true,
                withOptions: true,
            })}`
        )
    );
