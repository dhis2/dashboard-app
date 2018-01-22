import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

export const updateDashboard = data => {
    const { id, name, description } = data;
    const url = `/dashboards/${id}`;

    const payload = {
        name,
        description,
    };

    // d2.models.dashboards(dashboardId).update
    return getInstance()
        .then(d2 => d2.Api.getApi().update(url, payload))
        .catch(onError);
};
