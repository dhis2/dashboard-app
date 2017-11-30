import { getInstance } from 'd2/lib/d2';

export const delay = (ms = 500) =>
    new Promise(resolve => setTimeout(resolve, ms));

const fields = {
    dashboard: [
        'id',
        'displayName~rename(name)',
        'description',
        'user[id,name]',
        'created',
        'lastUpdated',
        'dashboardItems',
    ],
    dashboardItems: [
        'dashboardItems[',
        'id',
        'type',
        'shape',
        'reportTable[id,displayName~rename(name)]',
        'chart[*]',
        'map[id,displayName~rename(name)]',
        'eventReport[id,displayName~rename(name)]',
        'eventChart[id,displayName~rename(name)]',
        ']',
    ],
};

const onError = error => console.log('error', error);

export const apiFetchDashboards = () =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.list({ fields: fields.dashboard.join(',') })
        )
        .catch(onError);

export const apiFetchSelected = id =>
    getInstance()
        .then(d2 =>
            d2.models.dashboard.get(id, {
                fields: []
                    .concat(fields.dashboard, fields.dashboardItems)
                    .join(','),
            })
        )
        .catch(onError);
