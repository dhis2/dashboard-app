import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { useWindowDimensions } from '../../../../components/WindowDimensionsProvider.js'
import FilterBadge from '../FilterBadge.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({ isConnected: true })),
}))
jest.mock('../../../../components/WindowDimensionsProvider.js', () => ({
    useWindowDimensions: jest.fn(() => ({ width: 1920, height: 1080 })),
}))

const baseState = { selected: { id: 'dashboard1' } }
const createMockStore = (state) =>
    createStore(() => ({ ...baseState, ...state }))

test('Displays badge containing number of filter items when filtered on multiple', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Rainbow Dash' }, { name: 'Twilight Sparkle' }],
    }
    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(getByTestId('filter-badge-button')).toHaveTextContent(
        'Ponies: 2 selected'
    )
})

test('Displays badge with filter item name when only one filter item is present', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Twilight Sparkle' }],
    }
    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(getByTestId('filter-badge-button')).toHaveTextContent(
        'Ponies: Twilight Sparkle'
    )
})

test('Has enabled buttons when online', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Twilight Sparkle' }],
    }
    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(getByTestId('filter-badge-button')).toBeEnabled()
    expect(getByTestId('filter-badge-clear-button')).toBeEnabled()
})

test('Shows only a disabled edit-filter button when offline', () => {
    useDhis2ConnectionStatus.mockImplementationOnce(() => ({
        isConnected: false,
    }))
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Twilight Sparkle' }],
    }
    const { getByTestId, queryByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(getByTestId('filter-badge-button')).toBeDisabled()
    expect(queryByTestId('filter-badge-clear-button')).not.toBeInTheDocument()
})

test('Shows a disabled edit-filter button and enabled clear-filter when on small screen', () => {
    useWindowDimensions.mockImplementationOnce(() => ({
        width: 440,
        height: 780,
    }))
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Twilight Sparkle' }],
    }
    const { getByTestId } = render(
        <Provider store={createMockStore()}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(getByTestId('filter-badge-button')).toBeDisabled()
    expect(getByTestId('filter-badge-clear-button')).toBeEnabled()
})
