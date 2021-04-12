import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import FilterSelector from '../FilterSelector'
import useDimensions from '../../../../modules/useDimensions'

const mockStore = configureMockStore()

jest.mock('../../../../modules/useDimensions', () => jest.fn())
useDimensions.mockImplementation(() => ['Moomin', 'Snorkmaiden'])

test('is null when no filters are restricted and no filters are allowed', () => {
    const store = {}

    const props = {
        allowedFilters: [],
        restrictFilters: true,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(container.firstChild).toBeNull()
})

test('is null when no filters are restricted and allowedFilters undefined', () => {
    const store = {}

    const props = {
        restrictFilters: true,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(container.firstChild).toBeNull()
})

test('shows button when filters are restricted and at least one filter is allowed', () => {
    const store = {}

    const props = {
        allowedFilters: ['Moomin'],
        restrictFilters: true,
    }

    render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(screen.getByRole('button')).toBeTruthy()
})

test('shows button when filters are not restricted', () => {
    const store = {}

    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(screen.getByRole('button')).toBeTruthy()
})
