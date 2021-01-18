import { hasShape, getShape, getSmallLayout } from '../gridUtil'

describe('getShape', () => {
    it('should return an object with 4 properties (x, y, w, h)', () => {
        const shape = getShape(0)
        expect(shape).toHaveProperty('x')
        expect(shape).toHaveProperty('y')
        expect(shape).toHaveProperty('w')
        expect(shape).toHaveProperty('h')
        expect(Object.keys(shape)).toHaveLength(4)
    })

    it('should throw an error when the grid block number is invalid', () => {
        expect(() => {
            getShape('octopus')
        }).toThrow('Invalid grid block number')
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
            { x: 7, y: 25, w: 8, h: 16, i: 'D' },
            { x: 20, y: 25, w: 9, h: 16, i: 'E' },
        ]

        const expectedLayout = [
            { x: 0, y: 0, w: 12, h: 16, i: 'A' },
            { x: 33, y: 15, w: 12, h: 25, i: 'B' },
            { x: 15, y: 7, w: 12, h: 16, i: 'C' },
            { x: 7, y: 25, w: 12, h: 24, i: 'D' },
            { x: 20, y: 25, w: 12, h: 21, i: 'E' },
        ]

        expect(getSmallLayout(items)).toMatchObject(expectedLayout)
    })
})
