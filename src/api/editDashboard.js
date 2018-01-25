import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

export const updateDashboard = data => {
    const { id, name, description, dashboardItems } = data;
    const url = `/dashboards/${id}`;

    const newItems = dashboardItems.map(item =>
        Object.assign({}, item, { width: item.w, height: item.h })
    );

    const payload = {
        name,
        description,
        dashboardItems: newItems,
    };

    return getInstance()
        .then(d2 => d2.Api.getApi().update(url, payload))
        .catch(onError);
};
