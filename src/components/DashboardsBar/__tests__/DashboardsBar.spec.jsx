import { within } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider.jsx'
import DashboardsBar, {
    MIN_ROW_COUNT,
    MAX_ROW_COUNT,
} from '../DashboardsBar.jsx'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
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
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
    useCacheableSection: jest.fn(() => ({
        isCached: false,
        recordingState: 'default',
    })),
    useDataEngine: jest.fn(),
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
    const { queryByLabelText } = render(
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
    expect(queryByLabelText('Show more dashboards')).toBeNull()
})

test('renders a DashboardsBar with selected item', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'fluttershy123' },
    }

    const { queryAllByRole } = render(
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

    const chips = queryAllByRole('link')

    const fluttershyChip = chips.find((lnk) =>
        within(lnk).queryByText('Fluttershy')
    )

    expect(fluttershyChip.firstChild.classList.contains('selected')).toBe(true)

    const rainbowChip = chips.find((lnk) =>
        within(lnk).queryByText('Rainbow Dash')
    )
    expect(rainbowChip.firstChild.classList.contains('selected')).toBe(false)
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
