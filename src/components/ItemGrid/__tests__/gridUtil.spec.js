import {
    hasShape,
    withShape,
    getSmallLayout,
    getProportionalHeight,
    SM_SCREEN_GRID_COLUMNS,
} from '../gridUtil'

describe('withShape', () => {
    it('returns objects with new properties (x, y, w, h)', () => {
        const items = withShape([{}])
        expect(items).toMatchObject([{ x: 0, y: 0, w: 29, h: 20 }])
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
        expect(getProportionalHeight(item, 480)).toEqual(18)
    })

    it('returns the proportional height in grid units for 360px', () => {
        const item = { w: 20, h: 20, type: 'CHART' }
        expect(getProportionalHeight(item, 360)).toEqual(16)
    })

    it('returns the initial height for non vis type', () => {
        const item = { w: 20, h: 10, type: 'TEXT' }
        expect(getProportionalHeight(item, 360)).toEqual(8)
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
                h: 16,
                type: 'CHART',
                i: 'A',
            },
            {
                x: 0,
                y: 1,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 16,
                type: 'CHART',
                i: 'C',
            },
            {
                x: 0,
                y: 2,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 38,
                type: 'CHART',
                i: 'B',
            },
            {
                x: 0,
                y: 3,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 36,
                type: 'CHART',
                i: 'E',
            },
            {
                x: 0,
                y: 4,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 32,
                type: 'CHART',
                i: 'D',
            },
            {
                x: 0,
                y: 5,
                w: SM_SCREEN_GRID_COLUMNS,
                h: 8,
                type: 'TEXT',
                i: 'F',
            },
        ]

        expect(getSmallLayout(items, 480)).toMatchObject(expectedLayout)
    })
})
