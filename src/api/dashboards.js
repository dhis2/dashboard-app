import { getInstance } from 'd2';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import { onError, getDashboardFields } from './index';

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
export const apiFetchDashboard = id =>
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

// Star dashboard
export const apiStarDashboard = (id, isStarred) => {
    const url = `dashboards/${id}/favorite`;

    getInstance().then(d2 => {
        if (isStarred) {
            d2.Api.getApi().post(url);
        } else {
            d2.Api.getApi().delete(url);
        }
    });
};

export const apiDeleteDashboard = id => {
    return getInstance()
        .then(d2 => {
            return d2.models.dashboards
                .get(id)
                .then(dashboard => dashboard.delete());
        })
        .catch(onError);
};
