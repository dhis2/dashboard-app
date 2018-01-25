import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

const addDimension = dashboardItems => {
    return dashboardItems.map(item =>
        Object.assign({}, item, { width: item.w, height: item.h })
    );
};

export const updateDashboard = data => {
    const { id, name, description, dashboardItems } = data;

    const items = addDimension(dashboardItems);

    return getInstance()
        .then(d2 => {
            return d2.models.dashboards.get(id).then(dashboard => {
                dashboard.name = name;
                dashboard.description = description;
                dashboard.dashboardItems = items;

                return dashboard.save().then(msg => msg.response.uid);
            });
        })
        .catch(onError);
};

export const postDashboard = data => {
    return getInstance().then(d2 => {
        const { name, description, dashboardItems } = data;
        const newDashboard = d2.models.dashboards.create();

        newDashboard.name = name;
        newDashboard.description = description;
        newDashboard.dashboardItems = addDimension(dashboardItems);

        return newDashboard.save().then(msg => msg.response.uid);
    });
};
