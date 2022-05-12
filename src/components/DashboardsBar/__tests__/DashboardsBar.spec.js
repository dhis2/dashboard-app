import { fireEvent } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider'
import DashboardsBar, { MIN_ROW_COUNT, MAX_ROW_COUNT } from '../DashboardsBar'

// TODO this spy is an implementation detail
jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())

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

test('renders a DashboardsBar with minimum height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('small screen: renders a DashboardsBar with minimum height', () => {
    global.innerWidth = 480
    global.innerHeight = 400

    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: 3 },
        selected: { id: 'rainbow123' },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
    global.innerWidth = 800
    global.innerHeight = 600
})

test('small screen: clicking "Show more" maximizes dashboards bar height', () => {
    global.innerWidth = 480
    global.innerHeight = 400
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: 3 },
        selected: { id: 'fluttershy123' },
    }
    const mockExpandedChanged = jest.fn()
    const { getByLabelText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar
                        expanded={false}
                        onExpandedChanged={mockExpandedChanged}
                    />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    fireEvent.click(getByLabelText('Show more dashboards'))
    expect(asFragment()).toMatchSnapshot()
    expect(mockExpandedChanged).toBeCalledWith(true)
    global.innerWidth = 800
    global.innerHeight = 600
})

test('renders a DashboardsBar with maximum height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MAX_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }
    const { container } = render(
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
    expect(container).toMatchSnapshot()
})

test('renders a DashboardsBar with selected item', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'fluttershy123' },
    }

    const { container } = render(
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
    expect(container).toMatchSnapshot()
})

test('renders a DashboardsBar with no items', () => {
    const store = {
        dashboards: {},
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'rainbow123' },
    }

    const { container } = render(
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
    expect(container).toMatchSnapshot()
})

test('clicking "Show more" maximizes dashboards bar height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: parseInt(MIN_ROW_COUNT) },
        selected: { id: 'fluttershy123' },
    }
    const mockOnExpandedChanged = jest.fn()
    const { getByLabelText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar
                        expanded={false}
                        onExpandedChanged={mockOnExpandedChanged}
                    />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    fireEvent.click(getByLabelText('Show more dashboards'))
    expect(mockOnExpandedChanged).toBeCalledWith(true)
    expect(asFragment()).toMatchSnapshot()
})
