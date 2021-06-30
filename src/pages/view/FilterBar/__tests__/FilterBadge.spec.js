import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import FilterBadge from '../FilterBadge'

const mockStore = configureMockStore()

test('Filter Badge displays badge containing number of items in filter', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Rainbow Dash' }, { name: 'Twilight Sparkle' }],
    }
    const { container } = render(
        <Provider store={mockStore({})}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('FilterBadge displays badge with filter item name when only one filter item', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Twilight Sparkle' }],
    }

    const { container } = render(
        <Provider store={mockStore({})}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
