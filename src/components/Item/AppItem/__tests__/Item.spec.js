import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { APP } from '../../../../modules/itemTypes.js'
import SystemSettingsProvider from '../../../SystemSettingsProvider.js'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.js'
import { Item } from '../../Item.js'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        apps: [
            {
                key: 'scorecard',
                name: 'Scorecard',
                appType: 'DASHBOARD_WIDGET',
                launchUrl: 'launchurl',
            },
            {
                key: 'noTitle',
                name: 'No Title',
                launchUrl: 'launchurl',
                appType: 'DASHBOARD_WIDGET',
                settings: {
                    dashboardWidget: {
                        hideTitle: true,
                    },
                },
            },
            {
                key: 'new-dashboard-plugin',
                name: 'New dashboard plugin',
                appType: 'APP',
                pluginLaunchUrl: 'pluginLaunchUrl',
            },
        ],
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
    getDimensionById: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useCacheableSection: jest.fn,
}))

jest.mock('../../../SystemSettingsProvider')
jest.mock(
    '../../ItemHeader/DeleteItemButton.js',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

jest.mock('../ItemContextMenu.js', () => ({
    ItemContextMenu: () => <div className="ItemContextMenu" />,
}))

const mockStore = configureMockStore()

const item = {
    type: APP,
    appKey: 'new-dashboard-plugin',
    id: 'rainbowdash',
    shortened: false,
}

const itemWithoutTitle = {
    type: APP,
    appKey: 'noTitle',
    id: 'twilightsparkle',
    shortened: false,
}

const itemLegacyWidget = {
    type: APP,
    appKey: 'scorecard',
    id: 'applejack',
    shortened: false,
}

test('renders a valid App item in view mode', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with filter in view mode', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with filter in edit mode', () => {
    const store = {
        editDashboard: {},
        itemFilters: {
            ou: [{ path: '/rainbow' }],
            editDashboard: {
                id: item.id,
            },
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode={'edit'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item without title in view mode if specified in app settings', () => {
    const store = {
        itemFilters: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={itemWithoutTitle} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid App item with title in edit mode irrespective of app settings', () => {
    const store = {
        itemFilters: {},
        editDashboard: {
            id: itemWithoutTitle.id,
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={itemWithoutTitle} dashboardMode={'edit'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid legacy widget item', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={itemLegacyWidget} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid legacy widget item when in slideshow', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: 1,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={itemLegacyWidget} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders an invalid App item', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const invalidItem = {
        type: APP,
        appKey: 'unknownApp',
        id: 'unknown',
        shortened: false,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={invalidItem} dashboardMode={'edit'} />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
