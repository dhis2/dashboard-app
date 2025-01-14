import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import useDimensions from '../../../../modules/useDimensions.js'
import FilterSelector from '../FilterSelector.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({ isDisconnected: false })),
}))

jest.mock('../../../../modules/useDimensions', () => jest.fn())
useDimensions.mockImplementation(() => ['Moomin', 'Snorkmaiden'])

const baseState = { activeModalDimension: {}, itemFilters: {} }
const createMockStore = (state) =>
    createStore(() => ({ ...baseState, ...state }))

test('is disabled when offline', () => {
    useDhis2ConnectionStatus.mockImplementationOnce(
        jest.fn(() => ({ isDisconnected: true }))
    )

    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(getByTestId('dhis2-uicore-button')).toBeDisabled()
})

test('is enabled when online', () => {
    useDhis2ConnectionStatus.mockImplementation(
        jest.fn(() => ({ isDisconnected: false }))
    )

    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(getByTestId('dhis2-uicore-button')).toBeEnabled()
})

test('is null when no filters are restricted and no filters are allowed', () => {
    const props = {
        allowedFilters: [],
        restrictFilters: true,
    }

    const { container } = render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(container.firstChild).toBeNull()
})

test('is null when no filters are restricted and allowedFilters undefined', () => {
    const props = {
        restrictFilters: true,
    }

    const { container } = render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )

    expect(container.firstChild).toBeNull()
})

test('shows button when filters are restricted and at least one filter is allowed', () => {
    const props = {
        allowedFilters: ['Moomin'],
        restrictFilters: true,
    }

    render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(screen.getByRole('button')).toBeVisible()
})

test('shows button when filters are not restricted', () => {
    const props = {
        allowedFilters: [],
        restrictFilters: false,
    }

    render(
        <Provider store={createMockStore()}>
            <FilterSelector {...props} />
        </Provider>
    )
    expect(screen.getByRole('button')).toBeVisible()
})
