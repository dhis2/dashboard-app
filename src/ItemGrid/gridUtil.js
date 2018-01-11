// Dimensions for the react-grid-layout

export const GRID_COMPACT_TYPE = 'vertical'; // vertical | horizonal | null
export const GRID_ROW_HEIGHT = 10;
const GRID_COLUMN_WIDTH_PX = 20;
const GRID_LAYOUT = 'FLEXIBLE'; // FIXED | FLEXIBLE

// Dimensions for getShape

const NUMBER_OF_ITEM_COLS = 2;
const GRID_COLUMNS = 60;

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

/**
 * Returns an array of items that each contain its grid block shape object
 * @function
 * @param {Array} items
 * @returns {Array}
 */

export const withShape = items =>
    items.map(
        (item, index) =>
            hasShape(item) ? item : Object.assign({}, item, getShape(index))
    );

export const getYMax = items =>
    items.reduce(
        (tot, item) => (item.y + item.h > tot ? item.y + item.h : tot),
        0
    );
