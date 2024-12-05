import { getRowsFromHeight } from '../getRowsFromHeight.js'

test('getRowsFromHeight returns an integer', () => {
    const res = getRowsFromHeight(100)
    expect(Number.isInteger(res)).toBeTruthy()
})

const testCases = [
    { height: 0, rows: 0 },
    { height: 36, rows: 1 },
    { height: 100, rows: 3 },
    { height: 200, rows: 5 },
    { height: 300, rows: 8 },
    { height: 400, rows: 10 },
    { height: 500, rows: 13 },
]

testCases.forEach(({ height, rows }) => {
    test(`getRowsFromHeight returns ${rows} for height ${height}`, () => {
        expect(getRowsFromHeight(height)).toBe(rows)
    })
})