import reducer, { SET_SELECTED_ID, SET_SELECTED_ISLOADING } from '../selected'

describe('selected dashboard reducer', () => {
    const defaultState = {
        id: null,
        isLoading: false,
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
})
