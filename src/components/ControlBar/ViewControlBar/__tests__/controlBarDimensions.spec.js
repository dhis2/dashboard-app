import { getRowsFromHeight } from '../controlBarDimensions'

describe('controlBarDimensions', () => {
    describe('getRowsFromHeight', () => {
        it('returns an integer', () => {
            const res = getRowsFromHeight(100)
            expect(Number.isInteger(res)).toBeTruthy()
        })
    })
})
