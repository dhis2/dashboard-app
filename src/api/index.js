import isNumber from 'd2-utilizr/lib/isNumber';

import { getInstance } from 'd2/lib/d2';

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const dashboardFields = 'id,displayName~rename(name),description,user[id,name],created,lastUpdated,dashboardItems~size';

export const apiFetchDashboards = () => getInstance().then(d2 => d2.models.dashboard.list({ fields: dashboardFields }));
