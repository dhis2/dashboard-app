import { within } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider.js'
import DashboardsBar, {
    MIN_ROW_COUNT,
    MAX_ROW_COUNT,
} from '../DashboardsBar.js'

jest.mock('@dhis2/app-runtime-adapter-d2', () => ({
    useD2: () => ({
        d2: {
            currentUser: {
                username: 'rainbowDash',
                id: 'r3nb0d5h',
            },
        },
    }),
}))

const mockStore = configureMockStore()
const dashboards = {
    rainbow123: {
        id: 'rainbow123',
        displayName: 'Rainbow Dash',
        starred: false,
    },
    fluttershy123: {
        id: 'fluttershy123',
        displayName: 'Fluttershy',
        starred: true,
    },
}

jest.mock('@dhis2/app-runtime', () => ({
    useOnlineStatus: () => ({ online: true }),
    useCacheableSection: jest.fn(() => ({
        isCached: false,
        recordingState: 'default',
    })),
}))

test('minimized DashboardsBar has Show more/less button', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }
    const { queryAllByRole, queryByLabelText } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    const links = queryAllByRole('link')
    expect(links.length).toEqual(Object.keys(dashboards).length)
    expect(queryByLabelText('Show more dashboards')).toBeTruthy()
})

test('maximized DashboardsBar does not have a Show more/less button', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MAX_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }
    const { queryByTestId } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar
                        expanded={false}
                        onExpandedChanged={jest.fn()}
                    />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(queryByTestId('showmore-button')).toBeNull()
})

test('renders a DashboardsBar with selected item', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'fluttershy123' },
    }

    const { queryByTestId } = render(
        <WindowDimensionsProvider>
            <Router history={createMemoryHistory()}>
                <Provider store={mockStore(store)}>
                    <DashboardsBar
                        expanded={false}
                        onExpandedChanged={jest.fn()}
                    />
                </Provider>
            </Router>
        </WindowDimensionsProvider>
    )
    expect(
        within(queryByTestId('dashboard-chip-selected-starred')).queryByText(
            'Fluttershy'
        )
    ).toBeTruthy()
    expect(
        within(queryByTestId('dashboard-chip-selected-starred')).queryByText(
            'Rainbow Dash'
        )
    ).toBeNull()
})

test('renders a DashboardsBar with no items', () => {
    const store = {
        dashboards: {},
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }

    const { queryByRole } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar
                        expanded={false}
                        onExpandedChanged={jest.fn()}
                    />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(queryByRole('link')).toBeNull()
})
