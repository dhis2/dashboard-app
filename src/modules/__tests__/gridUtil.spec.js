import {
    hasShape,
    withShape,
    getSmallLayout,
    getProportionalHeight,
    SM_SCREEN_GRID_COLUMNS,
    GRID_COLUMNS,
    getAutoItemShapes,
    toDisplayShape,
    toStorageShape,
    rescaleItemsToColumns,
    getSelectedHeight,
    getMaxSelectedHeight,
    applyHeightToItems,
    addToItemsEnd,
    addToItemsStart,
} from '../gridUtil.js'

describe('withShape', () => {
    it('returns objects with new properties (x, y, w, h)', () => {
        const items = withShape([{}])
        expect(items).toMatchObject([{ x: 0, y: 0, w: 29, h: 32 }])
    })

    it('returns same objects', () => {
        const items = withShape([
            { x: 0, y: 0, w: 29, h: 20 },
            { x: 10, y: 0, w: 10, h: 10 },
        ])
        expect(items).toMatchObject([
            { x: 0, y: 0, w: 29, h: 20 },
            { x: 10, y: 0, w: 10, h: 10 },
        ])
    })

    it('returns empty array', () => {
        const items = withShape([])
        expect(items).toEqual([])
    })
})

describe('hasShape', () => {
    it('should return true if grid block object has correct properties', () => {
        expect(hasShape({ x: 9, y: 20, w: 9, h: 10 })).toBeTruthy()
    })

    it('should return false if grid block object is missing properties', () => {
        expect(hasShape({ x: 9, y: 20, w: 9 })).toBeFalsy()
    })

    it('should return false if grid block object has invalid properties', () => {
        expect(hasShape({ x: 9, y: 20, w: 9, h: 'octopus' })).toBeFalsy()
    })
})

describe('getProportionalHeight', () => {
    it('returns the proportional height in grid units for 480px', () => {
        const item = { w: 20, h: 20, type: 'CHART' }
        expect(getProportionalHeight(item, 480)).toEqual(24)
    })

    it('returns the proportional height in grid units for 360px', () => {
        const item = { w: 20, h: 20, type: 'CHART' }
        expect(getProportionalHeight(item, 360)).toEqual(18)
    })

    it('returns the initial height for non vis type', () => {
        const item = { w: 20, h: 10, type: 'TEXT' }
        expect(getProportionalHeight(item, 360)).toEqual(10)
    })
})

describe('getSmallLayout', () => {
    it('returns layout for small screen', () => {
        const items = [
            { x: 0, y: 0, w: 33, h: 15, type: 'CHART', i: 'A' },
            { x: 33, y: 15, w: 14, h: 30, type: 'CHART', i: 'B' },
            { x: 15, y: 7, w: 7, h: 4, type: 'CHART', i: 'C' },
            { x: 20, y: 25, w: 9, h: 16, type: 'CHART', i: 'D' },
            { x: 7, y: 25, w: 8, h: 16, type: 'CHART', i: 'E' },
            { x: 0, y: 30, w: 10, h: 10, type: 'TEXT', i: 'F' },
        ]

        const expectedLayout = [
            {
                x: 0,
                y: 0,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 13,
                type: 'CHART',
                i: 'A',
            },
            {
                x: 0,
                y: 1,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 14,
                type: 'CHART',
                i: 'C',
            },
            {
                x: 0,
                y: 2,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 52,
                type: 'CHART',
                i: 'B',
            },
            {
                x: 0,
                y: 3,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 49,
                type: 'CHART',
                i: 'E',
            },
            {
                x: 0,
                y: 4,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 43,
                type: 'CHART',
                i: 'D',
            },
            {
                x: 0,
                y: 5,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 10,
                type: 'TEXT',
                i: 'F',
            },
        ]

        expect(getSmallLayout(items, 480)).toMatchObject(expectedLayout)
    })
})

