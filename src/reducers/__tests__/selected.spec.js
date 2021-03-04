import reducer, {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
    SET_SELECTED_ITEM_ACTIVE_TYPE,
    CLEAR_SELECTED_ITEM_ACTIVE_TYPES,
    DEFAULT_STATE_SELECTED_ITEM_ACTIVE_TYPES,
} from '../selected'

describe('selected dashboard reducer', () => {
    const defaultState = {
        id: null,
        isLoading: false,
        showDescription: false,
        itemActiveTypes: {},
    }

    it('sets the selected dashboard id', () => {
        const id = 'my favorite dashboard'
        const expectedState = Object.assign({}, defaultState, { id })

        const actualState = reducer(defaultState, {
            type: SET_SELECTED_ID,
            value: id,
        })

        expect(actualState).toEqual(expectedState)
    })

    it('sets the selected dashboard isLoading state', () => {
        const isLoading = true
        const expectedState = Object.assign({}, defaultState, {
            isLoading,
        })

        const actualState = reducer(defaultState, {
            type: SET_SELECTED_ISLOADING,
            value: isLoading,
        })

        expect(actualState).toEqual(expectedState)
    })

    it('sets the selected dashboard showDescription state', () => {
        const showDescription = true
        const expectedState = Object.assign({}, defaultState, {
            showDescription,
        })

        const actualState = reducer(defaultState, {
            type: SET_SELECTED_SHOWDESCRIPTION,
            value: showDescription,
        })

        expect(actualState).toEqual(expectedState)
    })

    it('sets an item active Type', () => {
        const action = {
            type: SET_SELECTED_ITEM_ACTIVE_TYPE,
            id: 'rainbowDash',
            activeType: 'PONY',
        }

        const expectedState = Object.assign({}, defaultState, {
            itemActiveTypes: { rainbowDash: 'PONY' },
        })

        const actualState = reducer(defaultState, action)

        expect(actualState).toEqual(expectedState)
    })

    it('clears the item active types', () => {
        const action = {
            type: SET_SELECTED_ITEM_ACTIVE_TYPE,
            id: 'rainbowDash',
            activeType: 'PONY',
        }

        const expectedState = Object.assign({}, defaultState, {
            itemActiveTypes: { rainbowDash: 'PONY' },
        })

        const actualState = reducer(defaultState, action)

        expect(actualState).toEqual(expectedState)

        const updatedState = reducer(actualState, {
            type: CLEAR_SELECTED_ITEM_ACTIVE_TYPES,
        })

        expect(updatedState).toEqual(
            Object.assign({}, defaultState, {
                itemActiveTypes: DEFAULT_STATE_SELECTED_ITEM_ACTIVE_TYPES,
            })
        )
    })
})
