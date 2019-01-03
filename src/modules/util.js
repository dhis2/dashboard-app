import isObject from 'lodash/isObject';

// validation
export function orNull(param) {
    return param === undefined ? null : param;
}

export function orArray(param) {
    return Array.isArray(param) ? param : [];
}

export function orObject(param) {
    return isObject(param) ? param : {};
}

// array
export function arrayGetById(array, id) {
    return array.find(item => item.id === id);
}

// object
export function arrayToIdMap(array) {
    return array.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});
}

// date
export function getDate() {
    const y = Math.floor(Math.random() * 3) + 2015;
    const M = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    // const h = Math.floor(Math.random() * 23) + 1;
    // const m = Math.floor(Math.random() * 59) + 1;
    // const s = Math.floor(Math.random() * 59) + 1;

    return new Date(`${y}-${M}-${d}`)
        .toJSON()
        .replace('T', ' ')
        .substr(0, 10);
}

export const formatDate = (value, uiLocale) => {
    if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
        const locale = uiLocale || 'en';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(value));
    }

    return value.substr(0, 19).replace('T', ' ');
};

/**
 * Sorts an array of objects based on provided date property
 *
 * @param {Array} items Array of objects
 * @param {String} dateProp Name of the date property to be used for sorting
 * @param {Boolean} ascending Whether to sort ascending or descending
 */
export const sortByDate = (items, dateProp, ascending = true) => {
    const values = Object.values(items);

    values.sort((a, b) => {
        const aDate = new Date(a[dateProp]);
        const bDate = new Date(b[dateProp]);

        return ascending ? aDate - bDate : bDate - aDate;
    });

    return values;
};

// reducer validator
export const validateReducer = (value, defaultValue) =>
    value === undefined || value === null ? defaultValue : value;

export const getBaseUrl = d2 => {
    const api = d2.Api.getApi();
    const idx = api.baseUrl.indexOf('/api');
    return idx > -1 ? api.baseUrl.slice(0, idx) : api.baseUrl;
};
