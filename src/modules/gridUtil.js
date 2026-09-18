// Dimensions for the react-grid-layout
import sortBy from 'lodash/sortBy.js'
import {
    acSetHideGrid,
    acUpdateDashboardItemShapes,
} from '../actions/editDashboard.js'
import { generateUid } from '../modules/uid.js'
import {
    isVisualizationType,
    itemTypeMap,
    PAGEBREAK,
    PRINT_TITLE_PAGE,
} from './itemTypes.js'
import { isSmallScreen } from './smallScreen.js'

export const GRID_COMPACT_TYPE = 'vertical' // vertical | horizonal | null
export const GRID_ROW_HEIGHT_PX = 16
export const MARGIN_PX = [4, 4]

const SM_SCREEN_MIN_ITEM_GRID_HEIGHT = 13 // minimum of ~320px
export const SM_SCREEN_GRID_COLUMNS = 1
export const MARGIN_SM_PX = [4, 4]
export const GRID_PADDING_PX = [0, 0]
// make an assumption about the original item w/h ratio
// assumes grid width of ~1200px at time dashboard was created
const GRID_COL_WIDTH_PX = 16
export const GRID_COLUMNS = 60

// Editor-only grid column resolution presets. The first value (GRID_COLUMNS)
// is the canonical "pixel perfect" resolution used for storage, view and print.
export const GRID_COLUMN_PRESETS = [GRID_COLUMNS, 12, 4]
// Default editor display resolution. A coarse, legible grid (clarity-first);
// 60 ("pixel perfect") stays available as a preset. Storage is always 60-space,
// so this default is non-destructive.
export const DEFAULT_GRID_COLUMNS = 12
export const MIN_GRID_COLUMNS = 1
export const MAX_GRID_COLUMNS = GRID_COLUMNS

// Dimensions for getShape
export const NEW_ITEM_SHAPE = { x: 0, y: 0, w: 20, h: 29 }
// Default width (in canonical 60-unit storage space) for a newly added item in
// freeflow layout. 30 = half width at any display resolution. Per-dashboard,
// user-overridable via itemConfig.newItemWidth.
export const DEFAULT_NEW_ITEM_WIDTH = 30
const NUMBER_OF_ITEM_COLS = 2

const MAX_ITEM_GRID_WIDTH = GRID_COLUMNS - 1

export const MAX_ITEM_GRID_HEIGHT = 34
export const MAX_ITEM_GRID_HEIGHT_OIPP = 35
export const MAX_ITEM_GRID_WIDTH_OIPP = 56

const MIN_ITEM_GRID_HEIGHT = 4

// isNonNegativeInteger

const isNonNegativeInteger = (x) => Number.isInteger(x) && x >= 0

// Does the item have all the shape properties?

export const hasShape = (item) =>
    isNonNegativeInteger(item.x) &&
    isNonNegativeInteger(item.y) &&
    isNonNegativeInteger(item.w) &&
    isNonNegativeInteger(item.h)

// Editor-only column resolution conversion.
// Items are always stored in the canonical GRID_COLUMNS (60) coordinate space.
// When the editor renders at a different column count, x/w are scaled to/from
// that space. y/h are row units and are independent of the column count.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// Convert a stored (60-unit) item shape to the given display column space
export const toDisplayShape = (item, columns) => {
    if (columns === GRID_COLUMNS) {
        return item
    }
    const w = clamp(Math.round((item.w * columns) / GRID_COLUMNS), 1, columns)
    const x = clamp(
        Math.round((item.x * columns) / GRID_COLUMNS),
        0,
        columns - w
    )
    return { ...item, x, w }
}

// Convert a display (N-column) item shape back to the stored 60-unit space
export const toStorageShape = (item, columns) => {
    if (columns === GRID_COLUMNS) {
        return item
    }
    const w = clamp(
        Math.round((item.w * GRID_COLUMNS) / columns),
        1,
        GRID_COLUMNS
    )
    const x = clamp(
        Math.round((item.x * GRID_COLUMNS) / columns),
        0,
        GRID_COLUMNS - w
    )
    return { ...item, x, w }
}

