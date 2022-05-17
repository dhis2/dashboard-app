import { getRowsFromHeight } from '../getRowsFromHeight.js'

test('getRowsFromHeight returns an integer', () => {
    const res = getRowsFromHeight(100)
    expect(Number.isInteger(res)).toBeTruthy()
})
