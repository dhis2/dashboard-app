import isFunction from 'd2-utilizr/lib/isFunction'

import { orObject } from '../../modules/util'
import { VIEW } from '../Dashboard/dashboardModes'

// Dimensions for the react-grid-layout
export const GRID_COMPACT_TYPE = 'vertical' // vertical | horizonal | null
export const GRID_ROW_HEIGHT = 10
const GRID_COLUMN_WIDTH_PX = 20
const GRID_LAYOUT = 'FLEXIBLE' // FIXED | FLEXIBLE
export const MARGIN = [10, 10]

export const NEW_ITEM_SHAPE = { x: 0, y: 0, w: 20, h: 29 }

// Dimensions for getShape

const NUMBER_OF_ITEM_COLS = 2
const GRID_COLUMNS = 60
const MAX_ITEM_GRID_WIDTH = GRID_COLUMNS - 1

export const MAX_ITEM_GRID_HEIGHT = 34
export const MAX_ITEM_GRID_HEIGHT_OIPP = 35
export const MAX_ITEM_GRID_WIDTH_OIPP = 56

// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
// const a4LandscapeHeightPx = 794
export const a4LandscapeWidthPx = 1102

export const getGridColumns = () => {
    switch (GRID_LAYOUT) {
        case 'FLEXIBLE':
            return GRID_COLUMNS
        case 'FIXED':
            return Math.floor((window.innerWidth - 20) / GRID_COLUMN_WIDTH_PX)
        default:
            return GRID_COLUMNS
    }
}

// isNonNegativeInteger

const isNonNegativeInteger = x => Number.isInteger(x) && x >= 0

// Does the item have all the shape properties?

export const hasShape = item =>
    isNonNegativeInteger(item.x) &&
    isNonNegativeInteger(item.y) &&
    isNonNegativeInteger(item.w) &&
    isNonNegativeInteger(item.h)

// returns a rectangular grid block dimensioned with x, y, w, h in grid units.
// based on a grid with 3 items across
export const getShape = i => {
    if (!isNonNegativeInteger(i)) {
        throw new Error('Invalid grid block number')
    }

    const col = i % NUMBER_OF_ITEM_COLS
    const row = Math.floor(i / NUMBER_OF_ITEM_COLS)
    const itemWidth = Math.floor(MAX_ITEM_GRID_WIDTH / NUMBER_OF_ITEM_COLS)
    const itemHeight = GRID_ROW_HEIGHT * 2

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    }
}

// returns a rectangular grid block based on a grid with 3 items (Responsive Grid Layout)
export const getResponsiveShape = i => {
    if (!isNonNegativeInteger(i)) {
        throw new Error('Invalid grid block number')
    }

    const itemWidth = 4
    const itemHeight = GRID_ROW_HEIGHT * 2
    const col = (i * itemWidth) % 12
    const row = Math.floor(i / 4)

    return {
        x: col,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    }
}

export const getGridItemProperties = itemId => {
    return {
        i: itemId,
        minH: 4, // minimum height for item
    }
}

export const getPageBreakItemShape = (yPos, isStatic = true) => {
    return {
        x: 0,
        y: yPos,
        w: MAX_ITEM_GRID_WIDTH,
        h: 5,
        static: !!isStatic,
        minH: 1,
    }
}

export const getPrintTitlePageItemShape = isOneItemPerPage => {
    return {
        x: 0,
        y: 0,
        w: isOneItemPerPage ? MAX_ITEM_GRID_WIDTH_OIPP : MAX_ITEM_GRID_WIDTH,
        h: MAX_ITEM_GRID_HEIGHT,
        static: true,
        minH: 1,
    }
}

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
    )

    return { originalHeight }
}

/**
 * Returns an array of items containing the x, y, w, h dimensions
 * and the item's originalheight in pixels
 * @function
 * @param {Array} items
 * @param {string} mode
 * @returns {Array}
 */

export const withShape = (items, mode) =>
    items.map((item, index) => {
        /* const itemWithShape = hasShape(item)
            ? item
            : Object.assign({}, item, getShape(index))*/
        // when VIEW mode prepare a shape based on responsive grid layout
        const getShapeByMode = mode === VIEW
            ? getResponsiveShape(index) : getShape(index)
        const itemWithShape = hasShape(item)
            ? item
            : Object.assign({}, item, getShapeByMode)

        return Object.assign(
            {},
            itemWithShape,
            getOriginalHeight(itemWithShape)
        )
    })

export const getGridItemDomId = id => `item-${id}`

export function onItemResize(id) {
    const el = orObject(document.querySelector(`#${getGridItemDomId(id)}`))
    if (isFunction(el.setViewportSize))
        setTimeout(
            () => el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
            10
        )
}