// Snap stored item shapes to the given column count (round-trip through display
// space). Used when switching the editor column resolution.
export const rescaleItemsToColumns = (items, columns) =>
    items.map((item) => ({
        ...item,
        ...toStorageShape(toDisplayShape(item, columns), columns),
    }))

// Multi-select height helpers.
// Items can be either react-grid-layout items (keyed by `i`) or stored
// dashboard items (keyed by `id`), so match on whichever is present.
const getItemKey = (item) => item.i ?? item.id

// Returns the shared height of the selected items, or null when the selection
// is empty or the heights differ.
export const getSelectedHeight = (items, ids) => {
    const selected = items.filter((item) => ids.includes(getItemKey(item)))
    if (!selected.length) {
        return null
    }
    const { h } = selected[0]
    return selected.every((item) => item.h === h) ? h : null
}

// Returns the tallest height among the selected items, or null when none match.
export const getMaxSelectedHeight = (items, ids) => {
    const selected = items.filter((item) => ids.includes(getItemKey(item)))
    if (!selected.length) {
        return null
    }
    return selected.reduce((max, item) => Math.max(max, item.h), 0)
}

// Returns a new items array with the given height applied to the selected ids.
export const applyHeightToItems = (items, ids, h) =>
    items.map((item) =>
        ids.includes(getItemKey(item)) ? { ...item, h } : item
    )

// Apply height to every item that shares a row with any of the given ids,
// and shift items below those rows.
export const applyHeightToRowsOf = (items, ids, h) => {
    const selected = items.filter((item) => ids.includes(getItemKey(item)))
    if (!selected.length) {
        return items
    }

    const rowYs = [...new Set(selected.map((item) => item.y))]
    const rowOldH = {}
    rowYs.forEach((y) => {
        const rowItem = items.find((item) => item.y === y)
        rowOldH[y] = rowItem?.h ?? h
    })

    return items.map((item) => {
        let y = item.y
        rowYs.forEach((rowY) => {
            if (item.y > rowY) {
                y += h - rowOldH[rowY]
            }
        })
        if (rowYs.includes(item.y)) {
            return { ...item, h, y }
        }
        if (y !== item.y) {
            return { ...item, y }
        }
        return item
    })
}

// returns a rectangular grid block dimensioned with x, y, w, h in grid units.
// based on a grid with 3 items across
const getShape = (i) => {
    const col = i % NUMBER_OF_ITEM_COLS
    const row = Math.floor(i / NUMBER_OF_ITEM_COLS)
    const itemWidth = Math.floor(MAX_ITEM_GRID_WIDTH / NUMBER_OF_ITEM_COLS)
    const itemHeight = GRID_ROW_HEIGHT_PX * 2

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

    return itemsWithShape.map((item) =>
        Object.assign({}, item, { originalH: item.h })
    )
}

const getGridUnitsForSmFromPx = (hPx) => {
    const gridUnitHeightPx = GRID_ROW_HEIGHT_PX + MARGIN_SM_PX[1]
    return Math.round((hPx + MARGIN_SM_PX[1]) / gridUnitHeightPx)
}

export const getProportionalHeight = (item, gridWidthPx) => {
    // get w/h ratio of the original item
    const wPx = getItemWHPx(item.w, GRID_COL_WIDTH_PX, MARGIN_PX[0])
    const hPx = getItemWHPx(item.h, GRID_ROW_HEIGHT_PX, MARGIN_PX[1])
    const ratioWH = wPx / hPx

    if (!isVisualizationType(item)) {
        return getGridUnitsForSmFromPx(hPx)
    }

    // get new height in px based on the ratio
    const newColWidthPx =
        (gridWidthPx -
            MARGIN_SM_PX[0] * (SM_SCREEN_GRID_COLUMNS - 1) -
            GRID_PADDING_PX[0] * 2) /
        SM_SCREEN_GRID_COLUMNS
    const newWPx = newColWidthPx * SM_SCREEN_GRID_COLUMNS
    const newHPx = Math.round(newWPx / ratioWH)

    //convert height in px back to grid units
    const h = getGridUnitsForSmFromPx(newHPx)

    // item must be at least the set minimum
    return h < SM_SCREEN_MIN_ITEM_GRID_HEIGHT
        ? SM_SCREEN_MIN_ITEM_GRID_HEIGHT
        : h
}

