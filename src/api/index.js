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

const getAxesFields = ({ withItems }) => [
    `columns[${getDimensionFields({ withItems }).join(',')}]`,
    `rows[${getDimensionFields({ withItems }).join(',')}]`,
    `filters[${getDimensionFields({ withItems }).join(',')}]`,
];

const getFavoriteFields = ({ withDimensions }) =>
    arrayClean([
        `${getIdNameFields({ rename: true }).join(',')}`,
        withDimensions ? `${getAxesFields({ withItems: true }).join(',')}` : ``,
    ]);

const getFavoritesFields = ({ withDimensions }) => [
    `reportTable[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `chart[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `map[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventReport[${getFavoriteFields({ withDimensions }).join(',')}]`,
    `eventChart[${getFavoriteFields({ withDimensions }).join(',')}]`,
];

const getDashboardItemsFields = ({ withFavorite } = {}) =>
    arrayClean([
        'id',
        'type',
        'shape',
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

// export const apiFetchSomething = () =>
//     getInstance().then(d2 => d2.Api.getApi().get('/'));
