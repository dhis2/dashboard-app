import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { APP } from '../../../../modules/itemTypes.js'
import * as mockData from '../../../__mocks__/AppData.js'
import AppDataProvider from '../../../AppDataProvider/AppDataProvider.jsx'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.jsx'
import { Item } from '../../Item.jsx'

jest.mock('@dhis2/analytics', () => ({
    getDimensionById: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useCacheableSection: jest.fn,
}))

jest.mock('@dhis2/app-runtime/experimental', () => ({
    // NOSONAR
    Plugin: ({ pluginSource, width, height, ...pluginProps }) => {
        const lowerCaseProps = Object.keys(pluginProps).reduce((acc, key) => {
            const value = pluginProps[key]
            if (typeof value === 'function') {
                acc[key.toLowerCase()] = 'function'
            } else if (
                typeof value === 'object' &&
                value !== null &&
                Object.keys(value).length === 0
            ) {
                acc[key.toLowerCase()] = 'empty object'
            } else {
                acc[key.toLowerCase()] = value
            }
            return acc
        }, {})

        return (
            <div
                className="MockPlugin"
                data-plugin-source={pluginSource}
                data-width={width}
                data-height={height}
                {...lowerCaseProps}
            />
        )
    },
}))

jest.mock('../../../AppDataProvider/AppDataProvider', () => ({
    ...jest.requireActual('../../../AppDataProvider/AppDataProvider'),
    __esModule: true,
    default: ({ children }) => children,
    useInstalledApps: () => mockData.apps,
    useCurrentUser: () => mockData.currentUser,
    useSystemSettings: () => mockData.systemSettings,
}))

jest.mock(
    '../../ItemHeader/DeleteItemButton.jsx',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

jest.mock('../ItemContextMenu.jsx', () => ({
    ItemContextMenu: () => <div className="ItemContextMenu" />,
}))

const mockStore = configureMockStore()

const pluginItem = {
    type: APP,
    appKey: 'dashboard-plugin',
    id: 'rainbowdash',
    shortened: false,
}

const widgetItemWithoutTitle = {
    type: APP,
    appKey: 'app-widget-no-title',
    id: 'twilightsparkle',
    shortened: false,
}

const widgetItem = {
    type: APP,
    appKey: 'app-widget',
    id: 'applejack',
    shortened: false,
}

test('renders a valid plugin AppItem in view mode', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={pluginItem} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid plugin AppItem with filter in view mode', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={pluginItem} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid plugin AppItem with filter in edit mode', () => {
    const store = {
        editDashboard: {},
        itemFilters: {
            ou: [{ path: '/rainbow' }],
            editDashboard: {
                id: pluginItem.id,
            },
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={pluginItem} dashboardMode={'edit'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid widget AppItem without title in view mode if specified in app settings', () => {
    const store = {
        itemFilters: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item
                        item={widgetItemWithoutTitle}
                        dashboardMode={'view'}
                    />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid widget AppItem with title in edit mode irrespective of app settings', () => {
    const store = {
        itemFilters: {},
        editDashboard: {
            id: widgetItemWithoutTitle.id,
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item
                        item={widgetItemWithoutTitle}
                        dashboardMode={'edit'}
                    />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid widget AppItem', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={widgetItem} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a valid widget AppItem when in slideshow', () => {
    const store = {
        itemFilters: {},
        editDashboard: {},
        selected: { id: 'some-dashboard' },
        slideshow: 1,
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={widgetItem} dashboardMode={'view'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders an invalid AppItem', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
        selected: { id: 'some-dashboard' },
        slideshow: null,
    }

    const invalidItem = {
        type: APP,
        appKey: 'unknownAppKey',
        id: 'unknown',
        shortened: false,
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={invalidItem} dashboardMode={'edit'} />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
