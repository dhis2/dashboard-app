import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.js'
import Item from '../../Item.js'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        apps: [
            {
                key: 'scorecard',
                name: 'Scorecard',
                launchUrl: 'launchurl',
                pluginLaunchUrl: 'pluginLaunchUrl',
            },
            {
                key: 'noTitle',
                name: 'No Title',
                launchUrl: 'launchurl',
                pluginLaunchUrl: 'pluginLaunchUrl',
                settings: {
                    dashboardWidget: {
                        hideTitle: true,
                    },
                },
            },
        ],
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
    getDimensionById: jest.fn(),
}))

jest.mock(
    '../../ItemHeader/DeleteItemButton.js',
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

test('renders a valid App item in view mode', () => {
    const store = {
        itemFilters: {},
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Item item={item} dashboardMode={'view'} />
            </WindowDimensionsProvider>
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
            <WindowDimensionsProvider>
                <Item item={item} dashboardMode={'view'} />
            </WindowDimensionsProvider>
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
            <WindowDimensionsProvider>
                <Item item={item} dashboardMode={'edit'} />
            </WindowDimensionsProvider>
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
            <WindowDimensionsProvider>
                <Item item={itemWithoutTitle} dashboardMode={'view'} />
            </WindowDimensionsProvider>
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
            <WindowDimensionsProvider>
                <Item item={itemWithoutTitle} dashboardMode={'edit'} />
            </WindowDimensionsProvider>
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
            <WindowDimensionsProvider>
                <Item item={invalidItem} dashboardMode={'edit'} />
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
