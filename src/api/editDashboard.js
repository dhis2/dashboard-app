import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

export const updateDashboard = data => {
    const { id, name, description, dashboardItems } = data;
    const url = `/dashboards/${id}`;

    const payload = {
        name,
        description,
        dashboardItems,
    };

    return getInstance()
        .then(d2 => d2.Api.getApi().update(url, payload))
        .catch(onError);
};

// export const updateDashboard = data => {
//     const { id, name, description, dashboardItems } = data;

//     return getInstance()
//         .then(d2 => {
//             return d2.models.dashboards.get(id).then(dashboard => {
//                 dashboard.name = name;
//                 dashboard.description = description;
//                 dashboard.dashboardItems = dashboardItems;

//                 return dashboard.save();
//             });
//         })
//         .catch(onError);
// };
