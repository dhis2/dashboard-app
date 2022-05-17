import isObject from 'lodash/isObject.js'

export function orArray(param) {
    return Array.isArray(param) ? param : []
}

export function orObject(param) {
    return isObject(param) ? param : {}
}

// object
export function arrayToIdMap(array) {
    return array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
    }, {})
}

// reducer validator
export const validateReducer = (value, defaultValue) =>
    value === undefined || value === null ? defaultValue : value
