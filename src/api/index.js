import isNumber from 'd2-utilizr/lib/isNumber';

import { getInstance } from 'd2/lib/d2';

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const apiFetchDashboards = () => getInstance().then(d2 => d2.models.dashboard.list());