describe('toDisplayShape / toStorageShape', () => {
    it('returns the same item when columns is the canonical GRID_COLUMNS', () => {
        const item = { x: 20, y: 5, w: 20, h: 29, i: 'a' }
        expect(toDisplayShape(item, GRID_COLUMNS)).toBe(item)
        expect(toStorageShape(item, GRID_COLUMNS)).toBe(item)
    })

    it('scales x/w down to 12 columns and leaves y/h untouched', () => {
        const item = { x: 20, y: 5, w: 20, h: 29, i: 'a' }
        expect(toDisplayShape(item, 12)).toMatchObject({
            x: 4,
            y: 5,
            w: 4,
            h: 29,
            i: 'a',
        })
    })

    it('scales x/w down to 4 columns', () => {
        const item = { x: 30, y: 0, w: 30, h: 10 }
        expect(toDisplayShape(item, 4)).toMatchObject({ x: 2, w: 2 })
    })

    it('round-trips cleanly for divisor column counts', () => {
        const item = { x: 20, y: 5, w: 20, h: 29, i: 'a' }
        ;[60, 12, 4].forEach((columns) => {
            const display = toDisplayShape(item, columns)
            expect(toStorageShape(display, columns)).toMatchObject({
                x: 20,
                w: 20,
            })
        })
    })

    it('clamps width to a minimum of 1 column', () => {
        const item = { x: 0, y: 0, w: 1, h: 4 }
        expect(toDisplayShape(item, 4).w).toBe(1)
    })

    it('does not let an item overflow the display column count', () => {
        const item = { x: 58, y: 0, w: 2, h: 4 }
        const display = toDisplayShape(item, 12)
        expect(display.x + display.w).toBeLessThanOrEqual(12)
        expect(display.w).toBeGreaterThanOrEqual(1)
    })

    it('does not let an item overflow the 60-unit storage space', () => {
        const item = { x: 11, y: 0, w: 1, h: 4 }
        const storage = toStorageShape(item, 12)
        expect(storage.x + storage.w).toBeLessThanOrEqual(GRID_COLUMNS)
    })
})

describe('rescaleItemsToColumns', () => {
    it('snaps items to the new column count while preserving identity', () => {
        const items = [
            { x: 20, y: 0, w: 20, h: 29, i: 'a', id: 'a' },
            { x: 0, y: 29, w: 30, h: 10, i: 'b', id: 'b' },
        ]
        const result = rescaleItemsToColumns(items, 12)
        expect(result[0]).toMatchObject({ x: 20, w: 20, i: 'a', id: 'a' })
        expect(result[1]).toMatchObject({ i: 'b', id: 'b' })
    })

    it('returns items unchanged for the canonical GRID_COLUMNS', () => {
        const items = [{ x: 7, y: 3, w: 13, h: 9, i: 'a' }]
        expect(rescaleItemsToColumns(items, GRID_COLUMNS)).toMatchObject(items)
    })
})

describe('getSelectedHeight', () => {
    const items = [
        { i: 'a', x: 0, y: 0, w: 10, h: 20 },
        { i: 'b', x: 10, y: 0, w: 10, h: 20 },
        { i: 'c', x: 20, y: 0, w: 10, h: 30 },
    ]

    it('returns the shared height when all selected items match', () => {
        expect(getSelectedHeight(items, ['a', 'b'])).toBe(20)
    })

    it('returns null when selected items have different heights', () => {
        expect(getSelectedHeight(items, ['a', 'c'])).toBeNull()
    })

    it('returns null when no items are selected', () => {
        expect(getSelectedHeight(items, [])).toBeNull()
        expect(getSelectedHeight(items, ['missing'])).toBeNull()
    })

    it('matches items keyed by id when i is absent', () => {
        const idItems = [
            { id: 'a', h: 15 },
            { id: 'b', h: 15 },
        ]
        expect(getSelectedHeight(idItems, ['a', 'b'])).toBe(15)
    })
})

describe('getMaxSelectedHeight', () => {
    const items = [
        { i: 'a', h: 20 },
        { i: 'b', h: 35 },
        { i: 'c', h: 30 },
    ]

    it('returns the tallest height among selected items', () => {
        expect(getMaxSelectedHeight(items, ['a', 'c'])).toBe(30)
        expect(getMaxSelectedHeight(items, ['a', 'b', 'c'])).toBe(35)
    })

    it('returns null when no items match', () => {
        expect(getMaxSelectedHeight(items, [])).toBeNull()
        expect(getMaxSelectedHeight(items, ['missing'])).toBeNull()
    })
})

describe('applyHeightToItems', () => {
    const items = [
        { i: 'a', x: 0, y: 0, w: 10, h: 20 },
        { i: 'b', x: 10, y: 0, w: 10, h: 25 },
        { i: 'c', x: 20, y: 0, w: 10, h: 30 },
    ]

    it('applies the height to selected items only', () => {
        const result = applyHeightToItems(items, ['a', 'c'], 40)
        expect(result).toMatchObject([
            { i: 'a', h: 40 },
            { i: 'b', h: 25 },
            { i: 'c', h: 40 },
        ])
    })

    it('does not mutate the original items', () => {
        applyHeightToItems(items, ['a'], 99)
        expect(items[0].h).toBe(20)
    })

    it('matches items keyed by id when i is absent', () => {
        const idItems = [
            { id: 'a', h: 10 },
            { id: 'b', h: 10 },
        ]
        expect(applyHeightToItems(idItems, ['b'], 50)).toMatchObject([
            { id: 'a', h: 10 },
            { id: 'b', h: 50 },
        ])
    })
})

