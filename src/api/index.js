import data from '../data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboards = id => delay().then(() => id ? data.find(d => d.id === id) : data);