import reducer, { SET_SELECTED, DEFAULT_SELECTED_STATE } from '../selected.js'

test('selected dashboard reducer', () => {
    const selected = {
        id: 'fluttershy',
        displayName: 'Fluttershy',
        displayDescription: 'shiny pony',
        dashboardItems: [{ id: 'abc' }, { id: 'def' }],
        restrictFilters: true,
        allowedFilters: ['orgunit'],
        access: {},
    }
    const expectedState = {
        id: 'fluttershy',
        displayName: 'Fluttershy',
        displayDescription: 'shiny pony',
        dashboardItems: [{ id: 'abc' }, { id: 'def' }],
        restrictFilters: true,
        allowedFilters: ['orgunit'],
        access: {},
    }

    const actualState = reducer(DEFAULT_SELECTED_STATE, {
        type: SET_SELECTED,
        value: selected,
    })

    expect(actualState).toEqual(expectedState)
})
