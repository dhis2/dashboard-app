import reducer, { SET_ISLOADING, DEFAULT_STATE_ISLOADING } from '../isLoading'

it('sets the selected dashboard ISLOADING state', () => {
    const actualState = reducer(DEFAULT_STATE_ISLOADING, {
        type: SET_ISLOADING,
        value: true,
    })

    expect(actualState).toEqual(true)
})
