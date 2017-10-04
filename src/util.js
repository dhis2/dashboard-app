import isNumber from 'd2-utilizr/lib/isNumber';

// array
export function arrayGetById(array, id) {
    return array.find(item => item.id === id);
}

// date
export function getDate() {
    const y = Math.floor(Math.random() * 3) + 2015;
    const M = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    // const h = Math.floor(Math.random() * 23) + 1;
    // const m = Math.floor(Math.random() * 59) + 1;
    // const s = Math.floor(Math.random() * 59) + 1;

    return (new Date(`${y}-${M}-${d}`)).toJSON().replace('T', ' ').substr(0, 10);
}

// reducer validator
export const validateReducer = (value, defaultValue) => (value === undefined || value === null ? defaultValue : value);

// shape
export const hasShape = item => isNumber(item.x) && isNumber(item.y) && isNumber(item.w) && isNumber(item.h);

export const getShape = (i) => {
    const numberOfCols = 3;
    const itemWidth = 9;
    const itemHeight = 10;

    const col = i % numberOfCols;
    const row = Math.floor(i / numberOfCols);

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    };
};
