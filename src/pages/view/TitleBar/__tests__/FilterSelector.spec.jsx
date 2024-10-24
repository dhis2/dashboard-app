import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import useDimensions from '../../../../modules/useDimensions.js'
import FilterSelector from '../FilterSelector.jsx'

const mockStore = configureMockStore()

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({ isDisconnected: false })),
}))

/* eslint-disable react/prop-types */
jest.mock(
    '../../../../components/DropdownButton/DropdownButton.jsx',
    () =>
        function Mock({ children, ...props }) {
            return (
                <button className="DropdownButton" type="button" {...props}>
                    {children}
                </button>
            )
        }
)
/* eslint-enable react/prop-types */

jest.mock('../../../../modules/useDimensions', () => jest.fn())
useDimensions.mockImplementation(() => ['Moomin', 'Snorkmaiden'])

test('is disabled when offline', () => {
    useDhis2ConnectionStatus.mockImplementationOnce(
        jest.fn(() => ({ isDisconnected: true }))
    )

    const store = { activeModalDimension: {}, itemFilters: {} }

    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('is enabled when online', () => {
    // useDhis2ConnectionStatus.mockImplementation(jest.fn(() => ({ isDisconnected: false })))

    const store = { activeModalDimension: {}, itemFilters: {} }

    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('is null when no filters are restricted and no filters are allowed', () => {
    const store = { activeModalDimension: {}, itemFilters: {} }

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
    const store = { activeModalDimension: {}, itemFilters: {} }

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
    const store = { activeModalDimension: {}, itemFilters: {} }

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
    const store = { activeModalDimension: {}, itemFilters: {} }

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
