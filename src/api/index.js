import data from '../data';

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboards = () => data.map(d => ({id: d.id, name: d.name, numberOfItems: d.dashboardItems.length}));

export const getDashboardItems = id => data.filter(d => d.id === id).map(d => d.dashboardItems)[0];

export const apiFetchDashboards = () => {
    return Promise.resolve(getDashboards());

    // return new Promise((resolve, reject) => {
    //     resolve(getDashboards());
    // });
};
