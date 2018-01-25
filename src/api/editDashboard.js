import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

export const updateDashboard = data => {
    const { id, name, description, dashboardItems } = data;

    const items = dashboardItems.map(item =>
        Object.assign({}, item, { width: item.w, height: item.h })
    );

    return getInstance()
        .then(d2 => {
            return d2.models.dashboards.get(id).then(dashboard => {
                dashboard.name = name;
                dashboard.description = description;
                dashboard.dashboardItems = items;

                return dashboard.save();
            });
        })
        .catch(onError);
};
