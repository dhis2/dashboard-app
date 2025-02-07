import { getRowsFromHeight } from '../getRowsFromHeight.js'

test('getRowsFromHeight returns an integer', () => {
    const res = getRowsFromHeight(100)
    expect(Number.isInteger(res)).toBeTruthy()
})

const testCases = [
    { height: 0, rows: 1 },
    { height: 36, rows: 1 },
    { height: 62, rows: 1 },
    { height: 63, rows: 2 },
    { height: 100, rows: 2 },
    { height: 101, rows: 3 },
    { height: 138, rows: 3 },
    { height: 139, rows: 4 },
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