const EXPANDED_HEIGHT = 19
const EXPANDED_HEIGHT_SM = 15

export const getItemsWithAdjustedHeight = ({ items, expandedItems, width }) =>
    items.map((item) => {
        const expandedItem = expandedItems[item.id]

        if (expandedItem && expandedItem === true) {
            const expandedHeight = isSmallScreen(width)
                ? EXPANDED_HEIGHT_SM
                : EXPANDED_HEIGHT
            return {
                ...item,
                h: item.h + expandedHeight,
                smallOriginalH: getProportionalHeight(item, width),
            }
        }

        return item
    })

export const getSmallLayout = (items, windowWidthPx) =>
    sortBy(items, ['y', 'x']).map((item, i) =>
        Object.assign({}, item, {
            x: 0,
            y: i,
            w: SM_SCREEN_GRID_COLUMNS,
            h: getProportionalHeight(item, windowWidthPx),
        })
    )

export const getGridItemProperties = (itemId) => {
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

export const getPrintTitlePageItemShape = (isOneItemPerPage) => {
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
 * is copied directly from react-grid-layout
 * calculateUtils.js (calcGridItemWHPx)
 *
 * Each row's px height is the sum of the GRID_ROW_HEIGHT_PX + MARGIN-Y
 * So the calculation is:
 * GRID_ROW_HEIGHT_PX * Number of rows
 * +
 * yMargin * Number of rows-1
 *
 * @param {Object} item item containing shape (x, y, w, h)
 */
export const getItemHeightPx = (item, windowWidthPx) => {
    if (isSmallScreen(windowWidthPx)) {
        const h = item.smallOriginalH
            ? item.smallOriginalH
            : getProportionalHeight(item, windowWidthPx)
        return getItemWHPx(h, GRID_ROW_HEIGHT_PX, MARGIN_SM_PX[1])
    }

    return getItemWHPx(item.originalH, GRID_ROW_HEIGHT_PX, MARGIN_PX[1])
}

const getItemWHPx = (gridUnits, colOrRowSize, marginPx) =>
    Math.round(colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx)

// Auto layout

const getNumberOfColUnits = (columns, maxColUnits = GRID_COLUMNS) => {
    if (columns.length < 1 || columns.length > maxColUnits) {
        return null
    }

    return Math.floor(maxColUnits / columns.length)
}

const sortItems = (items) =>
    items
        .slice()
        .sort((a, b) => a.y - b.y || a.x - b.x || a.h - b.h || a.w - b.w)

export const getAutoItemShapes = (dashboardItems, columns, maxColUnits) => {
    const numberOfColUnits = getNumberOfColUnits(columns, maxColUnits)

    if (!numberOfColUnits || !dashboardItems.length) {
        return null
    }

    const colCount = columns.length
    const items = sortItems(dashboardItems)
    const itemsWithNewShape = []
    const defaultH = NEW_ITEM_SHAPE.h

    let colIdx = 0
    let y = 0
    let rowStart = 0
    let rowH = 0

    const closeRow = (endIdx) => {
        for (let j = rowStart; j < endIdx; j++) {
            itemsWithNewShape[j].h = rowH
        }
        y += rowH
        rowStart = endIdx
        colIdx = 0
        rowH = 0
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const h = item.h > 0 ? item.h : defaultH
        itemsWithNewShape.push({
            ...item,
            w: numberOfColUnits,
            h,
            x: numberOfColUnits * colIdx,
            y,
        })
        rowH = Math.max(rowH, h)
        colIdx += 1
        if (colIdx === colCount) {
            closeRow(itemsWithNewShape.length)
        }
    }
    if (colIdx > 0) {
        closeRow(itemsWithNewShape.length)
    }

    return itemsWithNewShape
}

// LTR placement helpers (storage space = GRID_COLUMNS units)

// Next position when appending to the bottom row; wraps to a new row when full.
const getEndFlowPosition = (items, w) => {
    if (!items.length) {
        return { x: 0, y: 0 }
    }
    const rowY = items.reduce((max, it) => Math.max(max, it.y), 0)
    const rowRight = items
        .filter((it) => it.y === rowY)
        .reduce((max, it) => Math.max(max, it.x + it.w), 0)

    if (rowRight + w <= GRID_COLUMNS) {
        return { x: rowRight, y: rowY }
    }

    const bottom = items.reduce((max, it) => Math.max(max, it.y + it.h), 0)
    return { x: 0, y: bottom }
}

// Flow items left-to-right, top-to-bottom in storage space, wrapping to a new
// row when the current one overflows. The result is already vertically compact,
// so react-grid-layout's compaction leaves it untouched.
const flowItemsLTR = (items) => {
    let x = 0
    let y = 0
    let rowH = 0
    return items.map((item) => {
        if (x + item.w > GRID_COLUMNS) {
            x = 0
            y += rowH
            rowH = 0
        }
        const placed = { ...item, x, y }
        x += item.w
        rowH = Math.max(rowH, item.h)
        return placed
    })
}

export const addToItemsStart = (dashboardItems, columns, newDashboardItem) => {
    if (columns.length) {
        return getAutoItemShapes(
            [
                ...dashboardItems,
                {
                    ...newDashboardItem,
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                },
            ],
            columns
        )
    }

    if (!dashboardItems.length) {
        return [{ ...NEW_ITEM_SHAPE, ...newDashboardItem, x: 0, y: 0 }]
    }

    // Freeflow: the new item leads and existing items flow after it in reading
    // order. We re-flow rather than insert at (0,0) and shift everything down:
    // with a narrow new item, vertical compaction would otherwise pull the other
    // items up beside it and leave each successive add stacked at column 0.
    return flowItemsLTR([
        { ...NEW_ITEM_SHAPE, ...newDashboardItem },
        ...sortItems(dashboardItems),
    ])
}

export const addToItemsEnd = (dashboardItems, columns, newDashboardItem) => {
    if (columns.length) {
        const items = [
            ...dashboardItems,
            {
                ...NEW_ITEM_SHAPE,
                ...newDashboardItem,
                y: dashboardItems.reduce(
                    (mx, item) => Math.max(mx, item.y + item.h),
                    0
                ),
            },
        ]
        return getAutoItemShapes(items, columns)
    }

    const pos = getEndFlowPosition(dashboardItems, newDashboardItem.w)
    return [
        ...dashboardItems,
        { ...NEW_ITEM_SHAPE, ...newDashboardItem, ...pos },
    ]
}

export const updateItems = (items, dispatch, options = {}) => {
    const { reload } = options

    if (reload) {
        dispatch(acSetHideGrid(true))
        dispatch(acUpdateDashboardItemShapes(items))
        setTimeout(() => dispatch(acSetHideGrid(false)), 0)
    } else {
        dispatch(acUpdateDashboardItemShapes(items))
    }
}

export const hasLayout = (layout) => Boolean(layout?.columns?.length)

export const getDashboardItem = (item) => {
    const type = item.type
    const itemPropName = itemTypeMap[type]?.propName

    const id = generateUid()
    const gridItemProperties = getGridItemProperties(id)

    let shape
    if (type === PAGEBREAK) {
        const yPos = item.yPos || 0
        shape = getPageBreakItemShape(yPos, item.isStatic)
    } else if (type === PRINT_TITLE_PAGE) {
        shape = getPrintTitlePageItemShape()
    } else {
        shape = NEW_ITEM_SHAPE
    }

    return {
        id,
        type,
        position: item.position || null,
        [itemPropName]: item.content,
        ...NEW_ITEM_SHAPE,
        ...gridItemProperties,
        ...shape,
    }
}
