import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Item from '../Item'

jest.mock('@dhis2/app-runtime-adapter-d2')

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

useD2.mockReturnValue({
    d2: {
        system: {
            installedApps: [
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
            ],
        },
    },
})

test('renders a valid App item in view mode', () => {
    const store = {
        itemFilters: {},
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Item item={item} dashboardMode={'view'} />
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
            <Item item={item} dashboardMode={'view'} />
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
            <Item item={item} dashboardMode={'edit'} />
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
            <Item item={itemWithoutTitle} dashboardMode={'view'} />
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
            <Item item={itemWithoutTitle} dashboardMode={'edit'} />
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
            <Item item={invalidItem} dashboardMode={'edit'} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
