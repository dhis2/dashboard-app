import isFunction from 'd2-utilizr/lib/isFunction';
import { orObject } from '../util';

// Dimensions for the react-grid-layout

export const gridCompactType = 'vertical'; // vertical | horizonal | null
export const gridRowHeight = 10;
const columnWidthPx = 20;
const gridLayout = 'FLEXIBLE'; // FIXED | FLEXIBLE

// Dimensions for getShape

const numberOfItemCols = 2;
const gridColumns = 60;

export const getGridColumns = () => {
    switch (gridLayout) {
        case 'FLEXIBLE':
            return gridColumns;
        case 'FIXED':
            return Math.floor((window.innerWidth - 20) / columnWidthPx);
        default:
            return gridColumns;
    }
};

// isNonNegativeInteger

const isNonNegativeInteger = x => Number.isInteger(x) && x >= 0;

// Does the item have all the shape properties?

export const hasShape = item =>
    isNonNegativeInteger(item.x) &&
    isNonNegativeInteger(item.y) &&
    isNonNegativeInteger(item.w) &&
    isNonNegativeInteger(item.h);

// returns a rectangular grid block dimensioned with x, y, w, h in grid units.
// based on a grid with 3 items across
export const getShape = i => {
    if (!isNonNegativeInteger(i)) {
        throw new Error('Invalid grid block number');
    }

    const col = i % numberOfItemCols;
    const row = Math.floor(i / numberOfItemCols);
    const itemWidth = Math.floor((gridColumns - 1) / numberOfItemCols);
    const itemHeight = gridRowHeight * 2;

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    };
};

/**
 * Returns an array of items that each contain its grid block shape object
 * @function
 * @param {Array} items
 * @returns {Array}
 */

export const getShapedItems = items =>
    items.map(
        (item, index) =>
            hasShape(item) ? item : Object.assign({}, item, getShape(index))
    );

export const getYMax = items =>
    items.reduce(
        (tot, item) => (item.y + item.h > tot ? item.y + item.h : tot),
        0
    );

export const getGridItemDomId = id => `item-${id}`;

export function onItemResize(id) {
    const el = orObject(document.querySelector(`#${getGridItemDomId(id)}`));
    if (isFunction(el.setViewportSize))
        setTimeout(
            () => el.setViewportSize(el.clientWidth - 5, el.clientHeight),
            100
        );
}
