import {
    hasShape,
    getShape,
    getProportionalHeight,
    getSmallLayout,
} from '../gridUtil'

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

describe('getProportionalHeight', () => {
    it('gets height for 30/15', () => {
        expect(getProportionalHeight({ w: 30, h: 15 })).toEqual(5)
    })

    it('gets height for 15/30', () => {
        expect(getProportionalHeight({ w: 15, h: 30 })).toEqual(20)
    })

    it('gets height for 8/4', () => {
        expect(getProportionalHeight({ w: 8, h: 4 })).toEqual(5)
    })

    it('gets height for 8/16', () => {
        expect(getProportionalHeight({ w: 8, h: 16 })).toEqual(20)
    })

    it('gets height for 29/13', () => {
        expect(getProportionalHeight({ w: 29, h: 13 })).toEqual(4)
    })
})

describe('getSmallLayout', () => {
    it('layout 1', () => {
        const items = [
            { x: 1, y: 1, w: 1, h: 1, i: 'A' },
            { x: 1, y: 1, w: 1, h: 1, i: 'B' },
            { x: 1, y: 1, w: 1, h: 1, i: 'C' },
            { x: 1, y: 1, w: 1, h: 1, i: 'D' },
            { x: 1, y: 1, w: 1, h: 1, i: 'E' },
        ]

        const expectedLayout = [
            { x: 1, y: 1, w: 1, h: 1 },
            { x: 1, y: 1, w: 1, h: 1 },
            { x: 1, y: 1, w: 1, h: 1 },
            { x: 1, y: 1, w: 1, h: 1 },
            { x: 1, y: 1, w: 1, h: 1 },
        ]
        // toMatch, toEqual... ?

        expect(getSmallLayout(items)).toMatch(expectedLayout)
    })
})
