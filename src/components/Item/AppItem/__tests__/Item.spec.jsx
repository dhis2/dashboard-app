import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Item from '../Item.jsx'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
    getDimensionById: jest.fn(),
}))

jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Divider: function Mock() {
            return <div className="ui-Divider" />
        },
    }
})

jest.mock(
    '../../ItemHeader/DeleteItemButton.jsx',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

const mockStore = configureMockStore()

const item = {
    appKey: 'scorecard',
    id: 'rainbowdash',
    shortened: false,
}

const itemWithoutTitle = {
    appKey: 'noTitle',
    id: 'twilightsparkle',
    shortened: false,
}

const apps = [
    {
        key: 'scorecard',
        name: 'Scorecard',
        launchUrl: 'launchurl',
    },
    {
        key: 'noTitle',
        name: 'No Title',
        launchUrl: 'launchurl',
        settings: {
            dashboardWidget: {
                hideTitle: true,
            },
        },
    },
]

test('renders a valid App item in view mode', () => {
    const store = {
        itemFilters: {},
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={item} dashboardMode={'view'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with filter in view mode', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={item} dashboardMode={'view'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with filter in edit mode', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={item} dashboardMode={'edit'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item without title in view mode if specified in app settings', () => {
    const store = {
        itemFilters: {},
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={itemWithoutTitle} dashboardMode={'view'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with title in edit mode irrespective of app settings', () => {
    const store = {
        itemFilters: {},
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={itemWithoutTitle} dashboardMode={'edit'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders an invalid App item', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
    }

    const invalidItem = {
        appKey: 'unknownApp',
        id: 'unknown',
        shortened: false,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={invalidItem} dashboardMode={'edit'} apps={apps} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
