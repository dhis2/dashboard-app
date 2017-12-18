const isNonNegativeInteger = x => Number.isInteger(x) && x >= 0;

// Does the item have all the shape properties?
export const hasShape = item =>
    isNonNegativeInteger(item.x) &&
    isNonNegativeInteger(item.y) &&
    isNonNegativeInteger(item.w) &&
    isNonNegativeInteger(item.h);

// Dimensions for the react-grid-layout
export const gridColumns = 30;
export const gridRowHeight = 30;

// returns a rectangular grid block dimensioned with x, y, w, h in grid units.
// based on a grid with 3 items across
export const getShape = i => {
    if (!isNonNegativeInteger(i)) {
        throw new Error('Invalid grid block number');
    }

    const numberOfCols = 3;

    const col = i % numberOfCols;
    const row = Math.floor(i / numberOfCols);
    const itemWidth = Math.floor((gridColumns - 1) / numberOfCols);
    const itemHeight = gridRowHeight / 3;

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
export const addShapeToItems = items =>
    items.map(
        (item, index) =>
            hasShape(item) ? item : Object.assign({}, item, getShape(index))
    );
