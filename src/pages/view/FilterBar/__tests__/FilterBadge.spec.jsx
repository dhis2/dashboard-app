import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import FilterBadge from '../FilterBadge.jsx'

const mockStore = configureMockStore()

const store = { selected: { id: 'dashboard1' } }

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
}))

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
    useCacheableSection: jest.fn(() => ({
        isCached: false,
        recordingState: 'default',
    })),
}))

test('Filter Badge displays badge containing number of items in filter', () => {
    const filter = {
        id: 'ponies',
        name: 'Ponies',
        values: [{ name: 'Rainbow Dash' }, { name: 'Twilight Sparkle' }],
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
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
        <Provider store={mockStore(store)}>
            <FilterBadge
                filter={filter}
                openFilterModal={jest.fn()}
                removeFilter={jest.fn}
                onRemove={Function.prototype}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
