import {
    hasShape,
    withShape,
    getSmallLayout,
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

describe('getSmallLayout', () => {
    it('returns layout for small screen', () => {
        const items = [
            { x: 0, y: 0, w: 33, h: 15, i: 'A' },
            { x: 33, y: 15, w: 14, h: 30, i: 'B' },
            { x: 15, y: 7, w: 7, h: 4, i: 'C' },
            { x: 20, y: 25, w: 9, h: 16, i: 'D' },
            { x: 7, y: 25, w: 8, h: 16, i: 'E' },
        ]

        const expectedLayout = [
            { x: 0, y: 0, w: SM_SCREEN_GRID_COLUMNS, h: 16, i: 'A' },
            { x: 0, y: 1, w: SM_SCREEN_GRID_COLUMNS, h: 16, i: 'C' },
            { x: 0, y: 2, w: SM_SCREEN_GRID_COLUMNS, h: 25, i: 'B' },
            { x: 0, y: 3, w: SM_SCREEN_GRID_COLUMNS, h: 24, i: 'E' },
            { x: 0, y: 4, w: SM_SCREEN_GRID_COLUMNS, h: 21, i: 'D' },
        ]

        expect(getSmallLayout(items)).toMatchObject(expectedLayout)
    })
})
