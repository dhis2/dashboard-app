import reducer, {
    DEFAULT_STATE_EDIT_ITEM_FILTERS,
    SET_EDIT_ITEM_FILTERS,
    REMOVE_EDIT_ITEM_FILTER,
    CLEAR_EDIT_ITEM_FILTERS,
} from '../editItemFilters'

const testKey = 'ou'
const testValue = [{ id: 'ou1', name: 'OU test' }]

const testState = {
    [testKey]: testValue,
}

describe('item filter reducer', () => {
    describe('reducer', () => {
        it('should return the default state', () => {
            const actualState = reducer(DEFAULT_STATE_EDIT_ITEM_FILTERS, {})

            expect(actualState).toEqual(DEFAULT_STATE_EDIT_ITEM_FILTERS)
        })

        it('should set a filter', () => {
            const action = {
                type: SET_EDIT_ITEM_FILTERS,
                filters: testState,
            }

            const expectedState = testState

            const actualState = reducer(undefined, action)

            expect(actualState).toEqual(expectedState)
        })

        it('should remove a filter', () => {
            const action = {
                type: REMOVE_EDIT_ITEM_FILTER,
                id: testKey,
            }

            const expectedState = DEFAULT_STATE_EDIT_ITEM_FILTERS

            const actualState = reducer(testState, action)

            expect(actualState).toEqual(expectedState)
        })

        it('should clear all filters', () => {
            const action = {
                type: CLEAR_EDIT_ITEM_FILTERS,
            }

            const expectedState = DEFAULT_STATE_EDIT_ITEM_FILTERS

            const actualState = reducer(testState, action)

            expect(actualState).toEqual(expectedState)
        })
    })
})
