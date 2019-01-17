import { getInstance } from 'd2';

const onError = error => console.log('Error: ', error);

const saveDashboard = (dashboard, data) => {
    const { name, description, dashboardItems } = data;

    dashboard.name = name;
    dashboard.description = description;
    dashboard.dashboardItems = dashboardItems.map(item =>
        Object.assign({}, item, { width: item.w, height: item.h })
    );

    return dashboard.save().then(msg => msg.response.uid);
};

export const updateDashboard = data => {
    return getInstance()
        .then(d2 => {
            return d2.models.dashboards
                .get(data.id)
                .then(dashboard => saveDashboard(dashboard, data));
        })
        .catch(onError);
};

export const postDashboard = data => {
    return getInstance().then(d2 => {
        const dashboard = d2.models.dashboards.create();

        return saveDashboard(dashboard, data);
    });
};
