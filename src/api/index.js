import { getInstance } from 'd2/lib/d2';

export const delay = (ms = 500) =>
    new Promise(resolve => setTimeout(resolve, ms));

const fields = {
    dashboard:
        'id,displayName~rename(name),description,user[id,name],created,lastUpdated,dashboardItems~size',
    selected:
        'id,dashboardItems[id,type,shape,reportTable[id,displayName],chart[id,displayName],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]',
};

export const apiFetchDashboards = () =>
    getInstance()
        .then(d2 => d2.models.dashboard.list({ fields: fields.dashboard }))
        .catch(error => console.log('error', error));

export const apiFetchSelected = id =>
    getInstance()
        .then(d2 => d2.models.dashboard.get(id, { fields: fields.selected }))
        .catch(error => console.log('error', error));
