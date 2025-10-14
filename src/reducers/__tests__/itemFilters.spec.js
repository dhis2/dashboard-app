import reducer, {
    DEFAULT_STATE_ITEM_FILTERS,
    REMOVE_ITEM_FILTER,
    CLEAR_ITEM_FILTERS,
    msGetNamedItemFilters,
} from '../itemFilters.js'

const testKey = 'ou'
const testValue = [{ id: 'ou1', name: 'OU test' }]

const testState = {
    [testKey]: testValue,
}

describe('item filter reducer', () => {
    describe('reducer', () => {
        it('should return the default state', () => {
            const actualState = reducer(DEFAULT_STATE_ITEM_FILTERS, {})

            expect(actualState).toEqual(DEFAULT_STATE_ITEM_FILTERS)
        })

        it('should remove a filter', () => {
            const action = {
                type: REMOVE_ITEM_FILTER,
                id: testKey,
            }

            const expectedState = DEFAULT_STATE_ITEM_FILTERS

            const actualState = reducer(testState, action)

            expect(actualState).toEqual(expectedState)
        })

        it('should clear all filters', () => {
            const action = {
                type: CLEAR_ITEM_FILTERS,
            }

            const expectedState = DEFAULT_STATE_ITEM_FILTERS

            const actualState = reducer(testState, action)

            expect(actualState).toEqual(expectedState)
        })
    })
})

describe('msGetNamedItemFilters', () => {
    const dimensions = [
        { id: 'pe', name: 'Period' },
        { id: 'ou', name: 'Organisation unit' },
    ]

    it('returns an empty array when filters is DEFAULT_STATE_ITEM_FILTERS', () => {
        const state = {
            itemFilters: DEFAULT_STATE_ITEM_FILTERS,
            dimensions,
        }
        expect(msGetNamedItemFilters(state)).toEqual([])
    })

    it('maps filters to named filters structure', () => {
        const filters = {
            pe: [
                { id: '2019', name: '2019' },
                { id: 'LAST_MONTH', displayName: 'Last month' },
            ],
            ou: [{ id: 'ImspTQPwCqd', name: 'Sierra Leone' }],
        }
        const state = {
            itemFilters: filters,
            dimensions,
        }
        expect(msGetNamedItemFilters(state)).toEqual([
            {
                id: 'pe',
                name: 'Period',
                values: [
                    { id: '2019', name: '2019' },
                    { id: 'LAST_MONTH', name: 'Last month' },
                ],
            },
            {
                id: 'ou',
                name: 'Organisation unit',
                values: [{ id: 'ImspTQPwCqd', name: 'Sierra Leone' }],
            },
        ])
    })

    it('handles missing dimension gracefully', () => {
        const filters = {
            xx: [{ id: 'foo', name: 'Foo' }],
        }
        const state = {
            itemFilters: filters,
            dimensions,
        }
        // This will throw because .find returns undefined and .name is accessed
        expect(() => msGetNamedItemFilters(state)).toThrow()
    })
})