describe('getAutoItemShapes', () => {
    const items = [
        { x: 16, y: 20, w: 18, h: 20, id: 'e' },
        { x: 0, y: 0, w: 10, h: 20, id: 'a' },
        { x: 0, y: 40, w: 29, h: 20, id: 'g' },
        { x: 10, y: 0, w: 24, h: 20, id: 'b' },
        { x: 0, y: 20, w: 16, h: 20, id: 'd' },
        { x: 34, y: 0, w: 24, h: 20, id: 'c' },
        { x: 29, y: 40, w: 29, h: 20, id: 'h' },
        { x: 29, y: 60, w: 29, h: 20, id: 'k' },
        { x: 0, y: 60, w: 14, h: 20, id: 'i' },
        { x: 34, y: 20, w: 24, h: 20, id: 'f' },
        { x: 14, y: 60, w: 15, h: 20, id: 'j' },
    ]

    const col6 = [
        { index: 0 },
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 },
    ]
    const col5 = col6.slice(0, 5)
    const col4 = col6.slice(0, 4)
    const col3 = col6.slice(0, 3)
    const col2 = col6.slice(0, 2)

    it('should handle 2 columns', () => {
        const expectedItems = [
            { x: 0, y: 0, w: 30, h: 29, id: 'a' },
            { x: 30, y: 0, w: 30, h: 29, id: 'b' },
            { x: 0, y: 29, w: 30, h: 29, id: 'c' },
            { x: 30, y: 29, w: 30, h: 29, id: 'd' },
            { x: 0, y: 58, w: 30, h: 29, id: 'e' },
            { x: 30, y: 58, w: 30, h: 29, id: 'f' },
            { x: 0, y: 87, w: 30, h: 29, id: 'g' },
            { x: 30, y: 87, w: 30, h: 29, id: 'h' },
            { x: 0, y: 116, w: 30, h: 29, id: 'i' },
            { x: 30, y: 116, w: 30, h: 29, id: 'j' },
            { x: 0, y: 145, w: 30, h: 29, id: 'k' },
        ]

        expect(getAutoItemShapes(items, col2, 60)).toEqual(expectedItems)
    })

    it('should handle 3 columns', () => {
        const expectedItems = [
            { x: 0, y: 0, w: 20, h: 29, id: 'a' },
            { x: 20, y: 0, w: 20, h: 29, id: 'b' },
            { x: 40, y: 0, w: 20, h: 29, id: 'c' },
            { x: 0, y: 29, w: 20, h: 29, id: 'd' },
            { x: 20, y: 29, w: 20, h: 29, id: 'e' },
            { x: 40, y: 29, w: 20, h: 29, id: 'f' },
            { x: 0, y: 58, w: 20, h: 29, id: 'g' },
            { x: 20, y: 58, w: 20, h: 29, id: 'h' },
            { x: 40, y: 58, w: 20, h: 29, id: 'i' },
            { x: 0, y: 87, w: 20, h: 29, id: 'j' },
            { x: 20, y: 87, w: 20, h: 29, id: 'k' },
        ]

        expect(getAutoItemShapes(items, col3, 60)).toEqual(expectedItems)
    })

    it('should handle 4 columns', () => {
        const expectedItems = [
            { x: 0, y: 0, w: 15, h: 29, id: 'a' },
            { x: 15, y: 0, w: 15, h: 29, id: 'b' },
            { x: 30, y: 0, w: 15, h: 29, id: 'c' },
            { x: 45, y: 0, w: 15, h: 29, id: 'd' },
            { x: 0, y: 29, w: 15, h: 29, id: 'e' },
            { x: 15, y: 29, w: 15, h: 29, id: 'f' },
            { x: 30, y: 29, w: 15, h: 29, id: 'g' },
            { x: 45, y: 29, w: 15, h: 29, id: 'h' },
            { x: 0, y: 58, w: 15, h: 29, id: 'i' },
            { x: 15, y: 58, w: 15, h: 29, id: 'j' },
            { x: 30, y: 58, w: 15, h: 29, id: 'k' },
        ]

        expect(getAutoItemShapes(items, col4, 60)).toEqual(expectedItems)
    })

    it('should handle 5 columns', () => {
        const expectedItems = [
            { x: 0, y: 0, w: 12, h: 29, id: 'a' },
            { x: 12, y: 0, w: 12, h: 29, id: 'b' },
            { x: 24, y: 0, w: 12, h: 29, id: 'c' },
            { x: 36, y: 0, w: 12, h: 29, id: 'd' },
            { x: 48, y: 0, w: 12, h: 29, id: 'e' },
            { x: 0, y: 29, w: 12, h: 29, id: 'f' },
            { x: 12, y: 29, w: 12, h: 29, id: 'g' },
            { x: 24, y: 29, w: 12, h: 29, id: 'h' },
            { x: 36, y: 29, w: 12, h: 29, id: 'i' },
            { x: 48, y: 29, w: 12, h: 29, id: 'j' },
            { x: 0, y: 58, w: 12, h: 29, id: 'k' },
        ]

        expect(getAutoItemShapes(items, col5, 60)).toEqual(expectedItems)
    })

    it('should handle 6 columns', () => {
        const expectedItems = [
            { x: 0, y: 0, w: 10, h: 29, id: 'a' },
            { x: 10, y: 0, w: 10, h: 29, id: 'b' },
            { x: 20, y: 0, w: 10, h: 29, id: 'c' },
            { x: 30, y: 0, w: 10, h: 29, id: 'd' },
            { x: 40, y: 0, w: 10, h: 29, id: 'e' },
            { x: 50, y: 0, w: 10, h: 29, id: 'f' },
            { x: 0, y: 29, w: 10, h: 29, id: 'g' },
            { x: 10, y: 29, w: 10, h: 29, id: 'h' },
            { x: 20, y: 29, w: 10, h: 29, id: 'i' },
            { x: 30, y: 29, w: 10, h: 29, id: 'j' },
            { x: 40, y: 29, w: 10, h: 29, id: 'k' },
        ]

        expect(getAutoItemShapes(items, col6, 60)).toEqual(expectedItems)
    })
})

