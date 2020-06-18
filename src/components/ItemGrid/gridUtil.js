import isFunction from 'd2-utilizr/lib/isFunction';

import { orObject } from '../../modules/util';

// Dimensions for the react-grid-layout

export const GRID_COMPACT_TYPE = 'vertical'; // vertical | horizonal | null
export const GRID_ROW_HEIGHT = 10;
const GRID_COLUMN_WIDTH_PX = 20;
const GRID_LAYOUT = 'FLEXIBLE'; // FIXED | FLEXIBLE
export const MARGIN = [10, 10];

// Dimensions for getShape

const NUMBER_OF_ITEM_COLS = 2;
const GRID_COLUMNS = 60;

export const NEW_ITEM_SHAPE = { x: 0, y: 0, w: 20, h: 29 };
export const NEW_PAGEBREAK_ITEM_SHAPE = {
    x: 0,
    y: 0,
    w: GRID_COLUMNS - 1,
    h: 5,
};

export const getPageBreakItemShape = yPos => {
    return {
        x: 0,
        y: yPos,
        w: GRID_COLUMNS - 1,
        h: 5,
    };
};

export const getGridColumns = () => {
    switch (GRID_LAYOUT) {
        case 'FLEXIBLE':
            return GRID_COLUMNS;
        case 'FIXED':
            return Math.floor((window.innerWidth - 20) / GRID_COLUMN_WIDTH_PX);
        default:
            return GRID_COLUMNS;
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

    const col = i % NUMBER_OF_ITEM_COLS;
    const row = Math.floor(i / NUMBER_OF_ITEM_COLS);
    const itemWidth = Math.floor((GRID_COLUMNS - 1) / NUMBER_OF_ITEM_COLS);
    const itemHeight = GRID_ROW_HEIGHT * 2;

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    };
};

export const getGridItemProperties = itemId => {
    return {
        i: itemId,
        minH: 4, // minimum height for item
    };
};

/**
 * Calculates the grid item's original height in pixels based
 * on the height in grid units. This calculation
 * is copied directly from react-grid-layout GridItem.js (calcPosition)
 *
 * @param {Object} item item containing shape (x, y, w, h)
 */
export const getOriginalHeight = item => {
    const originalHeight = Math.round(
        GRID_ROW_HEIGHT * item.h + Math.max(0, item.h - 1) * MARGIN[1]
    );

    // console.log('originalHeight', originalHeight, item.h);
    // console.log(
    //     GRID_ROW_HEIGHT,
    //     ' * ',
    //     item.h,
    //     ' + ',
    //     Math.max(0, item.h - 1),
    //     ' * ',
    //     MARGIN[1]
    // );

    return { originalHeight };
};

export const getGridYFromPixels = yPixels => {
    // const newH = NEW_PAGEBREAK_ITEM_SHAPE.h;
    // const factor = GRID_ROW_HEIGHT * 4;
    // return Math.round(yPos / factor);
    // const numerator = yPixels / GRID_ROW_HEIGHT;
    // const denominator = 4;
    // const result = Math.ceil(numerator / denominator);
    const y = Math.round((yPixels - MARGIN[1]) / (GRID_ROW_HEIGHT + MARGIN[1]));
    console.log('y', y);
    return y;
};

/**
 * Returns an array of items containing the x, y, w, h dimensions
 * and the item's originalheight in pixels
 * @function
 * @param {Array} items
 * @returns {Array}
 */

export const withShape = items =>
    items.map((item, index) => {
        const itemWithShape = hasShape(item)
            ? item
            : Object.assign({}, item, getShape(index));

        return Object.assign(
            {},
            itemWithShape,
            getOriginalHeight(itemWithShape)
        );
    });

export const getGridItemDomId = id => `item-${id}`;

export function onItemResize(id) {
    const el = orObject(document.querySelector(`#${getGridItemDomId(id)}`));
    if (isFunction(el.setViewportSize))
        setTimeout(
            () => el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
            10
        );
}
