import { getInstance } from 'd2/lib/d2';
import arrayClean from 'd2-utilizr/lib/arrayClean';

export const delay = (ms = 500) =>
    new Promise(resolve => setTimeout(resolve, ms));

const getIdNameFields = rename => [
    'id',
    `${rename ? 'displayName~rename(name)' : 'name'}`,
];

const getItemFields = () => ['dimensionItem~rename(id)'];

const getDimensionFields = withDep =>
    arrayClean([
        'dimension',
        withDep ? `items[${getItemFields().join(',')}]` : ``,
    ]);

const getAxesFields = () => [
    `columns[${getDimensionFields(true).join(',')}]`,
    `rows[${getDimensionFields(true).join(',')}]`,
    `filters[${getDimensionFields(true).join(',')}]`,
];

const getReportFields = () => [
    `${getIdNameFields(true).join(',')}`,
    `${getAxesFields().join(',')}`,
];

const getReportsFields = () => [
    `reportTable[${getReportFields().join(',')}]`,
    `chart[${getReportFields().join(',')}]`,
    `map[${getReportFields().join(',')}]`,
    `eventReport[${getReportFields().join(',')}]`,
    `eventChart[${getReportFields().join(',')}]`,
];

const getDashboardItemsFields = withDep =>
    arrayClean([
        'id',
        'type',
        'shape',
        withDep ? `${getReportsFields().join(',')}` : ``,
    ]);

const getDashboardFields = withDep =>
    arrayClean([
        `${getIdNameFields(true).join(',')}`,
        'description',
        `user[${getIdNameFields(false).join(',')}]`,
        'created',
        'lastUpdated',
        withDep
            ? `dashboardItems[${getDashboardItemsFields(true).join(',')}]`
            : ``,
    ]);

// const fields = {
//     dashboard: [
//         'id',
//         'displayName~rename(name)',
//         'description',
//         'user[id,name]',
//         'created',
//         'lastUpdated',
//         'dashboardItems',
//     ],
//     dashboardItems: [
//         'dashboardItems[',
//
//         ']',
//     ],
// };

const onError = error => console.log('Error: ', error);

export const apiFetchDashboards = () =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.list({
                fields: [getDashboardFields().join(','), 'dashboardItems'].join(
                    ','
                ),
            })
        )
        .catch(onError);

export const apiFetchSelected = id =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.get(id, {
                fields: arrayClean(getDashboardFields(true)).join(','),
            })
        )
        .catch(onError);
