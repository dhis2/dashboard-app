// Dimensions for the react-grid-layout
import sortBy from 'lodash/sortBy'
import { isVisualizationType } from '../../modules/itemTypes'

export const GRID_COMPACT_TYPE = 'vertical' // vertical | horizonal | null
export const GRID_ROW_HEIGHT = 10
const GRID_COLUMN_WIDTH_PX = 20
const GRID_LAYOUT = 'FLEXIBLE' // FIXED | FLEXIBLE
export const MARGIN = [10, 10]

const SM_SCREEN_MIN_ITEM_GRID_HEIGHT = 16 //310px
export const SM_SCREEN_GRID_COLUMNS = 2
export const MARGIN_SM = [0, 16]
export const SMALL_SCREEN_BREAKPOINT = 480
export const SCROLLBAR_WIDTH = 8
// sum of left+right padding of dashboard-wrapper (App.css)
export const DASHBOARD_WRAPPER_LR_MARGIN = 32

// Dimensions for getShape
export const NEW_ITEM_SHAPE = { x: 0, y: 0, w: 20, h: 29 }
const NUMBER_OF_ITEM_COLS = 2
const GRID_COLUMNS = 60

const MAX_ITEM_GRID_WIDTH = GRID_COLUMNS - 1

export const MAX_ITEM_GRID_HEIGHT = 34
export const MAX_ITEM_GRID_HEIGHT_OIPP = 35
export const MAX_ITEM_GRID_WIDTH_OIPP = 56

const MIN_ITEM_GRID_HEIGHT = 4

// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
// const a4LandscapeHeightPx = 794
export const A4_LANDSCAPE_WIDTH_PX = 1102

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
const getShape = i => {
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

/**
 * Returns an array of items containing the x, y, w, h dimensions
 * and the item's originalheight in pixels
 * and dimensions to create the small layout (x, y, w, h)
 * @function
 * @param {Array} items
 * @returns {Array}
 */

export const withShape = (items = []) => {
    const itemsWithShape = items.map((item, i) =>
        hasShape(item) ? item : Object.assign({}, item, getShape(i))
    )

    return itemsWithShape.map(item =>
        Object.assign({}, item, {
            originalH: item.h,
            smallOriginalH: getProportionalHeight(item),
        })
    )
}

export const getProportionalHeight = item => {
    if (!isVisualizationType(item) || item.h > SM_SCREEN_MIN_ITEM_GRID_HEIGHT) {
        return item.h
    }
    const ratioWH = item.w / item.h
    const h = Math.floor(SM_SCREEN_GRID_COLUMNS / ratioWH)

    return h < SM_SCREEN_MIN_ITEM_GRID_HEIGHT
        ? SM_SCREEN_MIN_ITEM_GRID_HEIGHT
        : h
}

export const getSmallLayout = items =>
    sortBy(items, ['y', 'x']).map((item, i) => ({
        id: item.id,
        i: item.i,
        x: 0,
        y: i,
        w: SM_SCREEN_GRID_COLUMNS,
        h: getProportionalHeight(item),
    }))

export const getGridItemProperties = itemId => {
    return {
        i: itemId,
        minH: MIN_ITEM_GRID_HEIGHT,
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
 * Calculates the grid item's height in pixels based
 * on the height in grid units. This calculation
 * is copied directly from react-grid-layout GridItem.js (calcPosition)
 *
 * Each row's px height is the sum of the GRID_ROW_HEIGHT + MARGIN-Y
 * So the calculation is:
 * GRID_ROW_HEIGHT* Number of rows
 * +
 * yMargin * Number of rows-1
 *
 * @param {Object} item item containing shape (x, y, w, h)
 */
export const getItemHeightPx = (item, isSmallScreen) => {
    const h = isSmallScreen ? item.smallOriginalH : item.originalH
    const yMargin = isSmallScreen ? MARGIN_SM[1] : MARGIN[1]
    return Math.round(GRID_ROW_HEIGHT * h + Math.max(0, h - 1) * yMargin)
}

export const getGridItemDomId = id => `item-${id}`
