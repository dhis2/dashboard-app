import { getInstance } from 'd2/lib/d2';
import arrayClean from 'd2-utilizr/lib/arrayClean';

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

const getAxesFields = () => [
    `columns[${getDimensionFields({ withItems: true }).join(',')}]`,
    `rows[${getDimensionFields({ withItems: true }).join(',')}]`,
    `filters[${getDimensionFields({ withItems: true }).join(',')}]`,
];

const getFavoriteFields = () => [
    `${getIdNameFields({ rename: true }).join(',')}`,
    `${getAxesFields().join(',')}`,
];

const getFavoritesFields = () => [
    `reportTable[${getFavoriteFields().join(',')}]`,
    `chart[${getFavoriteFields().join(',')}]`,
    `map[${getFavoriteFields().join(',')}]`,
    `eventReport[${getFavoriteFields().join(',')}]`,
    `eventChart[${getFavoriteFields().join(',')}]`,
];

const getDashboardItemsFields = ({ withFavorite } = {}) =>
    arrayClean([
        'id',
        'type',
        'shape',
        withFavorite ? `${getFavoritesFields().join(',')}` : ``,
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
                  withFavorite: true,
              }).join(',')}]`
            : ``,
    ]);

const onError = error => console.log('Error: ', error);

export const apiFetchDashboards = () =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.list({
                fields: [
                    getDashboardFields({ withItems: true }).join(','),
                    'dashboardItems',
                ].join(','),
            })
        )
        .catch(onError);

export const apiFetchSelected = id =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.get(id, {
                fields: arrayClean(
                    getDashboardFields({
                        withItems: true,
                        withFavorite: true,
                    })
                ).join(','),
            })
        )
        .catch(onError);