describe('addToItemsEnd (freeflow)', () => {
    const newItem = { id: 'new', w: 20, h: 29 }

    it('places the first item at the top-left', () => {
        expect(addToItemsEnd([], [], newItem)).toEqual([
            { ...newItem, x: 0, y: 0 },
        ])
    })

    it('flows left-to-right along the bottom row', () => {
        const items = [{ id: 'a', x: 0, y: 0, w: 20, h: 29 }]
        const result = addToItemsEnd(items, [], newItem)
        expect(result[result.length - 1]).toMatchObject({
            id: 'new',
            x: 20,
            y: 0,
        })
    })

    it('keeps flowing right until the row is full', () => {
        const items = [
            { id: 'a', x: 0, y: 0, w: 20, h: 29 },
            { id: 'b', x: 20, y: 0, w: 20, h: 29 },
        ]
        const result = addToItemsEnd(items, [], newItem)
        expect(result[result.length - 1]).toMatchObject({
            id: 'new',
            x: 40,
            y: 0,
        })
    })

    it('wraps to a new bottom row when the row is full', () => {
        const items = [
            { id: 'a', x: 0, y: 0, w: 20, h: 29 },
            { id: 'b', x: 20, y: 0, w: 20, h: 29 },
            { id: 'c', x: 40, y: 0, w: 20, h: 29 },
        ]
        const result = addToItemsEnd(items, [], newItem)
        expect(result[result.length - 1]).toMatchObject({
            id: 'new',
            x: 0,
            y: 29,
        })
    })

    it('delegates to getAutoItemShapes in fixed-columns mode', () => {
        const items = [{ id: 'a', x: 0, y: 0, w: 20, h: 29 }]
        const columns = [{ index: 0 }, { index: 1 }]
        const expected = getAutoItemShapes(
            [...items, { ...newItem, y: 29 }],
            columns
        )
        expect(addToItemsEnd(items, columns, newItem)).toEqual(expected)
    })
})

describe('addToItemsStart (freeflow)', () => {
    const newItem = { id: 'new', w: 20, h: 29 }

    it('places the first item at the top-left', () => {
        expect(addToItemsStart([], [], newItem)).toEqual([
            { ...newItem, x: 0, y: 0 },
        ])
    })

    it('flows left-to-right along the top row', () => {
        const items = [{ id: 'a', x: 0, y: 0, w: 20, h: 29 }]
        const result = addToItemsStart(items, [], newItem)
        expect(result[0]).toMatchObject({ id: 'new', x: 20, y: 0 })
        expect(result).toHaveLength(2)
    })

    it('pushes existing items down when the top row is full', () => {
        const items = [
            { id: 'a', x: 0, y: 0, w: 20, h: 29 },
            { id: 'b', x: 20, y: 0, w: 20, h: 29 },
            { id: 'c', x: 40, y: 0, w: 20, h: 29 },
        ]
        const result = addToItemsStart(items, [], newItem)
        expect(result[0]).toMatchObject({ id: 'new', x: 0, y: 0 })
        expect(result.slice(1)).toMatchObject([
            { id: 'a', x: 0, y: 29 },
            { id: 'b', x: 20, y: 29 },
            { id: 'c', x: 40, y: 29 },
        ])
    })

    it('delegates to getAutoItemShapes in fixed-columns mode', () => {
        const items = [{ id: 'a', x: 0, y: 0, w: 20, h: 29 }]
        const columns = [{ index: 0 }, { index: 1 }]
        const expected = getAutoItemShapes(
            [...items, { ...newItem, x: 0, y: 0, w: 0, h: 0 }],
            columns
        )
        expect(addToItemsStart(items, columns, newItem)).toEqual(expected)
    })
})
