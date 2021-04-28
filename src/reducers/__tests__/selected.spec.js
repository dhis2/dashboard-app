import reducer, { SET_SELECTED_ID } from '../selected'

describe('selected dashboard reducer', () => {
    const defaultState = {
        id: null,
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
})
