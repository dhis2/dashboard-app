import reducer, {
    SET_ITEM_ACTIVE_TYPE,
    CLEAR_ITEM_ACTIVE_TYPES,
    DEFAULT_STATE_ITEM_ACTIVE_TYPES,
} from '../itemActiveTypes'

describe('itemActiveTypes reducer', () => {
    const defaultState = {}
    it('sets an item active Type', () => {
        const action = {
            type: SET_ITEM_ACTIVE_TYPE,
            id: 'rainbowDash',
            activeType: 'PONY',
        }

        const expectedState = Object.assign(
            {},
            DEFAULT_STATE_ITEM_ACTIVE_TYPES,
            { rainbowDash: 'PONY' }
        )

        const actualState = reducer(defaultState, action)

        expect(actualState).toEqual(expectedState)
    })

    it('clears the item active types', () => {
        const action = {
            type: SET_ITEM_ACTIVE_TYPE,
            id: 'rainbowDash',
            activeType: 'PONY',
        }

        const expectedState = Object.assign({}, defaultState, {
            rainbowDash: 'PONY',
        })

        const actualState = reducer(defaultState, action)

        expect(actualState).toEqual(expectedState)

        const updatedState = reducer(actualState, {
            type: CLEAR_ITEM_ACTIVE_TYPES,
        })

        expect(updatedState).toEqual(DEFAULT_STATE_ITEM_ACTIVE_TYPES)
    })
})
