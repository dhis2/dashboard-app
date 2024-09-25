import { getFirstOfTypes } from '../getFirstOfType.js'

describe('getFirstOfTypes', () => {
    test('returns an empty array if no items are passed', () => {
        expect(getFirstOfTypes([])).toEqual([])
    })

    test('returns only ids for types in the array', () => {
        expect(
            getFirstOfTypes([
                { id: 'map2', type: 'MAP', x: 1, y: 1 },
                { id: 'map1', type: 'MAP', x: 2, y: 0 },
            ])
        ).toEqual(['map1'])
    })

    test('returns first IDs for MAP, VISUALIZATION and EVENT_VISUALIZATION', () => {
        expect(
            getFirstOfTypes([
                { id: 'map2', type: 'MAP', x: 2, y: 2 },
                { id: 'map1', type: 'MAP', x: 1, y: 1 },
                { id: 'map0', type: 'MAP', x: 2, y: 0 },
                { id: 'vis1', type: 'CHART', x: 1, y: 1 },
                { id: 'vis0', type: 'REPORT_TABLE', x: 1, y: 0 },
                { id: 'vis2', type: 'VISUALIZATION', x: 2, y: 1 },
                { id: 'text1', type: 'TEXT', x: 0, y: 0 },
                { id: 'ev2', type: 'EVENT_VISUALIZATION', x: 0, y: 3 },
                { id: 'ev1', type: 'EVENT_VISUALIZATION', x: 1, y: 2 },
                { id: 'ev0', type: 'EVENT_VISUALIZATION', x: 0, y: 2 },
            ])
        ).toEqual(['map0', 'ev0', 'vis0'])
    })
})
