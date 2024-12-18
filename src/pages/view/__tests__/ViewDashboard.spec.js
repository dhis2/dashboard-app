import { render, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { apiPostDataStatistics } from '../../../api/dataStatistics.js'
import { apiFetchDashboard } from '../../../api/fetchDashboard.js'
import ViewDashboard from '../ViewDashboard.js'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
    getDimensionById: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({ isConnected: true })),
    useCacheableSection: jest.fn(() => ({
        isCached: false,
        recordingState: 'default',
    })),
    useDataEngine: jest.fn(),
    useAlert: jest.fn(() => ({
        show: () => {},
        hide: () => {},
    })),
}))

jest.mock('../../../api/fetchDashboard')

jest.mock(
    '../../../components/DashboardsBar/index.js',
    () =>
        function MockDashboardsBar() {
            return <div>DashboardsBar</div>
        }
)

jest.mock(
    '../FilterBar/FilterBar',
    () =>
        function MockFilterBar() {
            return <div>MockFilterBar</div>
        }
)

jest.mock(
    '../ItemGrid',
    () =>
        function MockItemGrid() {
            return <div>MockItemGrid</div>
        }
)

jest.mock('../../../api/dataStatistics', () => ({
    apiPostDataStatistics: jest.fn(() => {
        return new Promise((resolve) => resolve(true))
    }),
}))

const dashboardId = 'rainbowdash'
const store = {
    dashboards: {
        [dashboardId]: {
            id: dashboardId,
            displayName: 'Rainbow Dash',
            starred: true,
        },
    },

    selected: {
        id: dashboardId,
    },
    passiveViewRegistered: false,
}

window.HTMLElement.prototype.scroll = function () {}

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

test('ViewDashboard renders dashboard', async () => {
    const promise = Promise.resolve({
        id: dashboardId,
        dashboardItems: [],
    })
    apiFetchDashboard.mockResolvedValue(promise)

    const { container } = render(
        <>
            <header />
            <Provider store={mockStore(store)}>
                <Router history={createMemoryHistory()}>
                    <ViewDashboard requestedId={dashboardId} />
                </Router>
            </Provider>
        </>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
    jest.clearAllMocks()
})

test('ViewDashboard does not post passive view to api if passive view has been registered', async () => {
    store.passiveViewRegistered = true
    const promise = Promise.resolve({
        id: dashboardId,
        dashboardItems: [],
    })
    apiFetchDashboard.mockResolvedValue(promise)

    render(
        <>
            <header />
            <Provider store={mockStore(store)}>
                <Router history={createMemoryHistory()}>
                    <ViewDashboard requestedId={dashboardId} />
                </Router>
            </Provider>
        </>
    )

    await act(() => promise)
    expect(apiPostDataStatistics).not.toHaveBeenCalled()
    jest.clearAllMocks()
})

test('ViewDashboard posts passive view to api if passive view has not been registered', async () => {
    store.passiveViewRegistered = false
    const promise = Promise.resolve({
        id: dashboardId,
        dashboardItems: [],
    })
    apiFetchDashboard.mockResolvedValue(promise)

    render(
        <>
            <header />
            <Provider store={mockStore(store)}>
                <Router history={createMemoryHistory()}>
                    <ViewDashboard requestedId={dashboardId} />
                </Router>
            </Provider>
        </>
    )

    await act(() => promise)

    expect(apiPostDataStatistics).toHaveBeenCalled()
    jest.clearAllMocks()
})
