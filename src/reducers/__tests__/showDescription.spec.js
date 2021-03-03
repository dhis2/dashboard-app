import reducer, {
    SET_SHOWDESCRIPTION,
    DEFAULT_STATE_SHOWDESCRIPTION,
} from '../showDescription'

it('sets the selected dashboard showDescription state', () => {
    const actualState = reducer(DEFAULT_STATE_SHOWDESCRIPTION, {
        type: SET_SHOWDESCRIPTION,
        value: true,
    })

    expect(actualState).toEqual(true)
})
